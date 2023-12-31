import { Message, MessageEmbed } from 'discord.js';
import { CommandArgument, DatabaseUser } from '../structures/types';
import { config } from '../config';
import { User, PartialUser, GroupShout, GroupMember, GroupWallPost, GroupJoinRequest, GroupRole } from 'bloxy/dist/structures';
import { User as DiscordUser } from 'discord.js';
import { Command } from '../structures/Command';
import { discordClient, robloxClient, robloxGroup } from '../main';
import { Client } from 'bloxy';
import { textSync } from 'figlet';
import axios from 'axios';
import fetch from 'node-fetch'
import { indexOf } from 'lodash';
import discord from 'discord.js';

export const checkIconUrl = 'https://cdn.lengolabs.com/qbot-icons/check.png';
export const xmarkIconUrl = 'https://cdn.lengolabs.com/qbot-icons/xmark.png';
export const infoIconUrl = 'https://cdn.lengolabs.com/qbot-icons/info.png';
export const quoteIconUrl = 'https://cdn.lengolabs.com/qbot-icons/quote.png';

export const mainColor = '#906FED';
export const greenColor = '#50C790';
export const redColor = '#FA5757';

export const consoleMagenta = '\x1b[35m';
export const consoleGreen = '\x1b[32m';
export const consoleYellow = '\x1b[33m';
export const consoleRed = '\x1b[31m';
export const consoleClear = '\x1b[0m';

export const qbotLaunchTextDisplay = `${consoleMagenta}${textSync('Qbot')}`;
export const welcomeText = `${consoleYellow}Hey, thanks for using Qbot! If you run into any issues, please do not hesitate to join our support server: https://discord.gg/ezxP5BJuDb`;
export const startedText = `\n${consoleGreen}✓  ${consoleClear}Your bot has been started.`;
export const securityText = `\n${consoleRed}⚠  ${consoleClear}URGENT: For security reasons, public bot must be DISABLED for the bot to start. For more information, please refer to this section of our documentation: https://docs.lengolabs.com/qbot/setup/replit-guide#discord`;

export const noFiredRankLog = `Uh oh, you do not have a fired rank with the rank specified in your configuration file.`;
export const noSuspendedRankLog = `Uh oh, you do not have a suspended rank with the rank specified in your configuration file.`;
export const noInactiveRankLog = `Uh oh, you do not have a inactive rank with the rank specified in your configuration file.`;
export const getListeningText = (port) => `${consoleGreen}✓  ${consoleClear}Listening on port ${port}.`;

export const getUnknownCommandMessage = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Command Unavailable', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('This command is not available here, or there was an unexpected error finding it on our system.');

    return embed;
}

export const getMissingArgumentsEmbed = (cmdName: string, args: CommandArgument[]): MessageEmbed => {
    let argString = '';
    args.forEach((arg) => {
        if(arg.isLegacyFlag) {
            argString += arg.required || true ? `--<${arg.trigger}> ` : `--[${arg.trigger}] `;
        } else {
            argString += arg.required || true ? `<${arg.trigger}> ` : `[${arg.trigger}] `;
        }
    });
    argString = argString.substring(0, argString.length - 1);

    const embed = new MessageEmbed()
        .setAuthor('Invalid Usage', xmarkIconUrl)
        .setColor(redColor)
        .setDescription(`Command Usage: \`${config.legacyCommands.prefixes[0]}${cmdName} ${argString}\``)
        .setFooter(config.slashCommands ? 'Tip: Slash commands automatically display the required arguments for commands.' : '');
    
    return embed;
}

export const getInvalidRobloxUserEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Query Unsuccessful', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('The user you searched for does not exist.');

    return embed;
}

export const getNoDatabaseEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Command Disabled', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('This command requires the database to be enabled, please contact shadow if this is a error.');

    return embed;
}

export const getRobloxUserIsNotMemberEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Unable to Rank', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('The user you searched for is not a member of the clan.');

    return embed;
}

export const getNoJoinRequestEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('No Join Request', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('This user does not have a pending join request to review.');

    return embed;
}

