const { format } = require("@lukeed/ms");
const Command = require("../../../../lib/classes/Command");
const BetterClient = require("../../../../lib/extensions/BetterClient");
const { CommandInteraction, MessageEmbed } = require("discord.js");

class Vouch extends Command {
	/**
	 * Create our command.
	 * @param {string} name Our command name.
	 * @param {BetterClient} client Our client.
	 */
	constructor(name, client) {
		super(name, client, {
			description: "Vouch a user into Owners Hub or get information on a vouch.",
			options: [
				{
					name: "information",
					type: "SUB_COMMAND",
					description: "Get information on who vouched a user and who they've vouched.",
					options: [
						{
							name: "user",
							type: "USER",
							description: "The user to get information on.",
							required: true
						}
					]
				},
				{
					name: "user",
					type: "SUB_COMMAND",
					description: "Vouch a user into Owners Hub.",
					options: [
						{
							name: "user",
							type: "USER",
							description: "The user you want to vouch for.",
							required: true
						},
						{
							name: "reason",
							type: "STRING",
							description: "The reason for vouching them in.",
							required: true
						}
					]
				}
			]
		});
	}

	/**
	 * Run our command.
	 * @param {CommandInteraction} interaction The interaction that was created.
	 */
	async run(interaction) {
		if (interaction.options.getSubcommand(false) === "information") {
			const voucher = await this.client.mongo
				.db("users")
				.collection("vouchers")
				.findOne({ _id: interaction.options.getUser("user").id });
			const introduction = await this.client.mongo
				.db("users")
				.collection("introductions")
				.findOne({ _id: interaction.options.getUser("user").id });
			if (!voucher) {
				const embed = new MessageEmbed()
					.setAuthor(
						interaction.options.getUser("user").tag,
						interaction.options.getUser("user").displayAvatarURL({ dynamic: true })
					)
					.setDescription(
						!interaction.options
							.getMember("user")
							.roles.cache.has(this.client.config.verifiedRoleId)
							? `This user hasn't been vouched for.${introduction ? `\n\n[**Jump to introduction**](${introduction.url})` : ""}`
							: "This user was verified before vouching was introduced."
					)
					.setColor(this.client.config.colors.primary);
				return interaction.reply({ embeds: [embed] });
			}
			const embed = new MessageEmbed()
				.setAuthor(
					interaction.options.getUser("user").tag,
					interaction.options.getUser("user").displayAvatarURL({ dynamic: true })
				)
				.setDescription(
					voucher.voucher
						? `Vouched by <@${voucher.voucher.user}> at <t:${Math.floor(
								voucher.voucher.timestamp / 1000
						  )}:F> for: ${voucher.voucher.reason}${introduction ? `\n\n[**Jump to introduction**](${introduction.url})` : ""}`
						: "This user was verified before vouching was introduced."
				)
				.setColor(this.client.config.colors.primary);
			if (voucher.vouches) {
				embed.addField(
					"Vouches",
					voucher.vouches
						.map(
							(vouch) =>
								`<t:${Math.floor(vouch.timestamp / 1000)}:F> Vouched <@${
									vouch.user
								}> for: ${vouch.reason}`
						)
						.join("\n"),
					false
				);
			}
			return interaction.reply({ embeds: [embed] });
		}
		if (interaction.channel.id !== this.client.config.vouchesChannelId) {
			this.client.logger.debug(
				`${interaction.user.tag} tried to vouch ${
					interaction.options.getUser("user").tag
				} for: ${interaction.options.getString(
					"reason"
				)} but failed because they didn't do it in the #vouches channel.`
			);
			return interaction.reply(
				this.client.functions.generateErrorMessage(this.client, {
					title: "Wrong Channel",
					description: `You can only vouch users in <#${this.client.config.vouchesChannelId}>!`
				})
			);
		} else if (!interaction.member.roles.cache.has(this.client.config.verifiedRoleId)) {
			this.client.logger.debug(
				`${interaction.user.tag} tried to vouch ${
					interaction.options.getUser("user").tag
				} for: ${interaction.options.getString(
					"reason"
				)} but failed because they aren't verified.`
			);
			return interaction.reply(
				this.client.functions.generateErrorMessage(this.client, {
					title: "Missing Permissions",
					description: "Only verified users can vouch for other users!"
				})
			);
		} else if (
			interaction.guild.members.cache
				.get(interaction.options.getUser("user").id)
				?.roles.cache.has(this.client.config.verifiedRoleId)
		) {
			this.client.logger.debug(
				`${interaction.user.tag} tried to vouch ${
					interaction.options.getUser("user").tag
				} for: ${interaction.options.getString("reason")} but failed because ${
					interaction.options.getUser("user").tag
				} is already verified.`
			);
			return interaction.reply(
				this.client.functions.generateErrorMessage(this.client, {
					title: "Already Verified",
					description: `${interaction.options.getUser("user")} is already verified!`
				})
			);
		}
		const userIntroduction = await this.client.mongo
			.db("users")
			.collection("introductions")
			.findOne({ _id: interaction.options.getUser("user").id });
		if (this.client.config.vouchSettings.requiresIntroduction && !userIntroduction) {
			this.client.logger.debug(
				`${interaction.user.tag} tried to vouch ${
					interaction.options.getUser("user").tag
				} for: ${interaction.options.getString("reason")} but failed because ${
					interaction.options.getUser("user").tag
				} hasn't introduced themselves yet.`
			);
			return interaction.reply(
				this.client.functions.generateErrorMessage(this.client, {
					title: "No Introduction",
					description: `${interaction.options.getUser(
						"user"
					)} hasn't introduced themselves yet, please tell them to do so!`
				})
			);
		}
		const voucher = this.client.mongo
			.db("users")
			.collection("vouchers")
			.findOne({ _id: interaction.user.id });
		if (
			voucher &&
			voucher.vouches?.filter(
				(vouch) => Date.now() - vouch.timestamp >= this.client.config.vouchSettings.period
			).length >= this.client.config.vouchSettings.perPeriod
		) {
			return interaction.reply(
				this.client.functions.generateErrorMessage(this.client, {
					title: "Max Vouches Met",
					description: `You can only vouch ${
						this.client.config.vouchSettings.perPeriod
					} time${
						this.client.config.vouchSettings.perPeriod > 1 ? "s" : ""
					} every ${format(this.client.config.vouchSettings.period, true)}!`
				})
			);
		}
		await interaction.guild.members.cache
			.get(interaction.options.getUser("user").id)
			?.roles.add(this.client.config.verifiedRoleId);
		await this.client.mongo
			.db("users")
			.collection("vouchers")
			.updateOne(
				{ _id: interaction.user.id },
				{
					$push: {
						vouches: {
							user: interaction.options.getUser("user").id,
							reason: interaction.options.getString("reason"),
							timestamp: Date.now()
						}
					}
				},
				{ upsert: true }
			);
		await this.client.mongo
			.db("users")
			.collection("vouchers")
			.updateOne(
				{ _id: interaction.options.getUser("user").id },
				{
					$set: {
						voucher: {
							user: interaction.user.id,
							reason: interaction.options.getString("reason"),
							timestamp: Date.now()
						}
					}
				},
				{ upsert: true }
			);
		this.client.logger.debug(
			`${interaction.user.tag} [${interaction.user.id}] vouched ${
				interaction.options.getUser("user").tag
			} [${interaction.options.getUser("user").id}] for: ${interaction.options.getString(
				"reason"
			)}`
		);
		return interaction.reply(
			`${interaction.user} vouched for ${interaction.options.getUser("user")}${
				this.client.config.vouchSettings.requiresIntroduction
					? `, find their introduction [**here**](<${userIntroduction.url}>).`
					: "."
			}`
		);
	}
}

module.exports = Vouch;
