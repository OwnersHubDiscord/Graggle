const Button = require("./Button");
const { ButtonInteraction } = require("discord.js");
const BetterClient = require("../extensions/BetterClient");

class ButtonHandler {
	/**
	 * Create our CommandHandler with our Client.
	 * @param {BetterClient} client Our client.
	 */
	constructor(client) {
		this.client = client;

		this.coolDownTime = 1000;
		this.coolDownSet = new Set();
	}

	loadButtons() {
		this.client.functions
			.getFiles(`${__dirname}/../../src/bot/buttons/`, "")
			.forEach((parentFolder) => {
				this.client.functions
					.getFiles(`${__dirname}/../../src/bot/buttons/${parentFolder}`, ".js")
					.forEach((buttonFileName) => {
						const buttonName = buttonFileName.split(".js")[0];
						const buttonFile = require(`${__dirname}/../../src/bot/buttons/${parentFolder}/${buttonName}`);
						const button = new buttonFile(buttonName, this.client);
						this.client.buttons.set(buttonName, button);
					});
			});
	}

	/**
	 * Fetch a button by it's name.
	 * @param {string} buttonName The name of the button we want to fetch.
	 * @returns {Button?} The button found or null if no button was found.
	 */
	fetchButton(buttonName) {
		const name = buttonName.replace(/-/g, "").toLowerCase();
		for (const button of this.client.buttons.values()) {
			if (buttonName.startsWith(button.name)) return button;
		}
		return null;
	}

	/**
	 * Handle our Button press.
	 * @param {ButtonInteraction} interaction The command that was ran.
	 */
	async handleButton(interaction) {
		const button = this.fetchButton(interaction.customId);
		if (!button) return; // Do some logging here that a command was invoked even though it doesn't exist.

		this.runButton(button, interaction);
	}

	/**
	 * Run a button.
	 * @param {Button} button The button to execute.
	 * @param {ButtonInteraction} interaction Our interaction.
	 */
	async runButton(button, interaction) {
		button.run(interaction).catch((error) => {
			this.client.logger.error(error);
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
	}
}

module.exports = ButtonHandler;