export const getSuccessfulAddingAndRankupEmbed = async(user: User | PartialUser, newRole: string, xpChange: string): Promise<MessageEmbed> => {
    const embed = new MessageEmbed()
        .setAuthor('Success!',checkIconUrl)
        .setColor(greenColor)
        .setThumbnail(await (await user.getAvatarHeadShotImage({ format: 'png', size: '48x48', isCircular: false})).imageUrl)
        .setDescription(`**${user.name}** has been given **${xpChange}** XP and has been promoted to **${newRole}**, becuase they had enough XP!`)

    return embed
}

export const getSuccessfulPromotionEmbed = async (user: User | PartialUser, newRole: string): Promise<MessageEmbed> => {
    const embed = new MessageEmbed()
        .setAuthor('Success!', checkIconUrl)
        .setColor(greenColor)
        .setThumbnail((await user.getAvatarHeadShotImage({ format: 'png', size: '48x48', isCircular: false })).imageUrl)
        .setDescription(`**${user.name}** has been successfully promoted to **${newRole}**!`);

    return embed;
}

export const getSuccessfulDemotionEmbed = async (user: User | PartialUser, newRole: string): Promise<MessageEmbed> => {
    const embed = new MessageEmbed()
        .setAuthor('Success!', checkIconUrl)
        .setColor(greenColor)
        .setThumbnail((await user.getAvatarHeadShotImage({ format: 'png', size: '48x48', isCircular: false })).imageUrl)
        .setDescription(`**${user.name}** has been successfully demoted to **${newRole}**.`);

    return embed;
}

export const getSuccessfulFireEmbed = async (user: User | PartialUser, newRole: string): Promise<MessageEmbed> => {
    const embed = new MessageEmbed()
        .setAuthor('Success!', checkIconUrl)
        .setColor(greenColor)
        .setThumbnail((await user.getAvatarHeadShotImage({ format: 'png', size: '48x48', isCircular: false })).imageUrl)
        .setDescription(`**${user.name}** has been successfully fired, and now has the **${newRole}** role.`);

    return embed;
}

export const getSuccessfulExileEmbed = async (user: User | PartialUser): Promise<MessageEmbed> => {
    const embed = new MessageEmbed()
        .setAuthor('Success!', checkIconUrl)
        .setColor(greenColor)
        .setThumbnail((await user.getAvatarHeadShotImage({ format: 'png', size: '48x48', isCircular: false })).imageUrl)
        .setDescription(`**${user.name}** has been successfully exiled from the group.`);

    return embed;
}

export const getSuccessfulSetRankEmbed = async (user: User | PartialUser, newRole: string): Promise<MessageEmbed> => {
    const embed = new MessageEmbed()
        .setAuthor('Success!', checkIconUrl)
        .setColor(greenColor)
        .setThumbnail((await user.getAvatarHeadShotImage({ format: 'png', size: '48x48', isCircular: false })).imageUrl)
        .setDescription(`**${user.name}** has successfully been ranked to the **${newRole}** role.`);

    return embed;
}

export const getSuccessfulShoutEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Success!', checkIconUrl)
        .setColor(greenColor)
        .setDescription('The group shout has been updated to that message!');

    return embed;
}

export const getSuccessfulClearShoutEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Success!', checkIconUrl)
        .setColor(greenColor)
        .setDescription('The group shout has been cleared!');

    return embed;
}

export const getSuccessfulTrainingEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Success!', checkIconUrl)
        .setColor(greenColor)
        .setDescription('Successfully announced the training!');

    return embed;
}

export const getSuccessfulShiftingEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Success!', checkIconUrl)
        .setColor(greenColor)
        .setDescription('Successfully announced the shift!');

    return embed;
}

export const getSuccessfulSignalEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Success!', checkIconUrl)
        .setColor(greenColor)
        .setDescription('The specified command has been stored and made available to connect using our API.');

    return embed;
}

export const getSuccessfulRevertRanksEmbed = (actionCount: number): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Success!', checkIconUrl)
        .setColor(greenColor)
        .setDescription(`Successfully started reverting back **${actionCount}** ranking actions.`);

    return embed;
}

