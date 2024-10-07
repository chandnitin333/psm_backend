# PSM API Document

# District List API :

    #Method : POST
    API URL : {{API_URL}}/api/admin/district-list

# Request :

    {
        "page_number": 2
    }

# Response :

    {
        "SUCCESS": 1,
        "code": 200,
        "data": [
            {
            "DISTRICT_ID": 49,
            "DISTRICT_NAME": "Umred"
            }
        ],
        "page": 2,
        "limit": 10
    }

# Add District API :

    #Method : POST
    API URL : {{API_URL}}/api/admin/add-district

# Request :

    {
        "district_name": "Nagpur"
    }

# Response :

    {
        "SUCCESS": 1,
        "code": 200
    }

# get District by Id API :

    #Method : GET
    API URL : {{API_URL}}/api/admin/get-district/1

# Request :

# Response :

    {
        "SUCCESS": 1,
        "code": 200,
        "data": {
            "DISTRICT_ID": 1,
            "DISTRICT_NAME": "नागपूर "
        }
    }

# Update District API :

    #Method : PUT
    API URL : {{API_URL}}/api/admin/update-district

# Request :

    {
        "district_id": 49,
        "district_name": "Umred"
    }

# Response :

    {
        "SUCCESS": 1,
        "code": 200,
    }


# Delete District API :

    #Method : DELETE
    API URL : {{API_URL}}/api/admin/district/48

# Request :


# Response :

    {
        "SUCCESS": 1,
        "code": 200,
    }
