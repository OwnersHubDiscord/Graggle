const { Guild, GuildMember } = require("discord.js");

/**
 * Find a GuildMember within the Guild from a mention.
 * @param {Guild} guild The Guild we want to find the GuildMember in.
 * @param {string} mention The mention to check for to get the GuildMember.
 * @returns {GuildMember|null}
 */
async function getGuildMemberFromMention(guild, mention) {
    if (!mention) return;

    if (mention.startsWith("<@") && mention.endsWith(">")) {
        mention = mention.slice(2, -1);

        if (mention.startsWith("!")) mention = mention.slice(1);

        return guild.members.cache.get(mention) || await bot.users.fetch(mention);
    }
}

module.exports = { getGuildMemberFromMention };