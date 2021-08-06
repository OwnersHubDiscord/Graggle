const {
	Client,
	CommandInteraction,
	MessageActionRow,
	MessageEmbed,
	MessageSelectMenu
} = require("discord.js");

/**
 * Introduce yourself to the Owners Hub server.
 * @param {Client} bot Our discord.js client.
 * @param {CommandInteraction} interaction The interaction that was created..
 * @returns {undefined}
 */
exports.execute = async (bot, interaction) => {
	if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
		const embed = new MessageEmbed()
			.setTitle("Missing Permissions")
			.setDescription("This command can only be used by staff!")
			.setColor(bot.config.ERRORCOLOR)
		return interaction.reply({ embeds: [embed], ephemeral: true });
	} else if (interaction.options.getInteger("options") <= 0 || interaction.options.getInteger("options") > 25) {
		const embed = new MessageEmbed()
			.setTitle("Invalid Argument")
			.setDescription("Please provide a number greater than 0 and less than 26!")
			.setColor(bot.config.ERRORCOLOR);
		return interaction.reply({ embeds: [embed], ephemeral: true });
	} else {
		let questions = [];
		const filter = (message) => {
			return message.author.id === interaction.user.id && message.channel.id === interaction.channel.id;
		};
		await interaction.reply({ content: "Please provide an option!" });
		await interaction.channel.awaitMessages({ filter, max: 1, time: 120000 }).then((messages) => {
			const message = messages.first();
			if (!message)
				return interaction.followUp({
					content: "This interaction has timed out, run this command again!"
				});
			else if (["stop", "cancel"].includes(message.content.toLowerCase())) {
				return interaction.followUp({
					content: "Command cancelled!"
				});
			} else
				questions.push({
					question: message.content,
					number: 1,
					dropDownInfo: {
						label: `Option 1`,
						value: "1",
						description:
							message.content.length > 100
								? message.content.substring(0, 97) + "..."
								: message.content
					}
				});
		});
		for (let i = 0; i < interaction.options.getInteger("options") - 1; i++) {
			await interaction.followUp({ content: "Please provide another option!" });
			await interaction.channel.awaitMessages({ filter, max: 1, time: 120000 }).then((messages) => {
				const message = messages.first();
				if (!message)
					return interaction.followUp({
						content: "This interaction has timed out, run this command again!"
					});
				else if (["stop", "cancel"].includes(message.content.toLowerCase())) {
					return interaction.followUp({
						content: "Command cancelled!"
					});
				} else
					questions.push({
						question: message.content,
						number: i + 2,
						dropDownInfo: {
							label: `Option ${i + 2}`,
							value: (i + 2).toString(),
							description:
								message.content.length > 100
									? message.content.substring(0, 97) + "..."
									: message.content
						}
					});
			});
		}
		const dropdownRow = new MessageActionRow().addComponents(
			new MessageSelectMenu({
				customId: `poll_${interaction.id}`,
				placeholder: "Nothing Selected",
				options: questions.map((question) => question.dropDownInfo)
			}).setMaxValues(1)
		);
		const channel = interaction.options.getChannel("channel") || interaction.channel;
		let differentOptions = {};
		for (let i = 0; i < questions.length; i++) differentOptions[questions[i].number.toString()] = [];
		const message = await channel.send({
			content: `**${interaction.options.getString("question")}**\n\n${questions
				.map((question) => {
					return `\`${question.number}.\` ${question.question}`;
				})
				.join("\n")}`,
			components: [dropdownRow]
		});
		return bot.mongo
			.db("servers")
			.collection("polls")
			.insertOne({
				questions,
				_id: message.id,
				question: interaction.options.getString("question"),
				votes: {},
				timestamp: Date.now(),
				finished: false,
				channel: channel.id,
				message: message.id
			});
	}
};

exports.config = {
	name: "poll",
	description: "Create a poll.",
	options: [
		{
			name: "question",
			type: "STRING",
			description: "The question to poll on.",
			required: true
		},
		{
			name: "options",
			type: "INTEGER",
			description: "The number of options you want to give to the poll.",
			required: true
		},
		{
			name: "channel",
			type: "CHANNEL",
			description: "The channel to create this poll in. (Optional)"
		}
	]
};
