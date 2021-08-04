const {
	Client,
	CommandInteraction,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	WebhookClient,
	Invite
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
	if (
		!hasIntroduced ||
		(Date.now() - hasIntroduced.timestamp >= 604800000 * 2 &&
			!interaction.member.roles.cache.find((role) => role.id === "811699296809386055"))
	) {
		const votingChannel = interaction.guild.channels.cache.get("802792288480657409");
		if (!votingChannel) return;
		const webhook = new WebhookClient({
			url: "https://ptb.discord.com/api/webhooks/872201630995587192/gHGpXvr2wA-ehMO1sb1-lIseqENB9kbi8_4nEeGFdcAwKChxTIU6pSMmQtBP0BMxTRPK"
		});
		if (!webhook) return;
		await webhook.send({
			content: interaction.options.getString("introduction"),
			username: interaction.user.username,
			avatarURL: interaction.user.displayAvatarURL({ dynamic: true })
		});
		const invites = interaction.options.getString("introduction").match(Invite.INVITES_PATTERN);
		const embed = new MessageEmbed()
			.setAuthor(interaction.user.tag)
			.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
			.setTitle("A Member Has Introduced Themselves!")
			.setDescription(interaction.options.getString("introduction"))
			.setColor(bot.config.MAINCOLOR);
		if (invites?.length > 0) {
			let fetchedInvites = [];
			for (const invite of invites) {
				const fetchedInvite = await bot.fetchInvite(invite);
				if (
					!fetchedInvites.includes(
						`[${fetchedInvite.guild} - ${fetchedInvite.memberCount} members](${fetchedInvite.url})`
					)
				)
					fetchedInvites.push(
						`[${fetchedInvite.guild} - ${fetchedInvite.memberCount} members](${fetchedInvite.url})`
					);
			}
			embed.addField("Invites", fetchedInvites.join("\n"), false);
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
		const message = await votingChannel.send({ embeds: [embed], components: [buttonsRow] });
		await bot.mongo
			.db("users")
			.collection("introductions")
			.updateOne(
				{ _id: interaction.user.id },
				{
					$set: {
						introduction: interaction.options.getString("introduction"),
						message: message.id,
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
		return interaction.reply({ embeds: [responseEmbed], ephemeral: true });
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
	description: "Introduce yourself to the Owners Hub server.",
	options: [
		{
			name: "introduction",
			type: "STRING",
			description: "Your introduction",
			required: true
		}
	]
};
