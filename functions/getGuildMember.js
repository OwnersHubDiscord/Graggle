const { Guild, GuildMember } = require("discord.js");
const { getGuildMemberFromMention } = require("./getGuildMemberFromMention");

/**
 * Find a GuildMember within a Guild from a string.
 * @param {Guild} guild The Guild we want to find the GuildMember in.
 * @param {string} content What to search for to get the GuildMember.
 * @returns {GuildMember|null} The GuildMember found/
 */
async function getGuildMember(guild, content) {
	return (
		(await getGuildMemberFromMention(guild, content)) ||
		guild.members.cache.get(content) ||
		guild.members.cache.find(
			(member) =>
				member.user.username.toLowerCase() === content.toLowerCase() ||
				member.user.tag.toLowerCase() === content.toLowerCase() ||
				member.displayName.toLowerCase() === content.toLowerCase()
		) ||
		(await guild.members.fetch(content)) ||
		(await guild.members.fetch({ query: content }))
	);
}

module.exports = { getGuildMember };
