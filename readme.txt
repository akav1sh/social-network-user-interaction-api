• Date: 19/02/2022
• Name of the exercise: Exercise 3 in JS Course - ReactJS

Details about submitters:
• Full Name: Ronel David Gekhman
• ID Number: 313564510
• Email address: roneldavidge@mta.ac.il

• Full Name: Karina Batmanishvili
• ID Number: 321800898
• Email address: karinaba@mta.ac.il

Github: https://github.com/akav1sh/social-network-user-interaction-api


API settings instructions:
1. cd to package.json directory
2. run "npm install"
3. run: "node index.js"
4. open browser on url: localhost:2718/
5. login with admin credentials or register a new user.

Admin credentials:
Email: root@mta.ac.il
Password: Badgroot123


Important notes:
1. In order for you to open 2 users at the same time, you should use your regular browser and incognito tab OR a different browser.
2. Broadcast appears for ALL users, including Admin user himself (meaning admin sees his own message).
3. Refreshing on any page returns to the homepage (posts page), this is intended behaviour.
4. Random user icon generated upon refresh, pressing the website's icon (rubiks cube), creating a new post or reenter posts page.
5. Refreshing the page entirely refreshes the indicators (meaning removing them even if user did not go watch them),
   we have a solution idea for this but didn't implement it because of time shortage, the idea is to store the information
   in the local storage.
6. In admin page, for better mobile view, removed the filter buttons.
7. When sending broadcase/message/post there is no response for user to know he succeeded in send (we didn't want to do
   this with alert tool), this is not very UX correct. There is however an indicator message for when the action did NOT 
   succeed. Implementing a pop-up or a timed message is a good idea to answer this for UX part if we had a bit more time.
8. We show N = 3 posts and messages.

