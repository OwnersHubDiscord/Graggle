const BetterClient = require("../extensions/BetterClient");
const getPermissionName = require("../utilities/permissions");
const { Permissions, SelectMenuInteraction } = require("discord.js");

class DropDown {
	/**
	 *
	 * @param {string} name The name of the drop down.
	 * @param {BetterClient} client Our client.
	 * @param {Object} options All of the options for the drop down.
	 * @param {string?} options.description The description for the drop down.
	 * @param {import("discord.js").Applicationdrop downOptionData[]} options.options The slash drop down options.
	 * @param {Permissions} options.permissions The permissions the user must have for this drop down.
	 * @param {Permissions} options.clientPermissions The permissions the client must have for this drop down.
	 * @param {boolean} options.ownerOnly Whether this drop down can only be used by owner of a guild.
	 * @param {boolean} options.devOnly Whether this drop down can only be used by the developer(s) of the client.
	 */
	constructor(name, client, options) {
		this.name = name;

		this.permissions = options.permissions || [];
		this.clientPermissions = options.clientPermissions || [];

		this.client = client;
		this.dropDownHandler = client.dropDownHandler;
	}

	/**
	 * Make sure that this drop down can be run by this user.
	 * @param {SelectMenuInteraction} interaction The interaction created.
	 * @returns {string?} The reason why this user can't run this drop down or null if they can.
	 */
	async validate(interaction) {
		if (this.ownerOnly && interaction.guild?.ownerId !== interaction.user.id)
			return "This drop down can only be ran by the owner of this guild!";
		if (this.devOnly && !this.client.owners.has(interaction.user.id))
			return "This drop down can only be ran by my developers!";
		if (this.permissions.length && interaction.guild) {
			if (!interaction.member.permissions.has(this.permissions))
				return `You need ${this.permissions.length > 1 ? "" : "the"} ${this.permissions
					.map((permission) => `**${getPermissionName(permission)}**`)
					.join(", ")} permission${
					this.permissions.length > 1 ? "s" : ""
				} to run this drop down.`;
		}
		if (this.clientPermissions.length && interaction.guild) {
			if (interaction.guild.me.permissions.has(this.clientPermissions))
				return `You need ${
					this.clientPermissions.length > 1 ? "" : "the"
				} ${this.clientPermissions
					.map((permission) => `**${getPermissionName(permission)}**`)
					.join(", ")} permission${
					this.clientPermissions.length > 1 ? "s" : ""
				} to run this drop down.`;
		}

		return null;
	}
}

module.exports = DropDown;
