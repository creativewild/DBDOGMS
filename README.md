# DBDOGMS
Discord Black Desert Online Guild Management System

This project is intended in taking a shot at creating a discord guild mamagement bot based on discord.js.
I am not very good at writing these.


So. Here we go.
This project uses a combination(so far LOL) of node.js, discord.js and nedb.

Now if you are running my application, you'll need to do a few things starting with creating your own discord bot at https://discordapp.com/developers/applications/me and turn it into a bot user account

inside the "mkay" folder, you will want to mkdir safeKek(or whatever you want to name it) and create a file named "poop.js"
or whatever you want to name it
inside that file you will have a module export

module.exports = {
  ass: "BOT_KEY_GOES_HERE"
}

if you don't want my syntax then you'll need to change these sections of code:
//this is to require the file that holds the bot token so that you don't have to store the bot key inside your main code file(in the case of the files on git, this would be the "stuff.js" file as the MAIN code file. poop.js is the file that holds the bots token

var cat = require("./safeKek/poop.js");

//cat is the variable we set earler to require the file "poop.js". If you change that var name you have to change it down here too. ass is the assignment inside of poop.js. If you change the assignment there, you'll need to change it here too.

bot.loginWithToken(cat.ass);
