const BetterClient = require("../extensions/BetterClient");
const getPermissionName = require("../utilities/permissions");
const { Permissions, ButtonInteraction } = require("discord.js");

class Button {
	/**
	 *
	 * @param {string} name The name of the button.
	 * @param {BetterClient} client Our client.
	 * @param {Object} options All of the options for the button.
	 * @param {string?} options.description The description for the button.
	 * @param {import("discord.js").ApplicationbuttonOptionData[]} options.options The slash button options.
	 * @param {Permissions} options.permissions The permissions the user must have for this button.
	 * @param {Permissions} options.clientPermissions The permissions the client must have for this button.
	 * @param {boolean} options.ownerOnly Whether this button can only be used by owner of a guild.
	 * @param {boolean} options.devOnly Whether this button can only be used by the developer(s) of the client.
	 */
	constructor(name, client, options) {
		this.name = name;

		this.permissions = options.permissions || [];
		this.clientPermissions = options.clientPermissions || [];

		this.client = client;
		this.buttonHandler = client.buttonHandler;
	}

	/**
	 * Make sure that this button can be run by this user.
	 * @param {ButtonInteraction} interaction The interaction created.
	 * @returns {string?} The reason why this user can't run this button or null if they can.
	 */
	async validate(interaction) {
		if (this.ownerOnly && interaction.guild?.ownerId !== interaction.user.id)
			return "This button can only be ran by the owner of this guild!";
		if (this.devOnly && !this.client.owners.has(interaction.user.id))
			return "This button can only be ran by my developers!";
		if (this.permissions.length && interaction.guild) {
			if (!interaction.member.permissions.has(this.permissions))
				return `You need ${this.permissions.length > 1 ? "" : "the"} ${this.permissions
					.map((permission) => `**${getPermissionName(permission)}**`)
					.join(", ")} permission${
					this.permissions.length > 1 ? "s" : ""
				} to run this button.`;
		}
		if (this.clientPermissions.length && interaction.guild) {
			if (interaction.guild.me.permissions.has(this.clientPermissions))
				return `You need ${
					this.clientPermissions.length > 1 ? "" : "the"
				} ${this.clientPermissions
					.map((permission) => `**${getPermissionName(permission)}**`)
					.join(", ")} permission${
					this.clientPermissions.length > 1 ? "s" : ""
				} to run this button.`;
		}

		return null;
	}
}

module.exports = Button;
