const Discord = require('discord.js');
const webhookEmbedReceived = require('./events/webhookEmbedReceived');
const fs = require('fs');
const config = require('./config.js');

const client = new Discord.Client();

client.on('message', message => {                                
    let channel = message.channel;
    
    // ignores all bots, applications except the webhook posting the applications (webhook_id)            
    if (message.author.bot) {               
        if (message.author.id !== config.webhook_id) return;            
    }

    if (!message.webhookID) {            
        const args = message.content.slice(1).trim().split(/ +/g);
        const command = args.shift().toLowerCase();                
                        
        // checks to see if message starts with prefix set in config
        if (message.content.indexOf(config.prefix) !== 0) return;                            
        
        switch (command) {
            case "ping" :
                message.channel.send('Pong!');
                break;
            case "blah" :
                message.channel.send('Meh.');
                break;
        }
    } else {                     
        // once here, it will be a webhook. This if checks for the trigger channel. If not the one assigned, it will return the below error and exit.
        if(channel.id !== config.trigger) {
            fs.appendFileSync('./errorlog.txt', 'This is not a proper config trigger channel ' + message + ' channel: ' + channel + ' embedmessage: ' + message.embed + '\n');
            console.log('This is not a proper config trigger channel ' + message + ' channel: ' + channel + ' embedmessage: ' + message.embed);

            return;            
        } else {                    
            webhookEmbedReceived(client, message);
        }
    }            
});

client.on("error", (e) => {
    var date = new Date();
    fs.appendFileSync('./errorlog.txt', date + 'ErrorA: ' + e.message + '\n');
});

process.on('unhandledRejection', (reason, promise) => {    
    var date = new Date();        
    fs.appendFileSync('./errorlog.txt', date + ' Unhandled Rejection at:' + promise + 'reason' + reason + '\n');
});

client.login(config.token);    