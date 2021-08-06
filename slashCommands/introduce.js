const {
	Client,
	CommandInteraction,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	WebhookClient
} = require("discord.js");

/**
 * Introduce yourself to the Owners Hub server.
 * @param {Client} bot Our discord.js client.
 * @param {CommandInteraction} interaction The interaction that was created..
 * @returns {undefined}
 */
exports.execute = async (bot, interaction) => {
	const hasIntroduced = await bot.mongo
		.db("users")
		.collection("introductions")
		.findOne({ _id: interaction.user.id });
	if (interaction.member.roles.cache.get("811699296809386055")) {
		const embed = new MessageEmbed()
			.setTitle("Already Verified")
			.setDescription("You can't introduce yourself again!")
			.setColor(bot.config.ERRORCOLOR);
		return interaction.reply({ embeds: [embed], ephemeral: true });
	} else if (!hasIntroduced || Date.now() - hasIntroduced.timestamp >= 604800000 * 2) {
		const embed = new MessageEmbed()
			.setTitle("Send Your Introduction Here")
			.setDescription(
				"Make sure to **formally introduce yourself** as first impressions are important!\nYour introduction must include the following!\n• Links to the server(s) / bot(s) that you want to get in with.\n• A small description about your server(s) / bot(s).\n• As well as a small description of yourself!"
			)
			.setColor(bot.config.MAINCOLOR);
		await interaction.user.send({ embeds: [embed] });
		const checkDMs = new MessageEmbed()
			.setTitle("Check Your DMs!")
			.setDescription("I have sent you a message in your DMs, you have two minutes to respond!")
			.setColor(bot.config.MAINCOLOR);
		interaction.reply({ embeds: [checkDMs], ephemeral: true });
		interaction.user.dmChannel
			.awaitMessages({
				max: 1,
				time: 600000
			})
			.then(async (messages) => {
				const message = messages.first();
				if (!message) {
					const embed = new MessageEmbed()
						.setTitle("Time's Up!")
						.setDescription(
							"You took too long to respond so this command timed out, run this command again!"
						)
						.setColor(bot.config.ERRORCOLOR);
					return interaction.user.send({ embeds: [embed] });
				}
				const votingChannel = interaction.guild.channels.cache.get("802792288480657409");
				if (!votingChannel) return;
				const webhook = new WebhookClient({
					url: "https://ptb.discord.com/api/webhooks/872201630995587192/gHGpXvr2wA-ehMO1sb1-lIseqENB9kbi8_4nEeGFdcAwKChxTIU6pSMmQtBP0BMxTRPK"
				});
				if (!webhook) return;
				await webhook.send({
					content: `${interaction.user.toString()}\n${message.content}}`,
					username: interaction.user.username,
					avatarURL: interaction.user.displayAvatarURL({ dynamic: true }),
					allowedMentions: { roles: [], users: [] }
				});
				const invites = message.content.match(
					/(https?:\/\/)?(www.)?(discord.(gg|io|me|li)|discordapp.com\/invite)\/[^\s/]+?(?=\b)/g
				);
				const votingEmbed = new MessageEmbed()
					.setAuthor(interaction.user.tag)
					.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
					.setTitle("A Member Has Introduced Themselves!")
					.setDescription(message.content)
					.setColor(bot.config.MAINCOLOR);
				if (invites?.length > 0) {
					let fetchedInvites = [];
					for (const invite of invites) {
						try {
							const fetchedInvite = await bot.fetchInvite(invite);
						} catch {
							continue;
						}
						if (
							!fetchedInvites.includes(
								`[${fetchedInvite.guild} - ${fetchedInvite.memberCount} members](${fetchedInvite.url})`
							)
						)
							fetchedInvites.push(
								`[${fetchedInvite.guild} - ${fetchedInvite.memberCount} members](${fetchedInvite.url})`
							);
					}
					votingEmbed.addField("Invites", fetchedInvites.join("\n"), false);
				}
				const buttonsRow = new MessageActionRow().addComponents(
					new MessageButton({
						customId: `memberVotingYes_${interaction.user.id}`,
						label: "Yes",
						style: "SUCCESS"
					}),
					new MessageButton({
						customId: `memberVotingNo_${interaction.user.id}`,
						label: "No",
						style: "DANGER"
					})
				);
				const votingMessage = await votingChannel.send({
					embeds: [votingEmbed],
					components: [buttonsRow]
				});
				await bot.mongo
					.db("users")
					.collection("introductions")
					.updateOne(
						{ _id: interaction.user.id },
						{
							$set: {
								introduction: message.content,
								message: votingMessage.id,
								timestamp: Date.now(),
								verified: false,
								yes: [],
								no: []
							}
						},
						{ upsert: true }
					);
				const responseEmbed = new MessageEmbed()
					.setTitle("Introduction Sent")
					.setDescription("You will be automatically verified in twelve hours if no issues arise!")
					.setColor(bot.config.MAINCOLOR);
				return message.reply({ embeds: [responseEmbed] });
			});
	} else {
		const embed = new MessageEmbed()
			.setTitle("Already Introduced")
			.setDescription(
				"You have already introduced yourself, you can introduce yourself again in one week!"
			)
			.setColor(bot.config.ERRORCOLOR);
		await interaction.reply({ embeds: [embed], ephemeral: true });
	}
};

exports.config = {
	name: "introduce",
	description: "Introduce yourself to the Owners Hub server. Make sure your DMs are open!"
};