export const getSuccessfulXPRankupEmbed = async (user: User | PartialUser, newRole: string): Promise<MessageEmbed> => {
    const embed = new MessageEmbed()
        .setAuthor('Success!', checkIconUrl)
        .setColor(greenColor)
        .setThumbnail((await user.getAvatarHeadShotImage({ format: 'png', size: '48x48', isCircular: false })).imageUrl)
        .setDescription(`**${user.name}** has been successfully ranked to **${newRole}**!`);

    return embed;
}

export const getPromotionRequestEmbed = (reason, discordTag): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('New Promotion Request!',infoIconUrl)
        .setColor(mainColor)
        .setDescription(`Reason provided:\n\n**${reason}**`)
        .setFooter(`Requested by ${discordTag}`)
    return embed
}
export const getSuccessfulRequestEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Success!',checkIconUrl)
        .setColor(greenColor)
        .setDescription(`Successfully requested a promotion.`)
    return embed
}

export const getSuccessfulXPChangeEmbed = async (user: User | PartialUser, xp: number): Promise<MessageEmbed> => {
    const embed = new MessageEmbed()
        .setAuthor('Success!', checkIconUrl)
        .setColor(greenColor)
        .setThumbnail((await user.getAvatarHeadShotImage({ format: 'png', size: '48x48', isCircular: false })).imageUrl)
        .setDescription(`The XP of **${user.name}** has been updated, they now have a total of **${xp}** XP.`);

    return embed;
}

export const getSuccessfulSuspendEmbed = async (user: User | PartialUser, newRole: string, endDate: Date): Promise<MessageEmbed> => {
    const embed = new MessageEmbed()
        .setAuthor('Success!', checkIconUrl)
        .setColor(greenColor)
        .setThumbnail((await user.getAvatarHeadShotImage({ format: 'png', size: '48x48', isCircular: false })).imageUrl)
        .setDescription(`**${user.name}** has been successfully suspended, and will have their rank returned in <t:${Math.round(endDate.getTime() / 1000)}:R>.`);

    return embed;
}

export const getSuccessfulInactiveEmbed = async (user: User | PartialUser, newRole: string, endDate: Date): Promise<MessageEmbed> => {
    const embed = new MessageEmbed()
        .setAuthor('Success!', checkIconUrl)
        .setColor(greenColor)
        .setThumbnail((await user.getAvatarHeadShotImage({ format: 'png', size: '48x48', isCircular: false })).imageUrl)
        .setDescription(`**${user.name}** has been successfully set inactive, and will have their rank returned in <t:${Math.round(endDate.getTime() / 1000)}:R>.`);

    return embed;
}

export const getSuccessfulUnsuspendEmbed = async (user: User | PartialUser, newRole: string): Promise<MessageEmbed> => {
    const embed = new MessageEmbed()
        .setAuthor('Success!', checkIconUrl)
        .setColor(greenColor)
        .setThumbnail((await user.getAvatarHeadShotImage({ format: 'png', size: '48x48', isCircular: false })).imageUrl)
        .setDescription(`**${user.name}** is no longer suspended, and has been ranked back to **${newRole}**!`);

    return embed;
}

export const getSuccessfulUnactiveEmbed = async (user: User | PartialUser, newRole: string): Promise<MessageEmbed> => {
    const embed = new MessageEmbed()
        .setAuthor('Success!', checkIconUrl)
        .setColor(greenColor)
        .setThumbnail((await user.getAvatarHeadShotImage({ format: 'png', size: '48x48', isCircular: false })).imageUrl)
        .setDescription(`**${user.name}** is no longer inactive, and has been ranked back to **${newRole}**!`);

    return embed;
}

export const getSuccessfulAcceptJoinRequestEmbed = async (user: User | PartialUser): Promise<MessageEmbed> => {
    const embed = new MessageEmbed()
        .setAuthor('Success!', checkIconUrl)
        .setColor(greenColor)
        .setThumbnail((await user.getAvatarHeadShotImage({ format: 'png', size: '48x48', isCircular: false })).imageUrl)
        .setDescription(`The join request from **${user.name}** has been accepted.`);

    return embed;
}

export const getSuccessfulDenyJoinRequestEmbed = async (user: User | PartialUser): Promise<MessageEmbed> => {
    const embed = new MessageEmbed()
        .setAuthor('Success!', checkIconUrl)
        .setColor(greenColor)
        .setThumbnail((await user.getAvatarHeadShotImage({ format: 'png', size: '48x48', isCircular: false })).imageUrl)
        .setDescription(`The join request from **${user.name}** has been denied.`);

    return embed;
}

