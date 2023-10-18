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

class ClantagenglishCommand extends Command {
    constructor() {
        super({
            trigger: 'clantag-eng',
            description: 'Sends the clan tag information embed in English to #clan-tag',
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
        channelSend = await discordClient.channels.fetch('1138222280909017129') as TextChannel;
        console.log(channelSend)

        let channelSend2: TextChannel;
        channelSend = await discordClient.channels.fetch('1138222280909017129') as TextChannel;
        console.log(channelSend)

        const clanEmbed = new MessageEmbed()
        .setAuthor(`ARC Clan Tag Info`, infoIconUrl)
        .setColor(mainColor)
        .setDescription(`We ask you to use our clan tag in the game so that we can show ourselves in front of other players on the server and be more visible. ♡\n\n**1.** Open FiveM\n\n**2.** Go to settings\n\n**3.** In the account section you will find **Player Name**\n\n**4.** Insert our Clan-Tag ^1[ARC] before your name`)
        .setTimestamp();

        const ClanTag = await channelSend.send({ embeds: [clanEmbed] })
        let ClanMessage = await channelSend.send({
            files: ["https://i.imgur.com/jHdczyi.png", "https://i.imgur.com/ILf9KEj.png"],
        });

  const successEmbed = new MessageEmbed()

.setTitle('Success!')
.setColor(greenColor)
.setDescription(`Successfully sent the clan tag info in the language English into ${channelSend}!`)
.setTimestamp();

ctx.reply({ embeds: [successEmbed] });
    }
}

export default ClantagenglishCommand;