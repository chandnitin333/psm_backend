import { Request, Response } from "express";
import * as fs from "fs";
import * as jwt from 'jsonwebtoken';
import * as path from "path";
import { getEnvironmentVariable } from "../../environments/env";
import { logger } from "../../logger/Logger";
import {
    claimBillPayment, createBillPaymentLink, getBillByToken,
    getKarStatusByNewusers, listBillPayments, updateBillPaymentStatus,
} from "../../services/main/bill-payment.service";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import multer = require("multer");

const TXN_UPLOAD_DIR = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(TXN_UPLOAD_DIR)) {
    fs.mkdirSync(TXN_UPLOAD_DIR, { recursive: true });
}

const txnStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, TXN_UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const ext = (file.mimetype.split("/")[1] || "bin").toLowerCase();
        cb(null, `psm-${file.fieldname}-${Date.now()}.${ext}`);
    },
});
const txnMulter = multer({
    storage: txnStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cap for screenshots
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
});
const txnUpload = txnMulter.single('transaction_image');

function pickUploadedFilename(req: any): string | null {
    if (req?.file?.filename) return req.file.filename;
    const filesObj = req?.files;
    if (Array.isArray(filesObj)) {
        const f = filesObj.find((x: any) => x?.fieldname === 'transaction_image');
        return f?.filename ?? null;
    }
    return null;
}

export class BillPaymentController {

    /** Authenticated: generate a shareable payment link for a bill. */
    static async generateLink(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7) : null;
            const decoded_user: any = jwt.verify(token, getEnvironmentVariable().jwt_secret);

            const { newuser_id, ward_no, year_id, report_type, bill_data } = req.body || {};
            if (!newuser_id || !ward_no) {
                return _400(res, "newuser_id and ward_no are required");
            }

