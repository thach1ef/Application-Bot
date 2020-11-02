const Discord = require('discord.js');
const webhookEmbedReceived = require('./events/webhookEmbedReceived');
const fs = require('fs');
const config = require('./config.js');

const client = new Discord.Client();

// adding for command handler
client.commands = new Discord.Collection();

// creates a collection of the command files in the commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// requires the specific files found above
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.on('message', message => {                                
    let channel = message.channel;
    
    // ignores all bots, applications except the webhook posting the applications (webhook_id)            
    if (message.author.bot) {               
        if (message.author.id !== config.webhook_id) return;            
    }

    // if its a webhook this checks for the trigger channel. If not the one assigned, it will return the below error and exit.
    if (message.webhookID) {        
        if(channel.id !== config.trigger) {
            fs.appendFileSync('./errorlog.txt', 'This is not a proper config trigger channel ' + message + ' channel: ' + channel + ' embedmessage: ' + message.embed + '\n');
            console.log('This is not a proper config trigger channel ' + message + ' channel: ' + channel + ' embedmessage: ' + message.embed);
            return;            

        } else {                    
            webhookEmbedReceived(client, message);
        }        
    }

    // if not a webhookID then lets check for it being a bot command
    if (!message.webhookID) {            
        const args = message.content.slice(1).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();                
                        
        // if message doesnt start with prefix, exit
        if (message.content.indexOf(config.prefix) !== 0) return;                            

        // gets commamnd names and aliases and if they dont exist, exits
        const command = client.commands.get(commandName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        
        if (!command) return;

        // gives feedback when args is set to true in a command file
        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;
            
            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }
            return message.channel.send(reply);
        }

        // loops through the commands and gets the one called and executes it
        try {
            command.execute(message, args);	        
        } catch (error) {
            console.error(error);
            fs.appendFileSync('./errorlog.txt', 'There was an error trying to execute that command!' + '\n');
	        message.reply('There was an error trying to execute that command!');
        }
    }
});

client.on("error", (e) => {
    var date = new Date();
    fs.appendFileSync('./errorlog.txt', date + 'ErrorA: ' + e.message + '\n');    
    
    if (config.testing === "true") {
        console.error(date + ' ErrorA: ', e.message);
    }    
});

process.on('unhandledRejection', (reason, promise) => {    
    var date = new Date();        
    fs.appendFileSync('./errorlog.txt', date + ' Unhandled Rejection at:' + promise + 'reason' + reason + '\n');

    if (config.testing === "true") {
        console.error(date + ' Unhandled Rejection at:', promise, 'reason', reason);
    }    
});

client.login(config.token);    