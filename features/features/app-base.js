const config = require('@root/config.js')
const processApp = require('@events/process-app.js')

const listenerChannel = process.env.TRIGGER_CHANNEL_ID || config.listener
const webhookId = process.env.WEBHOOK_ID || config.webhook_id
const webhookTestId = config.test_webhook_id

module.exports = (client) => {
    client.on('message', (message) => {
        const { channel } = message

        // if not one of our application webhooks, ignore it and exit out
        if ((message.author.id !== webhookId) && (message.author.id !== webhookTestId)) return

        // checks if webhook is not setup in config
        if (!webhookId) {
            console.log('You must set a webhook ID in your config file!')
            return
        }

        // checks if listner channel is not set properly in the config
        if (listenerChannel !== channel.id) {
            console.log('This is not a proper config channel setup. Please check your config file!')
            return
        }

        // at this point we know its our app webhooks so call processApp
        processApp(client, message)
    })
}
