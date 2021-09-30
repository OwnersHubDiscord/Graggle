const { intents } = require("../../config/bot.config");
const BetterClient = require("../../lib/extensions/BetterClient");

const client = new BetterClient({
	allowedMentions: { parse: ["users"] },
	restTimeOffset: 10,
	restGlobalRateLimit: 50,
	invalidRequestWarningInterval: 500,
	presence: {
		status: process.env.NODE_ENV === "development" ? "idle" : "online",
		activities: [
			{
				type: process.env.NODE_ENV === "development" ? "PLAYING" : "WATCHING",
				name:
					process.env.NODE_ENV === "development"
						? "Currently in maintenance mode!"
						: "over Owners Hub"
			}
		]
	},
	intents: intents
});

client.login().catch(console.error);
