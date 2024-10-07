
# Eganeet API Document

# Login API :

    #Method : POST
    API URL : {{API_URL}}/api/user/login

# Request :
    {
        "user": "yogesh.dongare111@icadjee.com",
        "password": "Password@123",
        "for_otp_pass" : "PASS",
        "email_mobile":"EMAIL",
        "device_id" : "779F9AAA570631E9F5664A6161C6B473XXGGXXGGXX",
        "country_code":"91",
        "otp":"1234",
        "api_key":""
    }

# Response : 
    {
        "USER_ID": 57,
        "FIRST_NAME": "Demo",
        "LAST_NAME": "Faculty",
        "EMAIL": "yogesh.dongare111@icadjee.com",
        "MOBILE": "8989898556",
        "USER_STATUS": "ACTIVE",
        "ROLE": "ROLE_USER_TEACHER",
        "PROFILE_PHOTO": "df_57.png",
        "GENDER": "MALE",
        "CLASS": null,
        "CITY": "NGP",
        "ADDRESS": "NGP",
        "COUNTRY_ID": 101,
        "COUNTRY_NAME": "India",
        "COUNTRY_CODE": "91",
        "STATE_ID": 22,
        "STATE_NAME": "Maharashtra",
        "BOARD_ID": 1,
        "BOARD_NAME": "CBSE Board",
        "BATCH_NAME": "B1",
        "PASSWORD_CHANGED": "1",
        "DEVICE_ID": "779F9AAA570631E9F5664A6161C6B473XXGGXXGGXX",
        "UNIQUE_ID": "779F9AAA570631E9F5664A6161C6B473XXGGXXGGXX",
        "SUCCESS": 1,
        "AUTH_TOKEN": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1NywiZW1haWwiOiJ5b2dlc2guZG9uZ2FyZTExMUBpY2FkamVlLmNvbSIsIm1vYmlsZSI6Ijg5ODk4OTg1NTYiLCJpYXQiOjE2ODk0NDE5MTIsImV4cCI6MTY5OTgwOTkxMn0.PiaINM9W0129MrKSyH_2Z0CUZay6rlHEcR5cgVLHlJw"
    }
        
