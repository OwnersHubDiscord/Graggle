const { inspect } = require("util");
const { MessageEmbed } = require("discord.js");

exports.execute = async (bot, message, args) => {
	if (!["619284841187246090", "315850603396071424"].includes(message.author.id)) return;
	const isAsync = args.includes("--async");
	const isSilent = args.includes("--silent");
	const code = args.filter((e) => !/^--(async|silent)$/.test(e)).join(" ").replace(/(^\`{3}js(\n|\s)*)|((\n|\s)*\`{3}$)/g, "");;

	try {
		let result = eval(isAsync ? `(async()=>{return ${code}})()` : code);
		let isPromise = false;
		if (result instanceof Promise) {
			result = await result;
			isPromise = true;
		}
		if (isSilent) return;
		let inspectedResult = inspect(result, { depth: 1 });
		if (isPromise) inspectedResult = `Promise<${inspectedResult}>`;
		const embed = new MessageEmbed()
			.setTitle("Evaluated Successfully")
			.setDescription(`\`\`\`js\n${inspectedResult}\n\`\`\``)
			.setColor(bot.config.MAINCOLOR);
		return message.channel.send({ embeds: [embed] });
	} catch (error) {
		const embed = new MessageEmbed()
			.setTitle("Evaluation Failed")
			.setDescription(`\`\`\`js\n${error}\n\`\`\``)
			.setColor(bot.config.ERRORCOLOR);
		await message.channel.send({ embeds: [embed] });
	}
};

exports.config = {
	name: "eval",
	aliases: ["ev"],
	args: true,
	description: "Evaluate arbitrary JavaScript code",
	category: "dev",
	usage: "<code> [--async] [--silent]"
};
