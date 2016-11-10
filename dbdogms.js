// Make sure discord.js and nedb have actually been installed first.
try {
  var Discord = require( "discord.js" );
  var fs = require( "fs" );
  var Datastore = require( "nedb" );
} catch( e ) {
  console.log( e.stack );
  console.log( "Please run `npm install` to install dependencies." );
}

try {
  var Auth = require( "./auth.json" );
  var sets = require("./setTest.json");
} catch( e ) {
  console.log( e.stack );
  console.log( "Please create an auth.json from auth.json.default!" );
  process.exit();
}

//lib shit
try {
  var Character = require( "./lib/Character.js" );
} catch( e ) {
  console.log( e.stack );
  console.log( "Error loading Character class!" );
  process.exit();
}

try {
  var moment = require( "./lib/moment.js" );
  //var c = require("cli-color");
} catch( e ) {
  console.log( e.stack );
  console.log( "Error loading Moment/Colors class.");
}

var bot = new Discord.Client(),
    //Requs for the database, linking the database to the db var
  db  = new Datastore({ filename: "C:/Users/Gray/Documents/_Vahlok/Vahlok Database/data.db", autoload: true });
//This this prints FUCK. to the console when the bot is loaded successfully.
bot.on("ready", ()=> {
  console.log("To add this bot to your server, open the below URL in your browser:\n"
    + "https://discordapp.com/oauth2/authorize?client_id=" + Auth.appID + "&scope=bot");
    //bot.sendMessage("174892304635658241", "I"m active now.")
});
Array.prototype.contains = function(obj) {
  var i = this.length;
  while (i--) {
    if (this[i] == obj) {
      return true;
    }}
  return false;
};
function monospaceColumnPad( string, width = 10, padChar = " " )
  {
  if( typeof string !== "string" ) {
    throw new TypeError( "Initial parameter must be in the form of a String.");
  }
  if( typeof width !== "number" ) {
    throw new TypeError( "Given column width must be in the form of a Number!" );
  }
  /*
   * Usage: stringFill3("abc", 2) == "abcabc"
   * http://www.webreference.com/programming/javascript/jkm3/3.html
   */
  var multString = function(x, n) {
    var s = "";
    for (;;) {
      if (n & 1) s += x;
      n >>= 1;
      if (n) x += x;
      else break;
    }
    return s;
  };
  var strWidthDiff = width - string.length;
  if( strWidthDiff > 0 ) {
    if( strWidthDiff == 1 ) return string + padChar;
    else return string + multString( padChar, strWidthDiff );
  } else if ( strWidthDiff < 0 ) {
    return string.substr( 0, ( width - 1 ) );
  } else {
    return string;
  }
}

