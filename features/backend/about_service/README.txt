about_service/
├── src/
│   ├── server.js            # Entry point with dynamic imports & dotenv config
│   ├── routes/              # Express route definitions
│   └── controllers/         # Business logic (getAboutData, etc.)
└── package.json             # Service metadata and scripts

To Install:

1. Configure .env file
    a. From root directory: "cd environs/development" 
    b. 'cp env_example.txt .env'
    c. update/edit fields to reflect actual host/user/pass/url
    d. Repeat for environs/production
    e. Text/Call Eli if you are confused

2. Return to the about_service directory

3. "npm install"

4. "npm start"

API Endpoint:

/api/about -> Returns all data from the about table in db schema

*Ensure SSL cert "global-bundle.pem" is installed in the /shared/certs folder for AWS DB connection*