            const linkToken = await createBillPaymentLink({
                user_id: Number(decoded_user.userId),
                newuser_id: Number(newuser_id),
                ward_no: Number(ward_no),
                year_id: Number(year_id) || null,
                panchayat_id: Number(decoded_user.PANCHAYAT_ID) || null,
                report_type: report_type === '129-2' ? '129-2' : '129-1',
                bill_data: bill_data ?? {},
            });
            return _201(res, "Payment link generated", { token: linkToken });
        } catch (error: any) {
            logger.error("BillPayment.generateLink :: ", error?.message || error);
            return _400(res, error?.message || "Error generating payment link");
        }
    }

    /** Public: bill summary + panchayat scanner images for a token. */
    static async getPublicBill(req: Request, res: Response) {
        try {
            const token = req.params.token;
            if (!token) return _400(res, "token is required");
            const bill = await getBillByToken(token);
            if (!bill) return _404(res, "Bill link not found or expired");
            return _200(res, "Bill fetched", { data: bill });
        } catch (error: any) {
            logger.error("BillPayment.getPublicBill :: ", error?.message || error);
            return _400(res, error?.message || "Error fetching bill");
        }
    }

    /** Public: record a payment claim (cash or UPI + screenshot) against a bill link. */
    static async claimPayment(req: Request, res: Response) {
        try {
            try {
                await new Promise<void>((resolve, reject) => {
                    txnUpload(req, res, (err: any) => err ? reject(err) : resolve());
                });
            } catch (err: any) {
                logger.error("claimPayment upload error :: ", err?.message || err);
                return _400(res, err?.message || 'Transaction image upload failed');
            }

            const token = req.params.token;
            const { kar_type, payment_mode, amount, utr_number, payer_name, payer_mobile, payer_remark } = req.body || {};
            const transaction_image = pickUploadedFilename(req);

            // If the claim comes from a logged-in browser, capture the session
            // username backend-side (not shown on the public UI). The endpoint
            // stays public — an invalid/missing token just means null username.
            let sessionUsername: string | null = null;
            try {
                const authHeader = req.headers.authorization;
                const jwtToken = authHeader ? authHeader.slice(7) : null;
                if (jwtToken && jwtToken !== 'null' && jwtToken !== 'undefined') {
                    const decoded: any = jwt.verify(jwtToken, getEnvironmentVariable().jwt_secret);
                    sessionUsername = decoded?.USERNAME ?? null;
                }
            } catch {
                sessionUsername = null;
            }

            if (!token) return _400(res, "token is required");
            if (kar_type !== 'gruhkar' && kar_type !== 'panikar') {
                return _400(res, "kar_type must be 'gruhkar' or 'panikar'");
            }
            if (payment_mode !== 'cash' && payment_mode !== 'upi') {
                return _400(res, "payment_mode must be 'cash' or 'upi'");
            }
            if (!amount) {
                return _400(res, "amount is required");
            }
            // UPI claims must carry the proof: UTR number + transaction screenshot.
            if (payment_mode === 'upi') {
                if (!utr_number) return _400(res, "utr_number is required for UPI payments");
                if (!transaction_image) return _400(res, "transaction screenshot is required for UPI payments");
            }

            const result = await claimBillPayment(token, {
                kar_type, payment_mode, amount,
                utr_number: utr_number ?? null,
                transaction_image,
                payer_name, payer_mobile,
                payer_remark: payer_remark ?? null,
                username: sessionUsername,
            });
            if (!result) return _404(res, "Bill link not found or expired");
            return _201(res, "Payment recorded. Panchayat will verify it shortly.");
        } catch (error: any) {
            logger.error("BillPayment.claimPayment :: ", error?.message || error);
            return _400(res, error?.message || "Error recording payment");
        }
    }

    /** Authenticated: list payment claims for the logged-in panchayat user. */
    static async listPayments(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7) : null;
            const decoded_user: any = jwt.verify(token, getEnvironmentVariable().jwt_secret);
            const { page_number, status } = req.body || {};
            const result = await listBillPayments(Number(decoded_user.userId), {
                page: Number(page_number) || 1,
                status: status || null,
            });
            return _200(res, "Payments fetched", { data: result.data, totalRecords: result.totalRecords });
        } catch (error: any) {
            logger.error("BillPayment.listPayments :: ", error?.message || error);
            return _400(res, error?.message || "Error fetching payments");
        }
    }

    /** Authenticated: aggregate gruhkar/panikar status per newuser (for report badges). */
    static async karStatusByNewusers(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7) : null;
            const decoded_user: any = jwt.verify(token, getEnvironmentVariable().jwt_secret);
            const newuser_ids = req.body?.newuser_ids;
            const year_id = req.body?.year_id ?? null;
            const report_type = req.body?.report_type ?? null;
            if (!Array.isArray(newuser_ids)) {
                return _400(res, "newuser_ids array is required");
            }
            const map = await getKarStatusByNewusers(Number(decoded_user.userId), newuser_ids, year_id, report_type);
            return _200(res, "Kar status fetched", { data: map });
        } catch (error: any) {
            logger.error("BillPayment.karStatusByNewusers :: ", error?.message || error);
            return _400(res, error?.message || "Error fetching kar status");
        }
    }

    /** Authenticated: verify / reject a payment claim. */
    static async updateStatus(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7) : null;
            const decoded_user: any = jwt.verify(token, getEnvironmentVariable().jwt_secret);
            const paymentId = Number(req.params.id);
            const { status, remark } = req.body || {};
            if (!paymentId) return _400(res, "payment id is required");
            if (status !== 'verified' && status !== 'rejected' && status !== 'claimed') {
                return _400(res, "status must be 'verified', 'rejected' or 'claimed'");
            }
            const ok = await updateBillPaymentStatus(Number(decoded_user.userId), paymentId, status, remark);
            if (!ok) return _404(res, "Payment not found");
            return _200(res, "Payment status updated");
        } catch (error: any) {
            logger.error("BillPayment.updateStatus :: ", error?.message || error);
            return _400(res, error?.message || "Error updating payment status");
        }
    }
}
