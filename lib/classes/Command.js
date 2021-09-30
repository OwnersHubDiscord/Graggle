const BetterClient = require("../extensions/BetterClient");
const getPermissionName = require("../utilities/permissions");
const { Permissions, CommandInteraction } = require("discord.js");

class Command {
	/**
	 *
	 * @param {string} name The name of the command.
	 * @param {BetterClient} client Our client.
	 * @param {Object} options All of the options for the command.
	 * @param {string?} options.description The description for the command.
	 * @param {import("discord.js").ApplicationCommandOptionData[]} options.options The slash command options.
	 * @param {Permissions} options.permissions The permissions the user must have for this command.
	 * @param {Permissions} options.clientPermissions The permissions the client must have for this command.
	 * @param {boolean} options.ownerOnly Whether this command can only be used by owner of a guild.
	 * @param {boolean} options.devOnly Whether this command can only be used by the developer(s) of the client.
	 */
	constructor(name, client, options) {
		this.name = name;
		this.description = options.description || "";
		this.options = options.options || [];
		this.permissions = options.permissions || [];
		this.clientPermissions = options.clientPermissions || [];
		this.ownerOnly = options.ownerOnly || false;
		this.devOnly = options.devOnly || false;

		this.client = client;
		this.commandHandler = client.commandHandler;
	}

	/**
	 * Make sure that this command can be run by this user.
	 * @param {CommandInteraction} interaction The interaction created.
	 * @returns {string?} The reason why this user can't run this command or null if they can.
	 */
	async validate(interaction) {
		if (this.ownerOnly && interaction.guild?.ownerId !== interaction.user.id)
			return "This command can only be ran by the owner of this guild!";
		if (this.devOnly && !this.client.owners.has(interaction.user.id))
			return "This command can only be ran by my developers!";
		if (this.permissions.length && interaction.guild) {
			if (!interaction.member.permissions.has(this.permissions))
				return `You need ${this.permissions.length > 1 ? "" : "the"} ${this.permissions
					.map((permission) => `**${getPermissionName(permission)}**`)
					.join(", ")} permission${
					this.permissions.length > 1 ? "s" : ""
				} to run this command.`;
		}
		if (this.clientPermissions.length && interaction.guild) {
			if (interaction.guild.me.permissions.has(this.clientPermissions))
				return `You need ${
					this.clientPermissions.length > 1 ? "" : "the"
				} ${this.clientPermissions
					.map((permission) => `**${getPermissionName(permission)}**`)
					.join(", ")} permission${
					this.clientPermissions.length > 1 ? "s" : ""
				} to run this command.`;
		}

		return null;
	}
}

module.exports = Command;
