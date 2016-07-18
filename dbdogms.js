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

var bot = new Discord.Client(),
    //Requs for the database, linking the database to the db var
    db  = new Datastore({ filename: './database/data.db', autoload: true });

//This this prints FUCK. to the console when the bot is loaded successfully.
bot.on("ready", ()=> {
  console.log('To add this bot to your server, open the below URL in your browser:\n'
    + 'https://discordapp.com/oauth2/authorize?client_id=' + Auth.appID + '&scope=bot');
});

//This is the event catcher for messages. Any time a message is sent through discord and this picks it up, it runs the contents of the function(message) through it's loops.
bot.on("message", function(message){

  //The ! modifier is just a placeholder. I will probably replace it with "Register", so that it will look like (Register Noita Apex, etc.)
  if(message.content.startsWith("+")) {
    //Enjoy all of my cluster fuck handler variables for the user registration LOL.
    var usrInfo = (message.content);
    var cmdRemove = usrInfo.substring(1);
    var infoArray = cmdRemove.split(" ");
    var char = new Character( infoArray );

    //This is where the "Magic" happens. If and when the user uses the ! modifier, everything following, assuming it's proper, will be stored into the db and printed back using
    //this clusterfuck of code.
    if( infoArray.length != 6 ) {
      console.log("incorrect input.")
      bot.reply(message,"You fucked something up please retry.");
    } else {
        db.findOne( { _id: message.author.id }, function( err, result ) {
          if( result ) {
            console.log("This user is already in the Database.")
            bot.reply(message, "You're aleady in the database, no need to use the register command again player ***" + char.familyName + "***")
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
                bot.reply( message," Your stored information is: \n"
                  + "Character Name: ***" + insChar.firstName + "***\n"
                  + "Family Name: ***" + insChar.familyName + "***\n"
                  + "Class: ***" + insChar.class + "***\n"
                  + "Character Level: ***" + insChar.level + "***\n"
                  + "Last recorded AP: ***" + insChar.ap + "***\n"
                  + "Last recorded DP: ***" + insChar.dp + "***\n"
                  + "*Combined AP/DP:* " + "***" + insChar.adp() + "***" );
              } else {
                bot.reply( message, 'Something went wrong...' );
                console.log( err );
              }
            });
         } else {
           bot.reply( message, 'Something went wrong...' );
           console.log( err );
         }
      })
    }
  }

  if( message.content.startsWith( 'whoi' ) ) {
    db.findOne({ _id : message.author.id }, function ( err, result ){
      if( result ){
        var char = new Character( result, 'nedb' );
        bot.reply( message," Your stored information is: \n"
                  + "Character Name: ***" + char.firstName + "***\n"
                  + "Family Name: ***" + char.familyName + "***\n"
                  + "Class: ***" + char.class + "***\n"
                  + "Character Level: ***" + char.level + "***\n"
                  + "Last recorded AP: ***" + char.ap + "***\n"
                  + "Last recorded DP: ***" + char.dp + "***\n"
                  + "*Combined AP/DP:* " + "***" + char.adp() + "***" );
      } else {
        bot.reply( message, 'No record found for you, bitchnigga.' );
      }
    })
  }

  if(message.content.startsWith('addRole')) {
    bot.createRole(message.server, {
      color : 0xFF0000,
      hoist : false,
      name : "Testing New Role",
      permissions : [
        "sendMessages"
      ],
      mentionable : true
    })
  }//this works but I need userHasRole to work. There is something fucked up about the role ID I think.

  if(message.content.startsWith('cats')) {
    var sent = (message.content)
    var person = sent.substring(5)

    bot.addMemberToRole(person, bot.role.get.id("Testing New Role"), function (err) {bot.sendMessage(err)})
  }//???????????????????????????????????????????????????????????????????????

  console.log("-----------------------------------------------------------")
  console.log("["+message.author.username+"] Sent:\n\n"+message.content+"\n\nOn server: "+message.server.name+"\nAt time: "+Date());
  console.log("-----------------------------------------------------------")
});

bot.loginWithToken( Auth.token );
