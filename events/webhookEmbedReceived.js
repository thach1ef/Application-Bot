const Discord = require('discord.js');
const { RichEmbed } = require('discord.js');
const fs = require('fs');

// use this to log to text file when ready
// fs.writeFileSync('./log.txt', "");
// fs.appendFile('.log.txt', '')

// writes embed to file for debugging purposes
//fs.writeFileSync('./local_file_embed.json', require('util').inspect(message.embeds[0].fields));        

async function run(bot, message) {    
    let author = message.author;
    let guild = message.guild;

    /*
    let channel = message.channel;
    if(channel.id !== bot.config.trigger) {
        console.log("not proper watcher");
        return;
    }
    */

    // EXTRACT DATA

    // Loops through embed fields to find specified character/realm and discord labels from config file.
    var i;
    var fieldsLength = message.embeds[0].fields.length;
    for (i = 0; i < fieldsLength; i++) {      
      if (message.embeds[0].fields[i].name == bot.config.character_server_name) {                
        // Gets the character and realm from the embed message the bot sends
        characterServerName = message.embeds[0].fields[i].value;            
      }
      if (message.embeds[0].fields[i].name == bot.config.discord_tag) {        
        // Gets the discord tag of the applicant and finds the user ID
        userTag = message.embeds[0].fields[i].value;
      }
      if (message.embeds[0].fields[i].name == bot.config.battle_tag) {        
        // Gets the discord tag of the applicant and finds the user ID
        battleTag = message.embeds[0].fields[i].value;
      }      
    }        
      
    // Takes userID and gets the internal userTag number
    let userID = bot.users.find(user => user.tag === userTag);    

    // If they gave wrong discord tag, this will send the error message in the console
    if(!userID) {      
      //fs.appendFileSync('./log.txt', 'Invalid Discord user tag, ' + userTag + ', for applicant ' + characterServerName + ' at ' + date + '\n', function (err) {                      

      // Gets current date and time
      var date = Date();      
      
      fs.appendFileSync('./errorlog.txt', 'Invalid Discord user tag, ' + userTag + ', for applicant ' + characterServerName + ' at ' + date + '\n');
      console.error('Invalid Discord user tag, ' + userTag + ', for applicant ' + characterServerName + ' at ' + date);        

    } else {      
      userID = userID.id; 
    }

    // CHANNEL WORK

    // Sets and checks to make sure the default application channel is up and running
    let applicationChannel = guild.channels.some(appChannel => appChannel.name === (bot.config.open.channel_prefix + author.username).toLowerCase());
    if(applicationChannel)
        return;

    // Checks to make sure internal category is set properly
    let internal_category = guild.channels.get(bot.config.internal.category);
    if(!internal_category || !internal_category.type === 'category') {
        fs.appendFileSync('./errorlog.txt', 'Internal category is not a valid category.');
        console.error('Internal category is not a valid category.');
        return;
    }    

    // Checks to make sure open category is set properly
    let open_category = guild.channels.get(bot.config.open.category);
    if(!open_category || !open_category.type === 'category') {
        fs.appendFileSync('./errorlog.txt', 'Open category is not a valid category.');
        console.error('Open category is not a valid category.');
        return;
    } 

    // PERMISSIONS
    
    // Sets roles from config for rank setup
    // Internal ranks
    var iranks = [];
    for (var i = 0; i < bot.config.internal.ranks.length; i++) {      
      iranks.push(message.guild.roles.find(role => role.name === bot.config.internal.ranks[i]));
    }
    
    // Internal bot ranks
    var iranksbots = [];
    for (var i = 0; i < bot.config.internal.bots.length; i++) {      
      iranksbots.push(message.guild.roles.find(role => role.name === bot.config.internal.bots[i]));
    }

    // Open ranks
    var oranks = [];
    for (var i = 0; i < bot.config.open.ranks.length; i++) {      
      oranks.push(message.guild.roles.find(role => role.name === bot.config.open.ranks[i]));
    }

    // Open bot ranks
    var oranksbots = [];
    for (var i = 0; i < bot.config.open.bots.length; i++) {      
      oranksbots.push(message.guild.roles.find(role => role.name === bot.config.open.bots[i]));
    }    
    
    // Creates overwrites array for open channel creation
    const open_overwrites = [{
      // everyone
      id: message.guild.id,
      deny: ['MANAGE_MESSAGES','VIEW_CHANNEL']
    },
    {
      // kammi-bot
      id: message.client.user.id,
      allow: ['SEND_MESSAGES','VIEW_CHANNEL','MANAGE_MESSAGES']
    },
    {
      // "Application"
      id: author,
      allow: ['SEND_MESSAGES','VIEW_CHANNEL']
    }]

    // bot.config.open.CHANNEL = TRUE

    // If bot.config.open.channel is set to TRUE in the config file, then this part will be run.
    // Sets conditonal permissions based on proper discord ID and user setings in config.
    if (bot.config.open.channel == "TRUE") {
      // Conditonal based on if the user inputted a proper discord ID
      if(userID) {
        open_overwrites.push({        
          id: userID,          
          allow: ['SEND_MESSAGES','VIEW_CHANNEL']
        });
      }

      // Loops through open rank array and sets permissions.
      for (var i = 0; i < oranks.length; i++) {
        open_overwrites.push({
          id : oranks[i],
          allow: ['SEND_MESSAGES','VIEW_CHANNEL']
        });
      }

      // Loops through open bot ranks array and sets permissions.
      for (var i = 0; i < oranksbots.length; i++) {
        open_overwrites.push({
          id : oranksbots[i],
          allow: ['SEND_MESSAGES','VIEW_CHANNEL','MANAGE_MESSAGES']
        });
      }

      // Creates the open channel
      let openAppChannel = await guild.createChannel(bot.config.open.channel_prefix + characterServerName, 'text', open_overwrites);        

      // Sets the parent category if there is one set in config
      if(!open_category || !open_category.type === 'category') {
        fs.appendFileSync('./errorlog.txt', 'Open category is not set in config. Placing Open applications in base discord channel.');
        console.error('Open category is not set in config. Placing Open applications in base discord channel.');        
      } else {
        openAppChannel.setParent(open_category);      
      }      

      // Sets the topic for the open channel
      openAppChannel.setTopic(bot.config.language.create_channel.topic.replace('%user%', characterServerName));       

      // Copies the embed and sends to open app channel
      const openEmbed = await openAppChannel.send(new RichEmbed(message.embeds[0]));    
      
      // Gets current date and time
      var date = Date();

      fs.appendFileSync('./log.txt', 'Applcation submitted for: ' + userTag + ' / ' + characterServerName + ' at ' + date + '\n', function (err) {      
        if (err) {
          fs.appendFileSync('./errorlog.txt', err + ' at ' + date + '\n');
          return console.log(err);
        }
      });          
        
      // Prints error to their specific channel if they used incorrect discord tag
      if(!userID) {    
        // :x:   
        openEmbed.react('❌'),
        openAppChannel.send('Invalid Discord user tag, ' + userTag + ', for applicant ' + characterServerName + '. Either they gave the wrong Discord ID or filled their application out without following instructions.');
      } else {
        // :ballot_box_with_check:
        openEmbed.react('☑');
      }
    }

    // INTERNAL PERMISSIONS

    // Creates overwrites array for internal channel creation
    const internal_overwrites = [{
      // everyone
      id: message.guild.id,
      deny: ['MANAGE_MESSAGES','VIEW_CHANNEL']
    },
    {
      // kammi-bot
      id: message.client.user.id,
      allow: ['SEND_MESSAGES','VIEW_CHANNEL','MANAGE_MESSAGES']
    },
    {
      // "Application"
      id: author,
      allow: ['SEND_MESSAGES','VIEW_CHANNEL']
    }]


    // Loops through internal rank array and sets permissions.
    for (var i = 0; i < iranks.length; i++) {
      internal_overwrites.push({
        id : iranks[i],
        allow: ['SEND_MESSAGES','VIEW_CHANNEL']
      });
    }

    // Loops through internal bot ranks array and sets permissions.
    for (var i = 0; i < iranksbots.length; i++) {
      internal_overwrites.push({
        id : iranksbots[i],
        allow: ['SEND_MESSAGES','VIEW_CHANNEL','MANAGE_MESSAGES']
      });
    }


    // INTERNAL CHANNEL

    // Creates the internal channel    
    let internalAppChannel = await guild.createChannel(bot.config.internal.channel_prefix + characterServerName, 'text', internal_overwrites); 

    // Sets the parent category and sets topic
    internalAppChannel.setParent(internal_category);    
    internalAppChannel.setTopic(bot.config.language.create_channel.topic.replace('%user%', characterServerName));

    // MESSAGE SEND AND CLEAN UP

    // Copies embed and sends to internal app channel    
    internalAppChannel.send(new RichEmbed(message.embeds[0]));          
    
    // Deletes message from original applications category
    // 1000 = 1 sec
    message.delete(5000);
}

module.exports = run;