const Command = require("./Command");
const BetterClient = require("../extensions/BetterClient");
const { CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");

class CommandHandler {
	/**
	 * Create our CommandHandler with our Client.
	 * @param {BetterClient} client Our client.
	 */
	constructor(client) {
		this.client = client;

		this.coolDownTime = 1000;
		this.coolDownSet = new Set();
	}

	loadCommands() {
		this.client.functions
			.getFiles(`${__dirname}/../../src/bot/commands/`, "")
			.forEach((parentFolder) => {
				this.client.functions
					.getFiles(`${__dirname}/../../src/bot/commands/${parentFolder}`, ".js")
					.forEach((commandFileName) => {
						const commandName = commandFileName.split(".js")[0];
						const commandFile = require(`${__dirname}/../../src/bot/commands/${parentFolder}/${commandName}`);
						const command = new commandFile(commandName, this.client);
						this.client.commands.set(commandName.toLowerCase(), command);
					});
			});
		setTimeout(() => {
			this.client.guilds.cache.forEach((guild) => {
				try {
					guild.commands.set(
						this.client.commands.map((command) => {
							return {
								name: command.name,
								description: command.description,
								options: command.options
							};
						})
					);
				} catch (error) {
					if (error.code === 50001)
						this.client.logger.debug(
							`I encountered DiscordAPIError: Missing Access in ${guild.name} [${guild.id}] when trying to set slash commands!`
						);
					else {
						this.client.logger.error(error);
						this.client.logger.sentry.captureWithExtras(error, {
							Guild: guild.name,
							"Guild ID": guild.id,
							"Slash Command Count": this.client.commands.size,
							"Slash Commands": JSON.stringify(
								this.client.commands.map((command) => {
									return {
										name: command.name,
										description: command.description,
										options: command.options
									};
								}),
								null,
								4
							)
						});
					}
				}
			});
		}, 5000);
	}

	/**
	 * Fetch a command by it's name.
	 * @param {string} commandName The name of the command we want to fetch.
	 * @returns {Command?} The command found or null if no command was found.
	 */
	fetchCommand(commandName) {
		const name = commandName.replace(/-/g, "").toLowerCase();
		for (const command of this.client.commands.values()) {
			if (command.name === name) return command;
		}
		return null;
	}

	/**
	 *
	 * @param {CommandInteraction} interaction The command that was ran.
	 */
	async handleCommand(interaction) {
		const command = this.fetchCommand(interaction.commandName);
		if (!command) return; // Do some logging here that a command was invoked even though it doesn't exist.

		this.runCommand(command, interaction);
	}

	/**
	 * Run a command.
	 * @param {Command} command The command to execute.
	 * @param {CommandInteraction} interaction Our interaction.
	 */
	async runCommand(command, interaction) {
		if (this.coolDownSet.has(interaction.user.id)) return;

		this.client.usersRunningCommands.add(interaction.user.id);
		command
			.run(interaction)
			.then(() => {
				this.client.usersRunningCommands.delete(interaction.user.id);
			})
			.catch((error) => {
				this.client.logger.error(error);
				this.client.logger.sentry.captureWithInteraction(error, interaction);
				return !interaction.replied
					? interaction.reply(
							this.client.functions.generateErrorMessage(this.client, {
								title: "An Error Has Occurred",
								description:
									"An unexpected error was encountered while running this command, my developers have already been notified! Feel free to join the support server in the mean time!"
							})
					  )
					: interaction.channel.send(
							this.client.functions.generateErrorMessage(this.client, {
								title: "An Error Has Occurred",
								description:
									"An unexpected error was encountered while running this command, my developers have already been notified! Feel free to join the support server in the mean time!"
							})
					  );
			});
		this.coolDownSet.add(interaction.user.id);
		setTimeout(() => this.coolDownSet.delete(interaction.user.id), this.coolDownTime);
	}
}

module.exports = CommandHandler;
