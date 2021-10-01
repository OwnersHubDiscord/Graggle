const { Intents } = require("discord.js");

const config = {
	version: "2.0.0",
	admins: ["619284841187246090", "315850603396071424"],

	hastebin: "https://mystb.in/",

	colors: {
		primary: "#FEE65C",
		success: "#57F287",
		error: "#ED4245"
	},

	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
	],

	introductionsChannelId: "802791809725759539",
	vouchesChannelId: "893292607445286952",
	verifiedRoleId: "811699296809386055",
	generalChatId: "802788546942730293",

	welcomeChannelId: "812021897087942717",
	voteKickChannelId: "853361354877304832",

	logging: {
		messages: "853361354877304832"
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
