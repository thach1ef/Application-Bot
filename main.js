require('module-alias/register')

const path = require('path')
const Commando = require('discord.js-commando')

const fs = require('fs-extra')

const config = require('@root/config.js')
const loadFeatures = require('@root/features/load-features')

// Set up logging files
var log = './logs/log.txt';
var errorlog = './logs/errorlog.txt'

fs.ensureFileSync(log)
fs.ensureFileSync(errorlog)

//Create Discord Client
const client = new Commando.CommandoClient({
    owner: process.env.OWNER_ID || config.ownerID,
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
client.login(process.env.TOKEN || config.token)
