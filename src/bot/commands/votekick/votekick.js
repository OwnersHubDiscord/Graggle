const { format } = require("@lukeed/ms");
const Command = require("../../../../lib/classes/Command");
const BetterClient = require("../../../../lib/extensions/BetterClient");
const { CommandInteraction, MessageEmbed, TextChannel } = require("discord.js");

class Vouch extends Command {
	/**
	 * Create our command.
	 * @param {string} name Our command name.
	 * @param {BetterClient} client Our client.
	 */
	constructor(name, client) {
		super(name, client, {
			description: "Vote to kick a user out of Owners Hub.",
			options: [
				{
					name: "user",
					type: "USER",
					description: "The user you want to vote kick from Owners Hub.",
					required: true
				},
				{
					name: "reason",
					type: "STRING",
					description: "The reason for voting to kick this user out of Owners Hub.",
					required: true
				}
			]
		});
	}

	/**
	 * Run our command.
	 * @param {CommandInteraction} interaction The interaction that was created.
	 */
	async run(interaction) {
		const currentVote = await this.client.mongo
			.db("users")
			.collection("voteKick")
			.findOne({ _id: interaction.options.getUser("user").id });
		if (currentVote && currentVote.voters.includes(interaction.user.id)) {
			return interaction.reply(
				this.client.functions.generateErrorMessage(this.client, {
					title: "Already Voted",
					description: "You've already voted to kick this user!"
				})
			);
		}
		const embed = new MessageEmbed()
			.setTitle("Vote Kick Counted")
			.setDescription(
				`You're vote to kick ${interaction.options.getUser("user")} has been counted!`
			)
			.setColor(this.client.config.colors.success);
		await this.client.mongo
			.db("users")
			.collection("voteKick")
			.updateOne(
				{ _id: interaction.options.getUser("user").id },
				{
					$addToSet: { voters: interaction.user.id },
					$set: {
						[interaction.user.id]: {
							reason: interaction.options.getString("reason"),
							timestamp: Date.now()
						}
					}
				},
				{ upsert: true }
			);
		/** @type {TextChannel} */
		const channel = this.client.channels.cache.get(this.client.config.voteKickChannelId);
		if (!channel) return this.client.logger.debug(`Can't find the vote kick channel!`);
		else
			await channel.send({
				content: `<t:${Math.floor(Date.now() / 1000)}:F>${
					interaction.user
				} voted to kick ${interaction.options.getUser("user")} (${
					currentVote?.voters?.length + 1 || 1
				}/10) for: ${interaction.options.getString("reason")}`,
				allowedMentions: { users: [], roles: [] }
			});
		this.client.logger.debug(
			`${interaction.user.tag} [${
				interaction.user.id
			}] voted to kick ${interaction.options.getUser("user")} [${
				interaction.options.getUser("user").id
			}] (${currentVote?.voters?.length + 1 || 1}/10) for: ${interaction.options.getString(
				"reason"
			)}`
		);
		return interaction.reply({ embeds: [embed], ephemeral: true });
	}
}

module.exports = Vouch;
