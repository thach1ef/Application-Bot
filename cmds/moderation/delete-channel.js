const Commando = require('discord.js-commando')

module.exports = class DeleteChannelCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'deletechannel',
            aliases: ['delchannel', 'delchan'],
            group: 'moderation',
            memberName: 'deletechannel',
            description: 'Deletes the current channel.',
            userPermissions: ['ADMINISTRATOR'],
        }) 
    }

    run = (message) => {
    //run = async (message) => {
        message.channel.delete()
    }
}