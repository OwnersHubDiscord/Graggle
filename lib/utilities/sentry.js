const Sentry = require("@sentry/node");
const config = require("../../config/bot.config");
const { Integrations } = require("@sentry/tracing");
const { CommandInteraction, User, version } = require("discord.js");

module.exports = function init() {
	if (process.env.NODE_ENV === "production") {
		Sentry.init({
			tracesSampleRate: 1,
			dsn: process.env.SENTRY_TOKEN,
			release: config.version,
			integrations: [new Integrations.Mongo({ describeOperations: true, useMongoose: false })]
		});

		Sentry.setContext("Lifeboat", {
			Version: config.version,
			"Discord.js": version
		});
	}

	return {
		...Sentry,

		/**
		 * Log an error with Sentry, include information about the message.
		 * @param {Error} error The error that was raised.
		 * @param {CommandInteraction} interaction The interaction that caused the error.
		 */
		captureWithInteraction: (error, interaction) => {
			Sentry.withScope((scope) => {
				scope.setUser({ user: interaction.user.tag, id: interaction.user.id });

				if (interaction.guild) {
					scope.setExtra("Guild Name", interaction.guild.name);
					scope.setExtra("Guild ID", interaction.guild.id);
					scope.setExtra("Channel Name", interaction.channel.name);
					scope.setExtra("Channel ID", interaction.channel.id);
				}

				scope.setExtra("Channel Type", interaction.channel.type);

				scope.setExtra("Interaction Options", interaction.options);
				scope.setExtra("Interaction ID", interaction.id);

				Sentry.captureException(error);
			});
		},

		/**
		 * Log an error with Sentry, include information about the user.
		 * @param {Error} error The error that was raised.
		 * @param {Object<string, any>?} extras All of the extra information to be sent with the error.
		 * @param {User?} user The user that caused the error.
		 */
		captureWithExtras: (error, extras = [], user) => {
			Sentry.withScope((scope) => {
				Object.entries(extras).forEach(([key, value]) => {
					scope.setExtra(key, value);
				});

				if (user) {
					scope.setUser({ user: user.tag, id: user.id });
				}

				Sentry.captureException(error);
			});
		}
	};
};
