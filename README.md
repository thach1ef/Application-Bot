Discord Bot to handle World of Warcraft applications using GF>D (Google Forms to Discord) : https://discord.gg/7PPZg7r

First you must be using the google form to discord integration (GF>D). Which takes applications filled out via a google form and automatically sends them into your discord. This bot will then help you organize and manage those applications by listening to the trigger channel (main channel your form sends applications to) and when it sees a new app, it will create a brand new channel in the same category which by default would be labeled ApplicantName-ServerName. It will then copy the full application from the main channel into the applicant specific channel. Allowing you to have a applicant specific channel for each app.

To setup please follow the instructions below. If you have any questions, please ask in the discord and I'll be happy to help.

Step 1 : Setup Environment - Follow the instructions on how to setup your environment here : https://anidiots.guide/getting-started/getting-started-long-version .

When you get to step 2 : Getting your coding environment ready. The space you are creating here is going to be where you put the bot files you download here. After you install discord.js make sure you are running the version that we need which is 11.4.2 at least. If after you install discord you are not sure of the version you can type the following to get the version :

npm ls discord.js

If it is lower than 12.3.1 then you'll need to update discord.js by typing the following :

npm i discord.js

This should get you 12.3.1+. Stop when you get to the part listed "Getting your first bot running"

Step 2 : Dev Mode - In Discord make sure you have developer mode enabled. Click the cog next to your name, then appearance and turn on developer mode.

Step 3 : Download Bot - Download all of the files associated with this bot and make sure they are in the directory you created in Step 1 above.

Step 4 : Discord Setup - This bot requires a certain setup in your discord for it to work properly.

The first thing you need to do is make sure you have a specific category setup that will be handling all of your applications. For example in my discord it is simply a category called Applications-Recruitment. One you set that up, youll need to create a trigger channel within that category. This is where the webhook sends all your applications. Again as an example, my discord I simply have Applications.

To get the ID of both the category and the trigger channel, you simply right click on them in discord and copy ID. You will use these in the next step.

Step 5 : Google form setup - Using this bot with the google for, your first question must be character name. This will allow proper applicant specifc channel creation.

Step 6 : config.js Setup - Open the config.js.example file to start inputting your server specific settings. Once you have put in your settings make sure you rename this to just config.js

- ownerID : this is the bot owners ID.
- token : you got this when setting up your discord bot.
- prefix : prefix for bot commands. Dont want to duplicate something else already in use by another bot.
- trigger : channnel ID of where the google form is sending the apps.
- webhook_id : ID of the webhook. This is different than the Bots ID. You get this by going into your server settings for the webhook and looking at the webhook url. You'll need the long number from here only.
- discord_tag : this is the title of the field on your application where you ask the user for their discord tag. Ex: "Discord Tag" on my guilds application.
- character_server_name : this is the title of the field on your application where you ask the user for their character name. On my application we ask for character and server in the following format (character-server). Therefore on my application this field is "Character & Realm".
- battle_tag : this is the title of the field on your application where you ask the user for their battle tag. Ex: "BattleTag" on my guilds application.

Internal Settings - these are for the internal channel you create for your guild to discuss the applicant

- category : category ID where the trigger channel is.
- channel_prefix : set this to whatever you want the new closed channel to start with if anything. Ex "Application-" would result in a new channel of Application-Kammi-Area52 if I were the one submitting an app. Otherwise it would simply be the character_server_name field.
- ranks : the role names of whoever should have access to this channel.
- bots : higher priviledges for bots in order to manage the channels messages etc if you'd like

Open Settings - these are for the open channel that would include the applicant as well

- channel : set open_channel to "TRUE" if you want a 2nd channel created that the applicant can view/comment in.
- category : category ID where the open apps channels should be sent.
- channel_prefix : same above, just for this open channel.
- ranks : same as above, just for this open channel.
- bots : same as above, just for this open channel.

Step 7 : Permissions Setup - This bot will automatically enable permissions to view/comment for specified discord ranks. In my guild I have it setup so anyone with an officer or raider rank may view and comment. You can change this to your own specific needs in the config.js file.

At the server level make sure your bot has the following permissions enabled : manage server, manage roles, manage channels, manage webhooks, read text channels and see voice channels, send messages, manage messages, read message history.

You must also make sure the bot is HIGHER in the list of roles in the channel that you set as your applications trigger channel in step 4. Simply drag the bot in the permissions list above the others.

Lastly, at this time, make sure the bot is only able to access your applications trigger channel. It's currently looking for a webhook message and if it is reading other channels it may inadvertently intercept a non application.

Step 8 : Starting the bot - At this time you need to simply go into your bots directory. Open up a powershell prompt to that directory and then type 

node main.js

At that point the bot should start up and youll see a ready message in your console window.

Note - as this bot is in very limited usage right now you must run this on your own PC/server etc. It is not like many of the mainstream bots out there that are hosted elsewhere. If the need does arise, I will work on getting that setup as well.

-Kammi
