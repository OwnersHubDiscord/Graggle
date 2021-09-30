const DropDown = require("./DropDown");
const { SelectMenuInteraction } = require("discord.js");
const BetterClient = require("../extensions/BetterClient");

class DropDownHandler {
	/**
	 * Create our DropDownHandler with our Client.
	 * @param {BetterClient} client Our client.
	 */
	constructor(client) {
		this.client = client;

		this.coolDownTime = 1000;
		this.coolDownSet = new Set();
	}

	loadDropDowns() {
		this.client.functions
			.getFiles(`${__dirname}/../../src/bot/dropDowns/`, "")
			.forEach((parentFolder) => {
				this.client.functions
					.getFiles(`${__dirname}/../../src/bot/dropDowns/${parentFolder}`, ".js")
					.forEach((dropDownFileName) => {
						const dropDownName = dropDownFileName.split(".js")[0];
						const dropDownFile = require(`${__dirname}/../../src/bot/dropDowns/${parentFolder}/${dropDownName}`);
						const dropDown = new dropDownFile(dropDownName, this.client);
						this.client.dropDowns.set(dropDownName, dropDown);
					});
			});
	}

	/**
	 * Fetch a drop down by it's name.
	 * @param {string} dropDownName The name of the drop down we want to fetch.
	 * @returns {DrownDown?} The drop down found or null if no drop down was found.
	 */
	fetchDropDown(dropDownName) {
		const name = dropDownName.replace(/-/g, "").toLowerCase();
		for (const dropDown of this.client.dropDowns.values()) {
			if (dropDownName.startsWith(dropDown.name)) return dropDown;
		}
		return null;
	}

	/**
	 * Handle our drop down select.
	 * @param {SelectMenuInteraction} interaction The drop down that was selected.
	 */
	async handleDropDown(interaction) {
		const dropDown = this.fetchDropDown(interaction.customId);
		if (!dropDown) return; // Do some logging here that a drop down was invoked even though it doesn't exist.

		this.runDropDown(dropDown, interaction);
	}

	/**
	 * Run a drop down.
	 * @param {DropDown} dropDown The drop down to execute.
	 * @param {SelectMenuInteraction} interaction Our interaction.
	 */
	async runDropDown(dropDown, interaction) {
		dropDown.run(interaction).catch((error) => {
            this.client.logger.sentry.captureWithInteraction(error, interaction);
            this.client.logger.error(error);
			return !interaction.replied
				? interaction.reply(
						this.client.functions.generateErrorMessage(this.client, {
							title: "An Error Has Occurred",
							description:
								"An unexpected error was encountered while running this drop down, my developers have already been notified! Feel free to join the support server in the mean time!"
						})
				  )
				: interaction.channel.send(
						this.client.functions.generateErrorMessage(this.client, {
							title: "An Error Has Occurred",
							description:
								"An unexpected error was encountered while running this drop down, my developers have already been notified! Feel free to join the support server in the mean time!"
						})
				  );
		});
	}
}

module.exports = DropDownHandler;
