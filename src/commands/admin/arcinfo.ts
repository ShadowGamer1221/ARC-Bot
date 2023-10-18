import { discordClient } from '../../main';
import { MessageEmbed, TextChannel } from 'discord.js';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { config } from '../../config';
import { GuildMember } from 'discord.js';
import { groupBy } from 'lodash';
import {
    checkIconUrl,
    getCommandInfoEmbed,
    getCommandListEmbed,
    getCommandNotFoundEmbed,
    mainColor,
    greenColor,
    redColor,
    infoIconUrl,
} from '../../handlers/locale';

class ArcCommand extends Command {
    constructor() {
        super({
            trigger: 'arcinfo',
            description: 'Sends the clan information embed into #arc-info',
            type: 'ChatInput',
            module: 'admin',
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


        const guild = ctx.guild
        let channelSend: TextChannel;
        channelSend = await discordClient.channels.fetch('1139638998118191235') as TextChannel;
        console.log(channelSend)

        let channelSend2: TextChannel;
        channelSend = await discordClient.channels.fetch('1139638998118191235') as TextChannel;
        console.log(channelSend)

        const gif = "https://imgur.com/PUID76U.gif"

        const clanEmbed = new MessageEmbed()
        .setAuthor(`ARC Clan Info`, infoIconUrl)
        .setColor(mainColor)
        .setDescription(`We are primarily a community based in the Czech-Slovak region, but we also embrace the English-speaking community. We consist of players from the CosmicV | King of the Hill server who share a passion for enjoyment and innovation. The primary focus of our server is gameplay within CosmicV or fostering interaction with fellow players in Discord. Our server and clan were officially established on August 8, 2023, with the intention of building a close-knit community, akin to a family.\n\nIf you wish to become a member of the ARC Clan, please don't hesitate to create a support ticket at <#1137723202504769616>`)
        .setTimestamp();

        const ClanTag = await channelSend.send({ embeds: [clanEmbed] })
        let Notification = await channelSend.send({
            content: `${gif}`,
        });

  const successEmbed = new MessageEmbed()

.setTitle('Success!')
.setColor(greenColor)
.setDescription(`Successfully sent the clan info into ${channelSend}!`)
.setTimestamp();

ctx.reply({ embeds: [successEmbed] });
    }
}

export default ArcCommand;