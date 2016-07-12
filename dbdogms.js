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
  if(message.content.startsWith("!")) {
    //Enjoy all of my cluster fuck handler variables for the user registration LOL.
    var usrInfo = (message.content);
    var cmdRemove = usrInfo.substring(1);
    var infoArray = cmdRemove.split(" ");
    var char = new Character( infoArray );

    //This is where the "Magic" happens. If and when the user uses the ! modifier, everything following, assuming it's proper, will be stored into the db and printed back using
    //this clusterfuck of code.
    if(infoArray.length != 6) {
      console.log("incorrect input.")
      bot.reply(message,"You fucked something up please retry.");
    } else {
      //this is the section for printing back to the discord channel using the reply function
      bot.reply( message," Your stored information is: \n"
                + "Character Name: ***" + char.firstName + "***\n"
                + "Family Name: ***" + char.familyName + "***\n"
                + "Class: ***" + char.class + "***\n"
                + "Character Level: ***" + char.level + "***\n"
                + "Last recorded AP: ***" + char.ap + "***\n"
                + "Last recorded DP: ***" + char.dp + "***\n"
                + "*Combined AP/DP:* " + "***" + char.adp() + "***" );

      //this is the bit for storing the db info for the user into the doc array
      var doc = { _id: message.author.id
        , fN: char.firstName
        , lN: char.familyName
        , class: char.class
        , lvl: char.level
        , APs: char.ap
        , DPs: char.dp
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

  if( message.content.startsWith( 'poo' ) ) {
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
    });
  }

  console.log(message.author+" "+message.content);
});

bot.loginWithToken( Auth.token );
