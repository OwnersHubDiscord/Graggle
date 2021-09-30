const { Intents } = require("discord.js");

const config = {
	version: "2.0.0",
	admins: ["619284841187246090", "315850603396071424"],

	hastebin: "https://mystb.in/",

	colors: {
		primary: "#5865F2",
		success: "#57F287",
		error: "#ED4245"
	},

	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
	],

	introductionsChannelId: "890347205901299742",
	vouchesChannelId: "890382723615703111",
	verifiedRoleId: "890357425499152434",

	logging: {
		messages: "893032886545035284"
	},

	vouchSettings: {
		requiresIntroduction: true,
		perPeriod: 	10,
		period: 86_400_000
	},

	apiKeys: {},

	emojis: {}
};

module.exports = config;