export const getUserSuspendedEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('User Is Suspended', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('This user is suspended, and cannot be ranked. Please use the unsuspend command to revert this.');

    return embed;
}

export const getUserBannedEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('User Is Banned', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('This user is already banned.');

    return embed;
}

export const getUserNotBannedEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('User Not Banned', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('This user is not banned, so it is impossible to unban them.');

    return embed;
}

export const getCommandNotFoundEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Command Not Found', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('A command could not be found with that query.');

    return embed;
}

export const getAlreadySuspendedEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('User Already Suspended', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('This user is already suspended. Please use the unsuspend command to revert this.');

    return embed;
}

export const getAlreadyInactiveEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('User Already Inactive', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('This user is already inactive. Please use the unactive command to revert this.');

    return embed;
}

export const getUnexpectedErrorEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Unexpected Error', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('Unfortunately, something that we did not expect went wrong while processing this action. More information has been logged for the bot owner to diagnose.');

    return embed;
}

export const getNoRankAboveEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Cannot Promote', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('There is no rank directly above this user, so you are unable to promote them.');

    return embed;
}

export const getNoRankBelowEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Cannot Demote', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('There is no rank directly below this user, so you are unable to demote them.');

    return embed;
}

export const getNoPermissionEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Unauthorized', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('You do not have permission to use this command.');

    return embed;
}

export const getInvalidXPEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Invalid XP', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('The value of XP used in this command must be a positive integer.');

    return embed;
}

export const getNoRankupAvailableEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('No Rankup Available', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('You do not have any available rankups.');

    return embed;
}

export const getVerificationChecksFailedEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Verification Check Failed', xmarkIconUrl)
        .setColor(redColor)
        .setDescription(`
        To prevent you from ranking someone that you would not manually be able to rank, the bot checks the following things before allowing you to rank a user. In this case, you have failed one or more, and therefore you are unable to rank this user.

        • You are verified on this server.
        • The user you are performing this action on is not you.
        • Your rank is above the rank of the user you are trying to perform this action on.
        `);

    return embed;
}

export const getAlreadyFiredEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('User Already Fired', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('This user already has the fired rank.');

    return embed;
}

export const getRoleNotFoundEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Role Unavailable', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('This user you have specified does not exist on the group, or cannot be ranked by this bot.');

    return embed;
}

export const getInvalidDurationEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Invalid Duration', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('Durations must be within 5 minutes and 2 years.');

    return embed;
}

export const getShoutLogEmbed = async (shout: GroupShout): Promise<MessageEmbed> => {
    const shoutCreator = await robloxClient.getUser(shout.creator.id);
    const embed = new MessageEmbed()
        .setAuthor(`Shout from ${shoutCreator.name}`, quoteIconUrl)
        .setThumbnail((await shoutCreator.getAvatarHeadShotImage({ format: 'png', size: '48x48', isCircular: false })).imageUrl)
        .setColor(mainColor)
        .setTimestamp()
        .setDescription(shout.content);

    return embed;
}

export const getWallPostEmbed = async (post): Promise<MessageEmbed> => {
    const postCreator = await robloxClient.getUser(post['poster']);
    const embed = new MessageEmbed()
        .setAuthor(`Posted by ${postCreator.name}`, quoteIconUrl)
        .setThumbnail((await postCreator.getAvatarHeadShotImage({ format: 'png', size: '48x48', isCircular: false })).imageUrl)
        .setColor(mainColor)
        .setTimestamp()
        .setDescription(post['body']);

    return embed;
}

