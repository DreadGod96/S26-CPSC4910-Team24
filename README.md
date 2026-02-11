# S26-CPSC4910-Team24
Good (Truck) Driver Incentive Program

# Website
The website was built using React.

Prerequisites: 
         node.js
         .env properly configured in /environs/development
         AWS DB SSL Cert
         
How to start the backend:
1. Navigate to

         "/features/backend/about_service"

3. Install dependencies:
   
         "npm install"
   
5. Start localhost-DB connection:

         "npm start"
    
How to start the frontend:
1. Navigate to

         "/features/frontend/myreactapp"

3. Install dependencies:
   
         "npm install"
   
5. Start localhost site:

         "npm start"
      
As of right now, the website is only hosted locally

<br>
<br>

Workflows (Showcasing DevOps):

         1. Branch new feature
         2. Merge new feature into dev for demo
         3. Push to dev cloud via configs in /environs/development for demo (automate)
         4. Post demo, merge into main
         5. Post-demo, push to production cloud via configs in /environs/production for release (automate)

**TODO: Automate workflows via github actions

**TODO: Create seperate cloud environments and link with code