//This is the event catcher for messages. Any time a message is sent through discord and this picks it up, it runs the contents of the function(message) through it"s loops.
bot.on("message", function(message){
  var resource1 = ["Warrior", "Sorceress", "Ranger", "Berserker", "Tamer", "Musa", "Maehwa", "Valkyrie", "Wizard", "Witch", "Ninja", "Kunoichi"];
  var resource2 = [0xFF7536, 0xC659F9, 0x54BFFF, 0x2CF3BC, 0xF6356C, 0x47B6FF, 0x9BF3FC, 0xFF8C4A, 0x7E32FC, 0xAA59FF, 0xBA235C, 0xC5186C];
  var sent = (message.content);
  var person = sent.substring(4, 7);
  var damnRole = function(fucking){
    var meow = message.guild.roles.find("name", fucking).id;
    return meow.toString();
  };
  var createClassRoles = function (classC, classN) {
    message.guild.createRole({
      color : classC,
      name : classN,
      hoist : true,
      permissions : [

      ],
      mentionable : true
    });
    //message.channel.sendMessage( "Created role: "+classN);
  };
  var rmvClassRoles = function (role) {
    try{
      message.guild.roles.find("name", role).delete();
    } catch(e) {
      console.log("```"+e.stack+"```");
    }
  };
  var rmvRoles = function(rlname) {
    message.guild.member(message.author).removeRole(rlname), function ( err ) {message.channel.sendMessage( "```"+err.stack+"```");};
  };
  //Registration command     message.member.roles.exists("name", sets.OFFICER_RANK)
  if(sent.startsWith("+") && message.member.roles.exists("name", sets.MEMBER_RANK) && message.channel.id == "174892304635658241") {
    //Enjoy all of my cluster fuck handler variables for the user registration LOL.
    var usrInfo = (sent);
    var cmdRemove = usrInfo.substring(1);
    var infoArray = cmdRemove.split(" ");
    var char = new Character( infoArray );

    //This is where the "Magic" happens. If and when the user uses the ! modifier, everything following, assuming it"s proper, will be stored into the db and printed back using
    //this clusterfuck of code.
    if( infoArray.length != 6 ) {
      console.log("incorrect input.");
      message.reply("You've entered your datad with either too many or too little variables, or it just did not make sense. Please type !Help for more information.").then(message.delete(message).catch(function(err){console.log("Error With Delete + Message Process: "+err);}));
    } else if( resource1.contains(infoArray[2])) {
      db.findOne( { _id: message.author.id }, function( err, result ) {
        if( result ) {
          console.log("This user is already in the Database.");
          message.reply( "You're aleady in the database, no need to use the register command again player ***" + char.familyName + "***").then(message.delete(message).catch(function(err){console.log("Error With Delete + Message Process: "+err);}));
        } else if ( !err ){
          //this is the section for printing back to the discord channel using the reply function
          var doc = { _id: message.author.id
            , fN: char.firstName
            , lN: char.familyName
            , class: char.class
            , lvl: char.level
            , APs: char.ap
            , DPs: char.dp
          };
          db.insert( doc, function( err, result ) {
            var insChar = new Character( result, "nedb" );
            if( !err ) {
              message.reply( "Sending you your registration acknowledgement data.");
              message.guild.member(message.author).sendMessage(" ***Your stored information.*** \n"
                        + "```js\nCharacter Name: \"" + char.firstName + "\" \n"
                        + "Family Name: \"" + char.familyName + "\" \n"
                        + "Class: \"" + char.class + "\" \n"
                        + "Character Level: " + char.level + " \n"
                        + "Last recorded AP: " + char.ap + " \n"
                        + "Last recorded DP: " + char.dp + " \n"
                        + "Combined AP/DP: " + " " + char.adp() + "```" );
              message.guild.member(message.author).addRole(damnRole(insChar.class)).then(message.delete(message).catch(function(err){console.log("Error With Delete + Message Process: "+err);}));
            } else { message.reply( "Something went wrong..." );
              console.log( err );
            }
          });
        } else {
          message.reply( "Something went wrong..." );
          console.log( err );
        }
      });
    } else {
      message.reply( "\nYou have either entered an unauthorized class, or are not a member of Vahlok rank.\n Please correct your class (Capital first letter, correct spelling) and or mention Fahdon.").then(message.delete(message).catch(function(err){console.log("Error With Delete + Message Process: "+err);}));
      //message.reply("This feature is disabled for now. Thank you for understanding.").then(message.delete(message).catch(function(err){console.log("Error With Delete + Message Process: "+err);}));
    }
  }
  //Personal whois query
  if( sent.startsWith( "whoami" )) {
    db.findOne({ _id : message.author.id }, function ( err, result ){
      if( result ){
        var char = new Character( result, "nedb" );
        message.reply(" ***Your stored information.*** \n"
                  + "```js\nCharacter Name: \"" + char.firstName + "\" \n"
                  + "Family Name: \"" + char.familyName + "\" \n"
                  + "Class: \"" + char.class + "\" \n"
                  + "Character Level: " + char.level + " \n"
                  + "Last recorded AP: " + char.ap + " \n"
                  + "Last recorded DP: " + char.dp + " \n"
                  + "Combined AP/DP: " + " " + char.adp() + "```" );
      } else {
        message.reply( "Your reccord is not in the database. Have you registered?" );
      }
    });
  }
  //Personal AP update
  if(sent.startsWith("~ap")) {
    db.update({ _id : message.author.id }, { $set: { APs: person } }, { multi: false }, function (err, numReplaced) { if(err){message.channel.sendMessage( err);} else if (numReplaced == "1") { message.channel.sendMessage( numReplaced+" Records Replaced. Please query for updated value.");}});
  }
  //Personal DP update
  if(sent.startsWith("~dp")) {
    db.update({ _id : message.author.id }, { $set: { DPs: person } }, { multi: false }, function (err, numReplaced) { if(err){message.channel.sendMessage( err);} else if (numReplaced == "1") { message.channel.sendMessage( numReplaced+" Records Replaced. Please query for updated value.");}});
  }
  //Personal level update
  if(sent.startsWith("~lvl")) {
    db.update({ _id : message.author.id }, { $set: { lvl: person } }, { multi: false }, function (err, numReplaced) { if(err){message.channel.sendMessage( err);} else if (numReplaced == "1") { message.channel.sendMessage( numReplaced+" Records Replaced. Please query for updated value.");}});
  }
  //Delete user entry From DB Command.
  if(sent.startsWith("delMe")) {
    db.findOne({ _id : message.author.id }, function ( err, result ){
      try {
        if( result ){
          var char = new Character( result, "nedb" );
          var step1 = char.class;
          var kaw = damnRole(step1);
          rmvRoles(kaw);
        } else {
          console.log("hmm. Not quite.");
        }
      } catch (e) {message.channel.sendMessage( "```"+e.stack+"```");}
      db.remove({ _id : message.author.id }, { multi: true }, function (err, numRemoved) { if(err){message.channel.sendMessage( err);} else if (numRemoved == "0") { message.channel.sendMessage( numRemoved+" Records found. You were not in the Arcane Archives.");} else { message.channel.sendMessage("Record deleted. You have been removed from my Database");}});
    });
  }
  //Temp fix for list all in database.
  if(sent.match("refreshGI") && message.member.roles.exists("name", sets.OFFICER_RANK)) {
    db.find({}, function (err, doc) {
      var outputShit = "";
      if(err){
        console.log(err);
      } else {
        for( var i = 0; i < doc.length; i++){
          var oData = new Character( doc[i], "nedb");
          outputShit+= monospaceColumnPad(oData.firstName, 16)+" "+monospaceColumnPad(oData.familyName, 16)+" "+monospaceColumnPad(oData.class, 9)+" "+monospaceColumnPad(oData.level.toString(), 5)+" "+monospaceColumnPad(oData.ap.toString(), 4)+" "+monospaceColumnPad(oData.dp.toString(), 4)+" "+monospaceColumnPad(oData.adp().toString(), 5)+"\n";
        }
        fs.writeFile("C:/Users/Gray/Documents/Outputs/OutputData.txt", outputShit);
      }});
    message.channel.sendMessage("Refreshed User Data File for ***"+moment().format("LLLL")+"***");
  }
  //Temp fix for list all in database.
  if(sent.match("getGI") && message.member.roles.exists("name", sets.OFFICER_RANK)) {
    bot.channels.get("154974615968546816").sendFile("C:/Users/Gray/Documents/Outputs/OutputData.txt").catch(function(err){console.log(err);});
    message.channel.sendMessage( "File Uploaded.");
  }
  //Help file
  if(sent.toLowerCase() === "!help") {
    //message.channel.sendMessage("This feature is currently being reworked. Thanks!");
    //message.channel.sendMessage( "\n`Register Function: +FirstName LastName Class Level AP DP`\n`Query for your stored information: whoami`\n`Update data: ~AP \(new ap\), ~DP \(new dp\), ~lvl \(new level\)`");
    fs.readFile("C:/Users/Gray/Documents/GitHub/DBDOGMS/help.txt", function (err, data){
      if (err) {
        return console.error(err);
      }
      message.channel.sendMessage(data.toString());
    });
  }
  //Class role creation
  if(sent.match("Create Class Roles Please!") && message.member.roles.exists("name", "Developer")) {
    console.log("Develoepr has run create role command.");
    message.channel.sendMessage( "Hello Developer! I am creating your roles now!");
    for( var i = 0; i < resource1.length; i++) {
      createClassRoles(resource2[i], resource1[i]);
      console.log("Created "+resource1[i]+" Role at "+moment().format("LLLL"));
    }
  }
  //Class role deletion
  if(sent.match("Delete Class Roles Please!") && message.member.roles.exists("name", "Developer")) {
    console.log("Developer has run delete role command.");
    message.channel.sendMessage("Hello developer. I am deleting your roles.");
    for( var rm = 0; rm < resource1.length; rm++) {
      rmvClassRoles(resource1[rm]);
    }
  }
  //Broken but, spits out users in role described, is what it will do.
  if(sent.match("Output Users") && message.member.roles.exists("name", "Developer")) {
    var catass = message.guild.members.roles.get("name", "Vahlok").name;
    fs.writeFile("message.txt", catass);
  }
  //For setting persist and dev mode.
  if(sent === "setDev" && message.author.id === sets.MASTER) {
    bot.user.setStatus("away", "Frequent Restarts.").catch(function(err){console.log("error with status setting 1: "+ err);});
    console.log("Development Mode Set.");
  } else if (sent === "setFree"){
    bot.user.setStatus("active", "Happy birthday Asuna!!").catch(function(err){console.log("error with status setting 2: "+ err);});
    console.log("Persistent Mode Set.");
  }

  if(sent == "Shutdown Please." && message.author.id === sets.MASTER) {
    console.log("Shuting down");
    bot.destroy();
  }

  /*if(sent.startsWith("catTest")){
    var vcList = bot.channels.find("158432201816539136").members;
    message.channel.sendMessage(vcList);
    console.log(vcList);
  }*/
  /*if(message.channel.isPrivate === true & message.author.id != "209020857446694913"){
    console.log("Private Message")
  }else if (message.author.id != "209020857446694913") {
    console.log("["+c.cyanBright.bold(message.author.username)+"] Sent:\n\n"+c.greenBright.italic(sent)+"\n\nOn server: "+c.redBright(message.server.name)+"\nOn Channel: "+c.redBright(message.channel.name)+"\nAt time: "+c.redBright(moment().format("LLLL")));
    console.log("-------------------------------------------------------------------------")
  }
*/
});
bot.login( Auth.token );
