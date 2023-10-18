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

class DoubleCommand extends Command {
    constructor() {
        super({
            trigger: 'x2',
            description: 'Sends an announcement that x2 has been enabled on the server',
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
        channelSend = await discordClient.channels.fetch('1137720902033887262') as TextChannel;
        console.log(channelSend)

        let channelSend2: TextChannel;
        channelSend = await discordClient.channels.fetch('1137720902033887262') as TextChannel;
        console.log(channelSend)

        const gif = "https://tenor.com/bH7fE.gif"

        const clanEmbed = new MessageEmbed()
        .setAuthor(`Announcement`, infoIconUrl)
        .setColor(mainColor)
        .setTitle(`x2 has been enabled on the server! Happy grinding!`)
        .setTimestamp();

        const ClanTag = await channelSend.send({ embeds: [clanEmbed] })
        let Notification = await channelSend.send({
            content: `${gif}`,
        });

        let Mentions = await channelSend.send({
            content: `<@&1137717141227962480> <@&1138884920756944896>`,
            allowedMentions: { roles: ['1137717141227962480', '1138884920756944896'] },
        });

  const successEmbed = new MessageEmbed()

.setTitle('Success!')
.setColor(greenColor)
.setDescription(`Successfully sent the x2 announcement into ${channelSend}!`)
.setTimestamp();

ctx.reply({ embeds: [successEmbed] });
    }
}

export default DoubleCommand;