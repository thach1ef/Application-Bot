const config = {
    // Bot Owner, level 10 by default. A User ID. Should never be anything else than the bot owner's ID.
    //"ownerID": "NNNNNNNNNNNNNNNNNN",

    // Bot Token
    //"token": "YOUR TOKEN HERE",
    // Prefix for bot commands
    "prefix": "&",

    // Application Channel Settings
    //"listener": "NNNNNNNNNNNNNNNNNN",
    //"webhook_id": "NNNNNNNNNNNNNNNNNN",

    // Google Form Settings
    "discord_tag": "Discord Username",
    "character_server_name": "Character & Realm Name",
    "battle_tag": "Battle Tag",

    // Internal Category/Channel Settings
    "internal" : {
        //"category": "NNNNNNNNNNNNNNNNNN",
        "channel_prefix": "Internal-",
        // base ranks to give internal persmissions to
        "ranks": ["Discord Admin"],
        // gives bots higher permissions than the above
        "bots": ["BOTS"]
    },

    // Open/Applicant Category/Channel Settings
    "open" : {
        "channel": "TRUE",
        //"category": "NNNNNNNNNNNNNNNNNN",
        "channel_prefix": "Open-",
        // base ranks to give internal persmissions to
        "ranks": ["Discord Admin"],
        // gives bots higher permissions than the above
        "bots": ["BOTS"]
    },

	"auto_role" : {
		"enabled": "TRUE",
		"role": "Applicant"
	},

    "language": {
        "create_channel": {
            "reason": "New Application",
            "topic": "New Application by %user%"
        }
    }
  };

  module.exports = config;