export const getLogEmbed = async (action: string, moderator: DiscordUser | User | GroupMember | any, reason?: string, target?: User | PartialUser, rankChange?: string, endDate?: Date, body?: string, xpChange?: string): Promise<MessageEmbed> => {
    if(target && !target.name) target = null;
    
    const embed = new MessageEmbed()
        .setColor(mainColor)
        .setTimestamp()
        .setDescription(`**Action:** ${action}\n${target ? `**Target:** ${target.name} (${target.id})\n` : ''}${rankChange ? `**Rank Change:** ${rankChange}\n` : ''}${xpChange ? `**XP Change:** ${xpChange}\n` : ''}${endDate ? `**Duration:** <t:${Math.round(endDate.getTime() / 1000)}:R>\n` : ''}${reason ? `**Reason:** ${reason}\n` : ''}${body ? `**Body:** ${body}\n` : ''}`);

    if(typeof moderator === 'string') {
        embed.setAuthor(moderator);
    } else {
        if(moderator instanceof DiscordUser) {
            embed.setAuthor(moderator.tag, moderator.displayAvatarURL());
            embed.setFooter(`Moderator ID: ${moderator.id}`);
        } else {
            embed.setAuthor(moderator.username);
            embed.setThumbnail((await target.getAvatarHeadShotImage({ format: 'png', size: '48x48', isCircular: false })).imageUrl);
        }
    }

    return embed;
}

export const getAlreadyRankedEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('User Already Ranked', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('This user already has this rank.');

    return embed;
}

export const getPartialUserInfoEmbed = async (user: User | PartialUser, data: DatabaseUser): Promise<MessageEmbed> => {
    
    const baseUrl = 'https://users.roblox.com/v1';

    let url; let response; let
        corona;

    try {
        url = `${baseUrl}/users/${user.id}`;
        response = await axios.get(url);
        corona = response.data;
    } catch (error) {
        console.log(error)
    }

    const fetchuser = await robloxClient.getUser(user.id);

    const primaryGroup = await user.getPrimaryGroup();
    const embed = new MessageEmbed()
        .setAuthor(`Information: ${user.name}`, infoIconUrl)
        .setColor(mainColor)
        .setDescription(primaryGroup ? `Primary Group: [${primaryGroup.group.name}](https://roblox.com/groups/${primaryGroup.group.id})` : '')
        .setThumbnail((await user.getAvatarHeadShotImage({ format: 'png', size: '150x150', isCircular: false })).imageUrl)
        .setFooter(`User ID: ${user.id}`)
        .setTimestamp()
        .addField('Role', 'Guest (0)', true)
        .addField('Created', corona.created, true)
        .addField('Description', `${corona.description || 'No Description'}`)
        .addField('Name', `${corona.name}`, true)
        .addField('Display Name', `${corona.displayName}`, true)
        .addField('Status', `${await fetchuser.status}` || 'No Status', true)
        .addField('Followers Count', `${await fetchuser.getFollowersCount()}`, true)
        .addField('Following Count', `${await fetchuser.getFollowingCount()}`, true)
        .addField('Friends Count', `${await fetchuser.getFriendsCount()}` || 'No Friends', true)
        .addField('Is Roblox Premium', await fetchuser.getPremiumMembership() ? `✅` : 'False', true)
        .addField('Previous Names', `${await fetchuser.previousNames}` || 'No Previous Names', true)
        .addField('Roblox Profile', `[Click Here](https://roblox.com/users/${user.id}/profile)`, true)
        .addField('Is Banned', data.isBanned ? `✅` : 'False', true)
        .addField('Reason For Ban', data.reasonForBan ? `${data.reasonForBan}` : 'N/A', true)

    return embed;
}

