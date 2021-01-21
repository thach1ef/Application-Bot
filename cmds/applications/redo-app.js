const Commando = require('discord.js-commando')
const processApp = require('@events/process-app.js')
const { client } = require('@root/main.js')

module.exports = class ProcessAppCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'redoapp',
            aliases: ['redo', 'reproc'],
            group: 'applications',
            memberName: 'redoapp',
            description: 'Processes an application that was missed in the listener channel.',
            userPermissions: ['ADMINISTRATOR'],            
        })
    }

    run = async (message) => {       
        const commandMessage = message.id   
        message.delete({ timeout: 500 })        
                      
        message.channel.messages.fetch({ limit : 1, before: commandMessage }).then(messages => {            
            let lastMessage = messages.first()                        
            //const lastMessageEmbed = lastMessage.embeds[0]
            //const redoAppEmbed = new Discord.MessageEmbed(lastMessageEmbed).setTitle('Redo App');
                        
            processApp(client, lastMessage)

        }).catch(err => {
            console.error(err)
        })
    }
}

