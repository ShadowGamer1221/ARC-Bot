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
import Discord from 'discord.js';
 
class ReportCommand extends Command {
    constructor() {
        super({
            trigger: 'report',
            description: 'Reports a member.',
            type: 'ChatInput',
            module: 'report',
            args: [
              {
                    trigger: 'user',
                    description: 'The username of the user you want to report.',
                    isLegacyFlag: false,
                    required: true,
                    type: 'DiscordUser',
              },
              {
                    trigger: 'reason',
                    description: 'Reason for reporting the user.',
                    isLegacyFlag: false,
                    required: true,
                    type: 'String',
              }
            ],
            permissions: [
                {
                    type: 'role',
                    ids: config.permissions.verified,
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

    let reason = ctx.args['reason'];
    console.log(reason)
        
                const sugEmbed = new Discord.MessageEmbed()
                    .setColor("#00FFFF")
                    .setAuthor(ctx.user.tag, ctx.user.displayAvatarURL({ dynamic: true }))
                    .setTitle("New Report!")
                    .setDescription(`The Member \`${ctx.user.tag}\` has reported the user \ <@${user.id}>! Use \`\`!!info ${user}\`\` to view the reported user info.`)
                    .addFields(
                        { name: "Member ID", value: `${ctx.user.id}`, inline: true},
                        { name: "Member Tag", value: `${ctx.user.tag}`, inline: true},
                        { name: "Reported Username", value: `${user}`, inline: true},
                        { name: "Reason", value: `${reason}`, inline: true}
                    )
                    .setFooter(`Status: Unclaimed`)
                    .setTimestamp()
        
                const row = new Discord.MessageActionRow().addComponents(
        
                    new Discord.MessageButton()
                        .setCustomId("sug-acc")
                        .setStyle("SUCCESS")
                        .setLabel("CLAIM"),

                        new Discord.MessageButton()
                        .setCustomId("sug-accsadadsdsa")
                        .setStyle("SUCCESS")
                        .setDisabled()
                        .setLabel("HANDLED"),
        
                )

                const row2 = new Discord.MessageActionRow().addComponents(

                    new Discord.MessageButton()
                    .setCustomId("sug-accgg")
                    .setStyle("SUCCESS")
                    .setDisabled()
                    .setLabel("CLAIM"),

                    new Discord.MessageButton()
                    .setCustomId("sug-accasd")
                    .setStyle("SUCCESS")
                    .setLabel("HANDLED"),
        
                )

                const submittedEmbed = new MessageEmbed()
                .setDescription(`**Success!** Successfully reported ${user}`)
                .setAuthor(ctx.user.tag, ctx.user.displayAvatarURL())
                .setColor('GREEN')
        
                ctx.reply({ embeds: [submittedEmbed] })
        
                const sugPage = await channelSend.send({ embeds: [sugEmbed], components: [row] })
        
                const col = await sugPage.createMessageComponentCollector({
                    componentType: "BUTTON"
                })
        
                col.on("collect", async i => {

                    const noPerms = new MessageEmbed()
                    .setAuthor(ctx.user.tag, ctx.user.displayAvatarURL())
                    .setDescription('You don\'t have permissions to do that!')
                    .setColor('RED')
                    .setTimestamp()
        
                    const interactor = i.guild.members.cache.get(i.user.id)
        
                    if (!interactor.permissions.has("VIEW_AUDIT_LOG")) return
        
                    if (i.customId === "sug-acc") {
        
                        const accEmbed = new Discord.MessageEmbed()
                            .setColor("GREEN")
                            .setTitle("**Report Claimed!**")
                            .setDescription(`Your report on **${user}** with the reported reason **${reason}** has been claimed by <@${i.user.id}>`)
                            .addFields([
                                { name: "Claimed by:", value: `<@${i.user.id}>`, inline: true },
                                { name: "Claimed in:", value: `${i.guild.name}`, inline: true },
                            ])
                            .setTimestamp()
                            .setFooter(`Claimed`)
                            .setThumbnail(ctx.guild.iconURL({ dynamic: true }))
        
                       await ctx.user.send({ embeds: [accEmbed] }).catch(err => {
        
                            if (err.code !== 50007) return console.log(err)
        
                        })
           
                    }

                if (i.customId === "sug-acc") {
        
                        const accEmbed1 = new Discord.MessageEmbed()
                        .setColor("#43d177")
                        .setAuthor(ctx.user.tag, ctx.user.displayAvatarURL({ dynamic: true }))
                        .setTitle("Report Claimed!")
                        .setDescription(`The Member \`${ctx.user.tag}\` has reported the user \`${user}\`! Use \`\`!!userinfo ${ctx.user.id}\`\` to view the userinfo.`)
                        .addFields(
                            { name: "Member ID", value: `${ctx.user.id}`, inline: true},
                            { name: "Member Tag", value: `${ctx.user.tag}`, inline: true},
                            { name: "Reported Username", value: `${user}`, inline: true},
                            { name: "Reason", value: `${ctx.args['reason']}`, inline: true}
                        )
                        .setFooter(`Status: Claimed`)
                        .setTimestamp()

                            await logAction(`Report Claimed\n**Reported:** ${user}\n**Report Reason:** ${ctx.args['reason']}`, ctx.user);
        
                        sugPage.edit({ embeds: [accEmbed1], components: [row2] })

                }

                if (i.customId === "sug-accasd") {

                    const handledEmbed = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("**Report Handled!**")
                    .setDescription(`Your report on **${user}** with the reported reason **${reason}** has been handled by <@${i.user.id}>`)
                    .addFields([
                        { name: "Handled by:", value: `<@${i.user.id}>`, inline: true },
                    ])
                    .setTimestamp()
                    .setFooter(`Handled`)
                    .setThumbnail(ctx.guild.iconURL({ dynamic: true }))

               await ctx.user.send({ embeds: [handledEmbed] }).catch(err => {

                    if (err.code !== 50007) return console.log(err)

                })
                }

                if (i.customId === "sug-accasd") {

                    const handled2Embed = new Discord.MessageEmbed()
                    .setColor("#43d177")
                    .setAuthor(ctx.user.tag, ctx.user.displayAvatarURL({ dynamic: true }))
                    .setTitle("Report Handled!")
                    .setDescription(`The Member \`${ctx.user.tag}\` has reported the user \`${user}\`! Use \`\`!!userinfo ${ctx.user.id}\`\` to view the userinfo.`)
                    .addFields(
                        { name: "Member ID", value: `${ctx.user.id}`, inline: true},
                        { name: "Member Tag", value: `${ctx.user.tag}`, inline: true},
                        { name: "Reported Username", value: `${user}`, inline: true},
                        { name: "Reason", value: `${ctx.args['reason']}`, inline: true}
                    )
                    .setFooter(`Status: Handled`)
                    .setTimestamp()

                        await logAction(`Report Handled\n**Reported:** ${user}\n**Report Reason:** ${ctx.args['reason']}`, ctx.user);
    
                    sugPage.edit({ embeds: [handled2Embed], components: [] })

                }

            })
            let message = await channelSend.send({
                content: '<@&1144557072432762980>',
                allowedMentions: { roles: ['1144557072432762980'] },
            });
    }
    }
 
export default ReportCommand;