export const getUserInfoEmbed = async (user: User | PartialUser, member: GroupMember, data: DatabaseUser): Promise<MessageEmbed> => {
    const primaryGroup = await user.getPrimaryGroup();

    const baseUrl = 'https://users.roblox.com/v1';

    let url; let response; let
        corona;

    try {
        url = `${baseUrl}/users/${user.id}`;
        response = await axios.get(url);
        corona = response.data;
    } catch (error) {
        console.log(error)
    }

    const fetchuser = await robloxClient.getUser(user.id);

            
    const embed = new MessageEmbed()
        .setAuthor(`Information: ${user.name}`, infoIconUrl)
        .setColor(mainColor)
        .setDescription(primaryGroup ? `Primary Group: [${primaryGroup.group.name}](https://roblox.com/groups/${primaryGroup.group.id})` : '')
        .setThumbnail((await user.getAvatarHeadShotImage({ format: 'png', size: '150x150', isCircular: false })).imageUrl)
        .setFooter(`User ID: ${user.id}`)
        .setTimestamp()
        .addField('Role', `${member.role.name} (${member.role.rank})`, true)
        .addField('Created', `${corona.created}`, true)
        .addField('Description', `${corona.description || 'No Description'}`)
        .addField('Name', `${await fetchuser.name}`, true)
        .addField('Display Name', `${await fetchuser.displayName}`, true)
        .addField('Status', `${corona.status || 'No Status'}`, true)
        .addField('Followers Count', `${await fetchuser.getFollowersCount()}`, true)
        .addField('Following Count', `${await fetchuser.getFollowingCount()}`, true)
        .addField('Friends Count', `${await fetchuser.getFriendsCount()}`, true)
        .addField('Is Roblox Premium', await fetchuser.getPremiumMembership() ? `✅` : 'False', true)
        .addField('Previous Names', `${await fetchuser.previousNames}` || 'No Previous Names', true)
        .addField('Roblox Profile', `[Click Here](https://roblox.com/users/${user.id}/profile)`, true)
        .addField('XP', data.xp.toString() || '0', true)
        .addField('Is Suspended?', data.suspendedUntil ? `✅ (<t:${Math.round(data.suspendedUntil.getTime() / 1000)}:R>)` : 'False', true)
        .addField('Is Inactive?', data.inactiveUntil ? `✅ (<t:${Math.round(data.inactiveUntil.getTime() / 1000)}:R>)` : 'False', true)
        .addField('Is Banned', data.isBanned ? `✅` : 'False', true)
        .addField('Reason For Ban', data.reasonForBan ? `${data.reasonForBan}` : 'N/A', true)

    return embed;
}

export const getRoleListEmbed = (roles: GroupRole[]): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Group Ranks', infoIconUrl)
        .setColor(mainColor)
        .setDescription('Here is a list of all ranks on the group.');

    roles.forEach((role) => {
        embed.addField(role.name, `Rank: \`${role.rank || '0'}\``, true);
    });

    return embed;
}

export const getNotSuspendedEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('User Not Suspended', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('This user is not suspended, meaning you cannot run this command on them.');

    return embed;
}

export const getNotInactiveEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('User Not Inactive', xmarkIconUrl)
        .setColor(redColor)
        .setDescription('This user is not set inactive, meaning you cannot run this command on them.');

    return embed;
}

export const getMemberCountMessage = (oldCount: number, newCount: number): MessageEmbed => {
    if(newCount > oldCount) {
        const embed = new MessageEmbed()
        .setTitle('New Member Joined!')
        .setDescription(`The member count is now **${newCount}** (+${newCount - oldCount})`)
        .setColor(greenColor)
        .setTimestamp();
        return embed;
    } else {
        const Oldembed = new MessageEmbed()
        .setTitle('A Member Left 😭')
        .setColor(redColor)
        .setDescription(`The member count is now **${newCount}** (-${oldCount - newCount})`)
        .setTimestamp();
        return Oldembed;
    }
}

export const getMemberCountMilestoneEmbed = (count: number): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Member Milestone Reached!', checkIconUrl)
        .setColor(greenColor)
        .setDescription(`🎉 The member count is now **${count}**!`);

    return embed;
}

export const getCommandInfoEmbed = (command: Command): MessageEmbed => {
    let argString = '';
    command.args.forEach((arg) => {
        argString += arg.required || true ? `<${arg.trigger}> ` : `[${arg.trigger}] `;
    });
    argString = argString.substring(0, argString.length - 1);

    let argString2 = '';
    command.permissions.forEach((arg) => {
        argString2 += arg.ids || true ? `${arg.ids} ` : `[${arg.ids}] `;
    });
    argString2 = argString2.substring(0, argString2.length - 1);


    const embed = new MessageEmbed()
        .setAuthor('Command Information', infoIconUrl)
        .setTitle(command.trigger)
        .setColor(mainColor)
        .setDescription(command.description)
        .setFooter(config.slashCommands ? 'Tip: Slash commands automatically display a list of available commands, and their required usage.' : '')
        .addField('Module', command.module, true)
        .addField('Usage', `\`${argString}\``, true)
        .addField('Roles Required', `<@&${argString2}>` || `No Roles Required`, true);

    return embed;
}

