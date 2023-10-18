import { discordClient, robloxClient, robloxGroup } from '../../main';
import { TextChannel } from 'discord.js';
import { GetGroupRoles } from 'bloxy/src/client/apis/GroupsAPI';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { MessageEmbed } from 'discord.js';
import {
    getInvalidRobloxUserEmbed,
    getRobloxUserIsNotMemberEmbed,
    getSuccessfulPromotionEmbed,
    getUnexpectedErrorEmbed,
    getNoRankAboveEmbed,
    getRoleNotFoundEmbed,
    getVerificationChecksFailedEmbed,
    getUserSuspendedEmbed,
} from '../../handlers/locale';
import { checkActionEligibility } from '../../handlers/verificationChecks';
import { config } from '../../config';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { logAction } from '../../handlers/handleLogging';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { provider } from '../../database/router';
 
class ActivitycheckCommand extends Command {
    constructor() {
        super({
            trigger: 'activitycheck',
            description: 'Announced the activity check.',
            type: 'ChatInput',
            module: 'moderation',
            args: [],
            permissions: [
                {
                    type: 'role',
                    ids: config.permissions.admin,
                    value: true,
                }
            ]
        });
    }
 
    async run(ctx: CommandContext) {

  let channelSend: TextChannel;
        channelSend = await discordClient.channels.fetch('1137755038073241600') as TextChannel;
        console.log(channelSend)
            let user = ctx.args['user'];
            console.log(user)

     var strMemberId = ctx.user.id
      strMemberId = strMemberId.replace("<","");
      strMemberId = strMemberId.replace("@","");
      strMemberId = strMemberId.replace("!","");
      strMemberId = strMemberId.replace(">","");

     const dizzyMember = await ctx.guild.members.fetch(strMemberId);
     console.log(dizzyMember)

   const e = new MessageEmbed()
   .setTitle('**ACTIVITY CHECK**')
   .setDescription('It’s time for our weekly activity check! I ask for all MRs+ to interact with this message when it is viewed.\n\nI pay very close attention to the activity checks.')
   .setColor('#43d177')
   .setTimestamp()
let message389789 = await channelSend.send({ embeds: [e] })
await message389789.react('<:EzPepe:1138425641780383935>');

    const successEmbed = new MessageEmbed()
    .setAuthor(ctx.user.tag, ctx.user.displayAvatarURL())
    .setDescription(`**Success!** Successfully announced the activity check.`)
    .setColor('#43d177')

    ctx.reply({ embeds: [successEmbed] })

   let message86687 = await channelSend.send({
        content: '<@&1138884920756944896> <@&1137717141227962480>',
        allowedMentions: { roles: ['1138884920756944896', '1137717141227962480'] },
    });
    }
    }
 
export default ActivitycheckCommand;
