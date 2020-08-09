const Discord = require('discord.js');
const webhookEmbedReceived = require('./events/webhookEmbedReceived');

class Bot extends Discord.Client {    
    constructor(options = {}) {
        super(options);
    
        this.loadConfig();
        this.registerEvents();
        this.run();                
    }

    loadConfig() {
        this.config = require('./config.js');        
    }

    registerEvents() {        
        this.on('message', message => {                                
            let channel = message.channel;
            
            // ignores all bots, applications except the webhook posting the applications (webhook_id)            
            if (message.author.bot) {               
                if (message.author.id !== this.config.webhook_id) return;            
            }

            if (!message.webhookID) {            
                const args = message.content.slice(1).trim().split(/ +/g);
                const command = args.shift().toLowerCase();                
                                
                // checks to see if message starts with prefix set in config
                if (message.content.indexOf(this.config.prefix) !== 0) return;                            
                
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
                if(channel.id !== this.config.trigger) {
                    console.log("This is not a proper config trigger channel " + message + " channel: " + channel + " embedmessage: " + message.embed);

                    return;            
                } else {                    
                    webhookEmbedReceived(this, message);
                }
            }            
        });

        // Gets current date and time
        var date = new Date();
     
        // try this if above doesnt work
        // below gives the integer, not the time
        //this.on("error", (e) => console.error(Date.now() + ' ErrorA: ', e.message));         
        this.on("error", (e) => console.error(date + ' ErrorA: ', e.message));         
    }

    run() {
        this.login(this.config.token);
    }
}

//process.on('unhandledRejection', console.error);
process.on('unhandledRejection', (reason, promise) => {

    // Gets current date and time
    var date = new Date();    
    
    console.error(date + ' Unhandled Rejection at:', promise, 'reason', reason);
});

module.exports = Bot;