export const getCommandListEmbed = (modules: { [key: string]: Command[] }): MessageEmbed => {
    const embed = new MessageEmbed()
        .setAuthor('Command List', infoIconUrl)
        .setColor(mainColor)
        .setDescription(config.slashCommands && config.legacyCommands ? 'Tip: Slash commands automatically display a list of available commands, and their required usage.' : '')

    Object.keys(modules).forEach((key) => {
        const moduleCommands = modules[key];
        const mappedCommands = moduleCommands.map((cmd) => `\`${cmd.trigger}\` - ${cmd.description}`);
        embed.addField(key.replace('-', ' ').split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), mappedCommands.join('\n'));
    });

    return embed;
}

export const getJoinRequestsEmbed = (joinRequests: GroupJoinRequest[]): MessageEmbed => {
    const requestString = joinRequests.map((request) => `- \`${request['requester'].username}\``).join('\n');
    const embed = new MessageEmbed()
        .setAuthor('Join Requests', infoIconUrl)
        .setColor(mainColor)
        .setDescription(`${joinRequests.length !== 0 ? `There is currently ${joinRequests.length} pending join requests:\n\n${requestString}` : 'There are currently no pending join requests.'}`);

    return embed;
}

export const getSuccessfulGroupBanEmbed = (user: User | PartialUser) : MessageEmbed => {
    const embed = new MessageEmbed();
    embed.setAuthor("Success", checkIconUrl);
    embed.setColor(greenColor);
    embed.setDescription(`**${user.name}** has successfully been banned from the group.`);
    return embed;
}

export const getSuccessfulGroupUnbanEmbed = (user: User | PartialUser) : MessageEmbed => {
    const embed = new MessageEmbed();
    embed.setAuthor("Success", checkIconUrl);
    embed.setColor(greenColor);
    embed.setDescription(`**${user.name}** has successfully been unbanned from the group.`);
    return embed;
}

export const getCommandEmbedByModule = (modules: { [key: string]: Command[] }, module: string): MessageEmbed => {
    let formattedModuleString = module.replace('-', ' ').split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    let commands: Command[] = modules[module];
    let description = "";
    for(let i = 0; i < commands.length; i++) {
        description += `\`${commands[i].trigger}\` - ${commands[i].description}\n`;
    }
    const embed = new MessageEmbed();
    embed.setAuthor(formattedModuleString, infoIconUrl);
    embed.setColor(mainColor);
    embed.setDescription(description);
    return embed;
}

export const getTimesUpEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed();
    embed.setAuthor("Time is Up", infoIconUrl);
    embed.setColor(mainColor);
    embed.setDescription("Your time for this embed is up, if you wish to continue, please return the command");
    return embed;
}

export const getNoUsersWithXPEmbed = (): MessageEmbed => {
    const embed = new MessageEmbed();
    embed.setAuthor("No Users with XP", xmarkIconUrl);
    embed.setColor(redColor);
    embed.setDescription("There's currently no users with XP, perhaps you should add some XP before seeing the leaderboard");
    return embed;
}

export const getXPLeaderBoardEmbed = async (users: DatabaseUser[]) : Promise<MessageEmbed> => {
    const embed = new MessageEmbed();
    embed.setAuthor("XP Leadboard", infoIconUrl);
    embed.setColor(mainColor);
    let description = "";
    let numPlace = 1;
    for(let i = 0; i < users.length; i++) {
        let endingPlace;
        if(numPlace === 1) { endingPlace = "st" } else if(numPlace === 2) { endingPlace = "nd" } else if(numPlace === 3) { endingPlace = "rd" } else { endingPlace = "th" };
        description += `**${numPlace}${endingPlace}** - ${(await robloxClient.getUsernameFromUserId(users[i].robloxId)).name} - ${users[i].xp}\n`;
        numPlace++;
    }
    embed.setDescription(description);
    return embed;
}

export const getXPSystemNotEnabledEmbed = () : MessageEmbed => {
    const embed = new MessageEmbed();
    embed.setAuthor("XP Module Disabled", xmarkIconUrl);
    embed.setColor(redColor);
    embed.setDescription("The XP module is currently not enabled, please enable it in order to use this command");
    return embed;

}
