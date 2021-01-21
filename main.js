require('module-alias/register')

const path = require('path')
const Commando = require('discord.js-commando')

const config = require('@root/config.js')
const loadFeatures = require('@root/features/load-features')

const client = new Commando.CommandoClient({
    owner: config.ownerID,    
    commandPrefix: config.prefix
})


client.on('ready', async () => {    

    client.registry
        .registerGroups([            
            ['moderation', 'Moderation commands'],     
            ['applications', 'Application Commands'],
        ])
        .registerDefaults()
        .registerCommandsIn(path.join(__dirname, 'cmds'))
            
    loadFeatures(client)

    console.log('The client is ready!')    
})

module.exports.client = client
client.login(config.token)