//Requires.... The cat variable links to my bots key, as I was strining this dev at the time and did not want everyone to see the key for the bot(Thanks Kat)
var Discord = require("discord.js");
var bot = new Discord.Client();
var cat = require("./safeKek/poop.js");
var fs = require('fs');
//Requs for the database, linking the database to the db var
var Datastore = require('nedb')
  , db = new Datastore({ filename: './data.db', autoload: true});


//This this prints FUCK. to the console when the bot is loaded successfully.
bot.on("ready", ()=> {
  console.log('FUCK.')
});

//This is the event catcher for messages. Any time a message is sent through discord and this picks it up, it runs the contents of the function(message) through it's loops.
//
bot.on("message", function(message){
  /*if(message.content === "Hi"){
    bot.reply(message,"Sup, bitch.");
  };*/

  //The ! modifier is just a placeholder. I will probably replace it with "Register", so that it will look like (Register Noita Apex, etc.)
  if(message.content.startsWith("!")) {
    //Enjoy all of my cluster fuck handler variables for the user registration LOL.
    var usrInfo = (message.content);
    var cmdRemove = usrInfo.substring(1);
    var infoArray = cmdRemove.split(" ");
    var usrFirstName = infoArray[0];
    var usrLastName = infoArray[1];
    var usrLevel = parseInt(infoArray[2]);
    var usrAP = parseInt(infoArray[3]);
    var usrDP = parseInt(infoArray[4]);
    var butts = usrAP+usrDP

    //This is where the "Magic" happens. If and when the user uses the ! modifier, everything following, assuming it's proper, will be stored into the db and printed back using
    //this clusterfuck of code.
    if(infoArray.length != 5) {
      console.log("incorrect input.")
      bot.reply(message,"You fucked something up please retry.");
    } else {
      //this is the section for printing back to the discord channel using the reply function
      bot.reply(message," Your stored information is: \n"
      +"Character Name: ***"+usrFirstName+"***\n"
      +"Family Name: ***"+usrLastName+"***\n"
      +"Character Level: ***"+usrLevel+"***\n"
      +"Last recorded AP: ***"+usrAP+"***\n"
      +"Last recorded DP: ***"+usrDP+"***\n"
      +"*Combined AP/DP:* "+"***"+butts+"***");

      //this is the bit for storing the db info for the user into the doc array
      var doc = { _id: message.author.id
        , fN: usrFirstName
        , lN: usrLastName
        , lvl: usrLevel
        , APs: usrAP
        , DPs: usrDP
      };
      //this is the code for storing the doc array into the database.
      db.insert(doc, function (err, newDoc) {
      });
      //This was some shit for normal file storage. I'd rather use the database, if I Can get querring to work properly.
      /* Filestore type of shit. Not db.
      fs.appendFile("./infos.txt", message.author.id+","+infoArray+"\n", function(err){
        if(err) {
          return console.log(err);
        } else{
          console.log("your shit was saved.");
        }

      }); */
    };
  };

  //This is what I'm fucking mother fuck stuck on god dammit fuck you all.
  //for some fuck your ass reason I can't get the bot to print the db query(find{Same as SELECT in SQL}) to the discord channel using reply OR message.
  //I'm 100% positive this is my noobary with JS at work fuck you all :middle_finger:
  //This is currently preventing me from continuing anything else that I'd like to get done.
  //---------------------------------------------------------------------------

  /* You know it's serious when we have to comment block shit....
  Okay so let's go over the problem.
  The db.find method below outputs the information I need to query and send back to the discord chat only in the function(err,docs).
  When outputting docs using bot.sendMessage(docs); the bot returns [object Object].
  Thanks to the help of Kat and Lido, I've realized somewhat of the direction I have to follow in converting the Object
  into string to be parsed and fed back properly.
  I know the direction but not the method to use, where I do sortof want to figure it out myself, any help / pointer is much welcomed.
  */
  if(message.content.startsWith("poo")) {
    db.find({_id : message.author.id}, function (err,docs){ /* this gonna make me lose my mind */ })
  };

  console.log(message.author+" "+message.content);
});

bot.loginWithToken(cat.ass);
