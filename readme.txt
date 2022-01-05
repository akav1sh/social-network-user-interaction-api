• Date: 05/01/2022
• Name of the exercise: Exercise 2 in JS Course

Details about submitters:
• Full Name: Ronel David Gekhman
• ID Number: 313564510
• Email address: roneldavidge@mta.ac.il

• Full Name: Karina Batmanishvili
• ID Number: 321800898
• Email address: karinaba@mta.ac.il

Github: https://github.com/akav1sh/social-network-user-interaction-api

Notes:

API settings instructions:
1. cd to package.json directory
2. run "npm install"
3. run: "node index.js"

Postman test collection instructions:
1. Import "js-ex2.postman_collection.json" in postman workspace.
2. Press on js-ex collection.
3. Press on the "Run" button.
4. Optional - check box "Save responses".
5. Press on Run js-ex.

External modules used:
1. Express - module we saw in class for building APIs.
2. http-status-codes - module for making http status codes more readable.
3. dotenv - module for configuring environment variables, our use was for holding the SECRET key of our jwt encryption/decryption not in a variable and not in the DB, and if we expand to several servers they all can use the same key from the environment.
4. node-schedule - module for timed and periodic scheduling of jobs, we used it for removing the expired tokens from the DB every 10 mins as requested.
5. jsonwebtoken - module for creating, verifying and handling tokens for authentication, we found this module after looking for modern and popular tokens to use with express and it was one of the best options, then after a research we used this module for creating our token with id information which is pretty safe to pass, using a SECRET key that was only available in the server environment and used the feature of setting expiration data to 10 mins, then we used it to verify it with the same SECRET. Other than that we placed our active keys in the DB not related to any user and handled their deletion after 10 mins so the DB don't grow with expired tokens garbage. Our token validation firstly looking for it in the DB and then verifying it with the module feature. 

