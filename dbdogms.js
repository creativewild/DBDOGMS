// Make sure discord.js and nedb have actually been installed first.
try {
  var Discord = require( 'discord.js' );
  var fs = require( 'fs' );
  var Datastore = require( 'nedb' );
} catch( e ) {
  console.log( e.stack );
  console.log( 'Please run `npm install` to install dependencies.' );
}


try {
  var Auth = require( './auth.json' );
} catch( e ) {
  console.log( e.stack );
  console.log( 'Please create an auth.json from auth.json.default!' );
  process.exit();
}

//lib shit
try {
  var Character = require( './lib/Character.js' );
} catch( e ) {
  console.log( e.stack );
  console.log( 'Error loading Character class!' );
  process.exit();
}

try {
  var moment = require( './lib/moment.js' );
  var c = require('cli-color');
} catch( e ) {
  console.log( e.stack );
  console.log( 'Error loading Moment/Colors class.');
}

var bot = new Discord.Client(),
    //Requs for the database, linking the database to the db var
    db  = new Datastore({ filename: 'C:/Users/Gray/Documents/_Vahlok/Vahlok Database/data.db', autoload: true });

//This this prints FUCK. to the console when the bot is loaded successfully.
bot.on("ready", ()=> {
  console.log('To add this bot to your server, open the below URL in your browser:\n'
    + 'https://discordapp.com/oauth2/authorize?client_id=' + Auth.appID + '&scope=bot');
    //bot.sendMessage("174892304635658241", "I'm active now.")
});

  Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
      if (this[i] == obj) {
        return true;
      }
    }
    return false;
  }

  function monospaceColumnPad( string, width = 10, padChar = ' ' )
  {
    if( typeof string !== "string" ) {
      throw new TypeError( 'Initial parameter must be in the form of a String.')
    }
    if( typeof width !== "number" ) {
      throw new TypeError( 'Given column width must be in the form of a Number!' );
    }
    /*
     * Usage: stringFill3("abc", 2) == "abcabc"
     * http://www.webreference.com/programming/javascript/jkm3/3.html
     */
    var multString = function(x, n) {
      var s = '';
      for (;;) {
          if (n & 1) s += x;
          n >>= 1;
          if (n) x += x;
          else break;
      }
      return s;
    }

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

//This is the event catcher for messages. Any time a message is sent through discord and this picks it up, it runs the contents of the function(message) through it's loops.
bot.on("message", function(message){
  var resource1 = ["Warrior", "Sorceress", "Ranger", "Berserker", "Tamer", "Musa", "Maehwa", "Valkyrie", "Wizard", "Witch", "Ninja", "Kunoichi"]
  var resource2 = [0xFF7536, 0xC659F9, 0x54BFFF, 0x2CF3BC, 0xF6356C, 0x47B6FF, 0x9BF3FC, 0xFF8C4A, 0x7E32FC, 0xAA59FF, 0xBA235C, 0xC5186C]
  var createClassRoles = function (classC, classN) {
   bot.createRole(message.server, {
     color : classC,
     hoist : true,
     name : classN,
     permissions : [

     ],
     mentionable : true
   })
   bot.sendMessage(message, "Created role: "+classN)
 }

  //The ! modifier is just a placeholder. I will probably replace it with "Register", so that it will look like (Register Noita Apex, etc.)
  if(message.content.startsWith("+") & message.channel.isPrivate === false) {
    //Enjoy all of my cluster fuck handler variables for the user registration LOL.
    var usrInfo = (message.content);
    var cmdRemove = usrInfo.substring(1);
    var infoArray = cmdRemove.split(" ");
    var char = new Character( infoArray );

    //This is where the "Magic" happens. If and when the user uses the ! modifier, everything following, assuming it's proper, will be stored into the db and printed back using
    //this clusterfuck of code.
    if( infoArray.length != 6 ) {
      console.log("incorrect input.")
      bot.reply(message,"You've entered your data with either too many or too little variables. That or it just did not make sense. Please type !Help for more information.").then(bot.deleteMessage(message).catch(function(err){console.log("Error With Delete + Message Process: "+err)}));
    } else if( resource1.contains(infoArray[2]) && bot.memberHasRole(message.author.id, message.server.roles.get("name", "Vahlok"))) {
        db.findOne( { _id: message.author.id }, function( err, result ) {
          if( result ) {
            console.log("This user is already in the Database.")
            bot.reply(message, "You're aleady in the database, no need to use the register command again player ***" + char.familyName + "***").then(bot.deleteMessage(message).catch(function(err){console.log("Error With Delete + Message Process: "+err)}))
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
              var insChar = new Character( result, 'nedb' );
              if( !err ) {
                bot.reply(message, "Sending you your registration acknowledgement data.")
                bot.sendMessage( message.author.id," ***Your stored information.*** \n"
                          + "```js\nCharacter Name: \"" + char.firstName + "\" \n"
                          + "Family Name: \"" + char.familyName + "\" \n"
                          + "Class: \"" + char.class + "\" \n"
                          + "Character Level: " + char.level + " \n"
                          + "Last recorded AP: " + char.ap + " \n"
                          + "Last recorded DP: " + char.dp + " \n"
                          + "Combined AP/DP: " + " " + char.adp() + "```" )
                  bot.addMemberToRole(message.author.id, message.server.roles.get("name", insChar.class)).then(bot.deleteMessage(message).catch(function(err){console.log("Error With Delete + Message Process: "+err)}))
              } else { bot.reply( message, 'Something went wrong...' );
                console.log( err );
              }
            });
         } else {
           bot.reply( message, 'Something went wrong...' );
           console.log( err );
         }
      })
    } else {
      bot.reply(message, "\nYou have either entered an unauthorized class, or are not a member of Vahlok rank.\n Please correct your class (Capital first letter, correct spelling) and or mention Fahdon.").then(bot.deleteMessage(message).catch(function(err){console.log("Error With Delete + Message Process: "+err)}))
    }
  }

  if( message.content.startsWith( 'whoami' )) {
    db.findOne({ _id : message.author.id }, function ( err, result ){
      if( result ){
        var char = new Character( result, 'nedb' );
        bot.reply( message," ***Your stored information.*** \n"
                  + "```js\nCharacter Name: \"" + char.firstName + "\" \n"
                  + "Family Name: \"" + char.familyName + "\" \n"
                  + "Class: \"" + char.class + "\" \n"
                  + "Character Level: " + char.level + " \n"
                  + "Last recorded AP: " + char.ap + " \n"
                  + "Last recorded DP: " + char.dp + " \n"
                  + "Combined AP/DP: " + " " + char.adp() + "```" );
      } else {
        bot.reply( message, 'Your reccord is not in the database. Have you registered?' );
      }
    })
  }

  //broken and idk why.
  var rmvRoles = function(rlname) {
    bot.removeMemberFromRole(message.author.id, message.server.roles.get("name", rlname), function ( err ) {bot.sendMessage(message, "```"+err.stack+"```")})
  }
  //Update AP (BASE COMPLETE)
  if(message.content.startsWith('~ap')) {
    var sent = (message.content)
    var person = sent.substring(4, 7)

    db.update({ _id : message.author.id }, { $set: { APs: person } }, { multi: false }, function (err, numReplaced) { if(err){bot.sendMessage(message, err)} else if (numReplaced == "1") { bot.sendMessage(message, numReplaced+" Records Replaced. Please query for updated value.")}})

  }
  //Update DP (BASE COMPLETE)
  if(message.content.startsWith('~dp')) {
    var sent = (message.content)
    var person = sent.substring(4, 7)

    db.update({ _id : message.author.id }, { $set: { DPs: person } }, { multi: false }, function (err, numReplaced) { if(err){bot.sendMessage(message, err)} else if (numReplaced == "1") { bot.sendMessage(message, numReplaced+" Records Replaced. Please query for updated value.")}})

  }
  //Update Level (BASE COMPLETE)
  if(message.content.startsWith('~lvl')) {
    var sent = (message.content)
    var person = sent.substring(4, 8)

    db.update({ _id : message.author.id }, { $set: { lvl: person } }, { multi: false }, function (err, numReplaced) { if(err){bot.sendMessage(message, err)} else if (numReplaced == "1") { bot.sendMessage(message, numReplaced+" Records Replaced. Please query for updated value.")}})

  }
  //Delete From DB Command. (BASE COMPLETE-- Needs a fixin)
  if(message.content.startsWith('delMe')) {
    db.findOne({ _id : message.author.id }, function ( err, result ){
      try {
      if( result ){
        var char = new Character( result, 'nedb' );
        var step1 = char.class
        rmvRoles(step1)
      } else {
        console.log("hmm. Not quite.")
      }
    } catch (e) {bot.sendMessage(message, "```"+e.stack+"```")}
    db.remove({ _id : message.author.id }, { multi: true }, function (err, numRemoved) { if(err){bot.sendMessage(message, err)} else if (numRemoved == "0") { bot.sendMessage(message, numRemoved+" Records found. You were not in the Arcane Archives.")} else { bot.sendMessage(message, numRemoved+", Record deleted. You have been removed from my Database Dovahkin.") } })
    })
  }

  if(message.content.startsWith('Create Class Roles Please!') && bot.memberHasRole(message.author.id, message.server.roles.get("name", "Developer"))) {
    console.log("Develoepr has run create role command.")
    bot.sendMessage(message, "Hello Developer! I am creating your roles now!")
    for( var i = 0; i < resource1.length; i++) {
      createClassRoles(resource2[i], resource1[i])
    }
  }

  if(message.content.startsWith('Output Users') && bot.memberHasRole(message.author.id, message.server.roles.get("name", "Developer"))) {
    var catass = message.server.usersWithRole(message.server.roles.get("name", "Vahlok"))
    fs.writeFile('message.txt', catass)
  }

  //Temp fix for list all in database.
  if(message.content.match('refreshGI')) {
    db.find({}, function (err, doc) {
      var outputShit = ""
      if(err){
        console.log(err)
      } else {
        for( var i = 0; i < doc.length; i++){
          var oData = new Character( doc[i], 'nedb')
          outputShit+= monospaceColumnPad(oData.firstName, 16)+" "+monospaceColumnPad(oData.familyName, 16)+" "+monospaceColumnPad(oData.class, 9)+" "+monospaceColumnPad(oData.level.toString(), 5)+" "+monospaceColumnPad(oData.ap.toString(), 4)+" "+monospaceColumnPad(oData.dp.toString(), 4)+" "+monospaceColumnPad(oData.adp().toString(), 5)+"\n"
        }
        //bot.sendMessage("154974615968546816", "```"+monospaceColumnPad("First Name", 13)+monospaceColumnPad("Last Name", 13)+monospaceColumnPad("Class", 10)+monospaceColumnPad("Level", 6)+monospaceColumnPad("AP", 5)+monospaceColumnPad("DP", 5)+monospaceColumnPad("AP/DP", 5)+"\n"+outputShit+"```")
        fs.writeFile("C:/Users/Gray/Documents/Outputs/OutputData.txt", outputShit)
      }})
  }
  //Temp fix for list all in database.
  if(message.content === "getGI") {
    bot.sendFile("154974615968546816","C:/Users/Gray/Documents/Outputs/OutputData.txt").catch(function(err){console.log(err)})
  }

  if(message.content === "!Help") {
    bot.sendMessage(message, "\n`Register Function: +FirstName LastName Class Level AP DP`\n`Query for your stored information: whoami`\n`Update data: ~AP \(new ap\), ~DP \(new dp\), ~lvl \(new level\)`")
  }

  //not working. Will have to fix another time. Supposed to be fore deleting messages and shit lol.
  if(message.content === "FDSUCHANNEL" & message.author.id === "92738910362292224") {
    var meowth = bot.getChannelLogs(message.channel, 5).catch(function(err) {
      console.log("Error getting lgos: ", err)
    }).then(function(logs){
      //bot.sendMessage(message, logs)
      fs.writeFile("./cats", logs).catch(function(err){console.log("error creating/writing file: " + err)})
    })
    //bot.deleteMessages(meowth).catch(function(err){bot.sendMessage(message, "error deleting last 5 messages: "+ err)})
  }

  if(message.content === "setDev" & message.author.id === "92738910362292224") {
    bot.setStatus("away", "Frequent Restarts.").catch(function(err){console.log("error with status setting 1: "+ err)})
  } else if (message.content === "setFree"){
    bot.setStatus("active", "Persist mode. Notify Dr. Gray of downtime/issues.").catch(function(err){console.log("error with status setting 2: "+ err)})
  }

  if(message.channel.isPrivate === true & message.author.id != "209020857446694913"){
    console.log("Private Message")
  }else if (message.author.id != "209020857446694913") {
    console.log("["+c.cyanBright.bold(message.author.username)+"] Sent:\n\n"+c.greenBright.italic(message.content)+"\n\nOn server: "+c.redBright(message.server.name)+"\nOn Channel: "+c.redBright(message.channel.name)+"\nAt time: "+c.redBright(moment().format('LLLL')));
    console.log("-------------------------------------------------------------------------")
  }

});
bot.loginWithToken( Auth.token );
