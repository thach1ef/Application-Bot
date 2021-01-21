const Commando = require('discord.js-commando')

module.exports = class CategoryAmountsCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'catamounts',
            aliases: ['cata', 'catcount'],
            group: 'moderation',
            memberName: 'catamounts',
            description: 'Gets the amount of channels in each category.',
            userPermissions: ['MANAGE_ROLES'],
        })
    }

    run = async (message) => {
        const { guild } = message
        const categoryChannels = message.guild.channels.cache.filter(channel => channel.type === 'category')

        categoryChannels.forEach(channel => {
            message.channel.send(`Category ${channel.name} has ${channel.children.size} channels.`)
        })        
    }
}    