import { Request, Response, NextFunction } from "express";
import * as path from "path";
import { logger } from "../logger/Logger";
const fs = require("fs");

// sharp is optional — if it isn't installed the middleware simply serves the
// original image (via the static handler), so the app never crashes.
let sharp: any = null;
try {
    sharp = require("sharp");
} catch {
    sharp = null;
    logger.info("imageResize: 'sharp' not installed — serving original images (run `npm install sharp` to enable resize-on-serve).");
}

const UPLOAD_DIR = "uploads";
const THUMB_DIR = path.join(UPLOAD_DIR, ".thumb");

/**
 * Resize-on-serve for /uploads images.
 *   GET /uploads/<file>?w=600  →  width-capped JPEG (cached on disk).
 * Without ?w (or if sharp is missing / any error) it calls next() so
 * express.static serves the ORIGINAL file unchanged. The first request for a
 * given width writes a cached thumbnail; subsequent requests serve the cache,
 * so reports/print load small images fast without touching the originals.
 */
export async function imageResize(req: Request, res: Response, next: NextFunction) {
    const w = parseInt(String(req.query.w || ""), 10);
    if (!sharp || !w || w <= 0 || w > 4000) return next();

    // req.path is relative to the /uploads mount, e.g. "/psm-....jpeg"
    const filename = decodeURIComponent(String(req.path || "").replace(/^\/+/, ""));
    // only plain image filenames (no sub-paths / traversal)
    if (!/^[\w.\- ]+\.(jpe?g|png|webp)$/i.test(filename)) return next();

    const srcPath = path.join(UPLOAD_DIR, filename);
    if (!fs.existsSync(srcPath)) return next();

    const cachePath = path.join(THUMB_DIR, `w${w}-${filename}.jpg`);
    try {
        if (!fs.existsSync(cachePath)) {
            await fs.promises.mkdir(THUMB_DIR, { recursive: true });
            await sharp(srcPath)
                .rotate()                                   // honour EXIF orientation
                .resize({ width: w, withoutEnlargement: true })
                .jpeg({ quality: 65 })
                .toFile(cachePath);
        }
        res.type("image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.sendFile(path.resolve(cachePath));
    } catch (err: any) {
        logger.error("imageResize :: " + (err?.message || err));
        return next();   // any failure → serve the original
    }
}
