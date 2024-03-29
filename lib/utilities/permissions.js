const permissionNames = new Map([
	["ADMINISTRATOR", "Administrator"],
	["CREATE_INSTANT_INVITE", "Create Instant Invite"],
	["KICK_MEMBERS", "Kick Members"],
	["BAN_MEMBERS", "Ban Members"],
	["MANAGE_CHANNELS", "Manage Channels"],
	["MANAGE_GUILD", "Manage Server"],
	["ADD_REACTIONS", "Add Reactions"],
	["VIEW_AUDIT_LOG", "View Audit Log"],
	["PRIORITY_SPEAKER", "Priority Speaker"],
	["VIEW_CHANNEL", "View Channel"],
	["SEND_MESSAGES", "Send Messages"],
	["SEND_TTS_MESSAGES", "Send TTS Messages"],
	["MANAGE_MESSAGES", "Manage Messages"],
	["EMBED_LINKS", "Embed Links"],
	["ATTACH_FILES", "Attach Files"],
	["READ_MESSAGE_HISTORY", "Read Message History"],
	["MENTION_EVERYONE", "Mention Everyone"],
	["USE_EXTERNAL_EMOJIS", "Use External Emojis"],
	["CONNECT", "Connect"],
	["SPEAK", "Speak"],
	["STREAM", "Stream"],
	["MUTE_MEMBERS", "Mute Members"],
	["DEAFEN_MEMBERS", "Deafen Members"],
	["MOVE_MEMBERS", "Move Members"],
	["USE_VAD", "Use Voice Activity"],
	["CHANGE_NICKNAME", "Change Nickname"],
	["MANAGE_NICKNAMES", "Manage Nicknames"],
	["MANAGE_ROLES", "Manage Roles"],
	["MANAGE_WEBHOOKS", "Manage Webhooks"],
	["MANAGE_EMOJIS_AND_STICKERS", "Manage Emojis and Stickers"]
]);

const allPermissions = [
	"ADMINISTRATOR",
	"CREATE_INSTANT_INVITE",
	"KICK_MEMBERS",
	"BAN_MEMBERS",
	"MANAGE_CHANNELS",
	"MANAGE_GUILD",
	"ADD_REACTIONS",
	"VIEW_AUDIT_LOG",
	"PRIORITY_SPEAKER",
	"VIEW_CHANNEL",
	"SEND_MESSAGES",
	"SEND_TTS_MESSAGES",
	"MANAGE_MESSAGES",
	"EMBED_LINKS",
	"ATTACH_FILES",
	"READ_MESSAGE_HISTORY",
	"MENTION_EVERYONE",
	"USE_EXTERNAL_EMOJIS",
	"CONNECT",
	"SPEAK",
	"MUTE_MEMBERS",
	"DEAFEN_MEMBERS",
	"MOVE_MEMBERS",
	"USE_VAD",
	"CHANGE_NICKNAME",
	"MANAGE_NICKNAMES",
	"MANAGE_ROLES",
	"MANAGE_WEBHOOKS",
	"MANAGE_EMOJIS_AND_STICKERS"
];

const channelPermissions = [
	"VIEW_CHANNEL",
	"MANAGE_CHANNELS",
	"MANAGE_ROLES",
	"MANAGE_WEBHOOKS",
	"CREATE_INSTANT_INVITE",
	"SEND_MESSAGES",
	"EMBED_LINKS",
	"ATTACH_FILES",
	"ADD_REACTIONS",
	"USE_EXTERNAL_EMOJIS",
	"MENTION_EVERYONE",
	"MANAGE_MESSAGES",
	"READ_MESSAGE_HISTORY",
	"SEND_TTS_MESSAGES",
	"USE_SLASH_COMMANDS",
	"CONNECT",
	"SPEAK",
	"STREAM",
	"USE_VAD",
	"PRIORITY_SPEAKER",
	"MUTE_MEMBERS",
	"DEAFEN_MEMBERS",
	"MOVE_MEMBERS"
];

const textPermissions = [
	"VIEW_CHANNEL",
	"MANAGE_CHANNELS",
	"MANAGE_ROLES",
	"MANAGE_WEBHOOKS",
	"CREATE_INSTANT_INVITE",
	"SEND_MESSAGES",
	"EMBED_LINKS",
	"ATTACH_FILES",
	"ADD_REACTIONS",
	"USE_EXTERNAL_EMOJIS",
	"MENTION_EVERYONE",
	"MANAGE_MESSAGES",
	"READ_MESSAGE_HISTORY",
	"SEND_TTS_MESSAGES",
	"USE_SLASH_COMMANDS"
];

const voicePermissions = [
	"VIEW_CHANNEL",
	"MANAGE_CHANNELS",
	"MANAGE_ROLES",
	"CREATE_INSTANT_INVITE",
	"CONNECT",
	"SPEAK",
	"STREAM",
	"USE_VAD",
	"PRIORITY_SPEAKER",
	"MUTE_MEMBERS",
	"DEAFEN_MEMBERS",
	"MOVE_MEMBERS"
];

/**
 * Get the better name for a permission.
 * @param {string} permission The permission we want to get the name of.
 * @returns {string?} The permission name.
 */
function getPermissionName(permission) {
	if (permissionNames.has(permission)) {
		return permissionNames.get(permission);
	}

	return "Unknown";
}

module.exports = getPermissionName;
