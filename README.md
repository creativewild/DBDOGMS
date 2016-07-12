# DBDOGMS
**Discord Black Desert Online Guild Management System**

This project is intended in taking a shot at creating a discord guild mamagement bot based on discord.js. Character information is stored in a NEDB powered database (stored in ./database). Of course, you will need Node.js running on your server for any of this to work.

### Installation Instructions
1. Clone the repository into the desired directory on your server
2. Run `npm install` to install all dependencies
3. Create the Discord Bot account
 * Navigate to <https://discordapp.com/developers/applications/me>
 * Click New Application
 * Name your bot
 * Skip the __Redirect URI(s)__ section
 * Add a description (optional)
 * Select an app icon (optional)
 * Click __Create Application__
 * On the next page, click __Create a Bot User__ to generate your token
4. Create and **auth.json** file by copying the template file, **auth.json.default**
5. Populate auth.json with your bot's **Token** and **Client/App ID** as noted on the Discord Developers page
6. Start the bot by running `node dbdogms.js` from the project root directory
7. Once the bot has loaded, a URL will be output in the console for you to add the bot to your server
