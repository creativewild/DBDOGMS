var Discord = require("discord.js");
var bot = new Discord.Client();
var cat = require("./safeKek/poop.js");
var fs = require('fs');

var Datastore = require('nedb')
  , db = new Datastore({ filename: './data.db', autoload: true});

bot.on("ready", ()=> {
  console.log('FUCK.')
});

bot.on("message", function(message){
  /*if(message.content === "Hi"){
    bot.reply(message,"Sup, bitch.");
  };*/
  if(message.content.startsWith("!")) {
    var usrInfo = (message.content);
    var cmdRemove = usrInfo.substring(1);
    var infoArray = cmdRemove.split(" ");
    var usrFirstName = infoArray[0];
    var usrLastName = infoArray[1];
    var usrLevel = parseInt(infoArray[2]);
    var usrAP = parseInt(infoArray[3]);
    var usrDP = parseInt(infoArray[4]);
    var butts = usrAP+usrDP

    if(infoArray.length != 5) {
      console.log("incorrect input.")
      bot.reply("You fucked something up please retry.");
    } else {
      bot.reply(message," Your stored information is: \n"
      +"Character Name: ***"+usrFirstName+"***\n"
      +"Family Name: ***"+usrLastName+"***\n"
      +"Character Level: ***"+usrLevel+"***\n"
      +"Last recorded AP: ***"+usrAP+"***\n"
      +"Last recorded DP: ***"+usrDP+"***\n"
      +"*Combined AP/DP:* "+"***"+butts+"***");

      var doc = { _id: message.author.id
        , fN: usrFirstName
        , lN: usrLastName
        , lvl: usrLevel
        , APs: usrAP
        , DPs: usrDP
      };
      db.insert(doc, function (err, newDoc) {
      });
      /* Filestore type of shit.
      fs.appendFile("./infos.txt", message.author.id+","+infoArray+"\n", function(err){
        if(err) {
          return console.log(err);
        } else{
          console.log("your shit was saved.");
        }

      }); */
    };
  };

    //var cheeky = "'"+message.author.id+"'";

    if(message.content.startsWith("poo")) {
      db.find({ _id: message.author.id }, function (err, doc) {

      });
    };

  console.log(message.author+" "+message.content);
});

bot.loginWithToken(cat.ass);
