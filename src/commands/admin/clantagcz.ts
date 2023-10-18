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

class ClantagczCommand extends Command {
    constructor() {
        super({
            trigger: 'clantag-sk',
            description: 'Sends the clan tag information embed in Slovak to #clan-tag',
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
        channelSend = await discordClient.channels.fetch('1138215758762098899') as TextChannel;
        console.log(channelSend)

        let channelSend2: TextChannel;
        channelSend = await discordClient.channels.fetch('1138215758762098899') as TextChannel;
        console.log(channelSend)

        const clanEmbed = new MessageEmbed()
        .setAuthor(`ARC Clan Tag Info`, infoIconUrl)
        .setColor(mainColor)
        .setDescription(`Poprosíme aby ste použivali náš Clan-tag v hre aby sme sa ukazovali aj pred ostatnými hráčmi serveru a aby sme boli viac viditeľný. ♡\n\n**1.** Najprv si otvoríte FiveM\n\n**2.** Potom pôjdete do Nastavení\n\n**3.** V složke "Account" si nájdete Player name a tam vložíte pred vašé meno náš Clan-Tag ^1[ARC]`)
        .setTimestamp();

        const ClanTag = await channelSend.send({ embeds: [clanEmbed] })
        let ClanMessage = await channelSend.send({
            files: ["https://i.imgur.com/jHdczyi.png", "https://i.imgur.com/ILf9KEj.png"],
        });

  const successEmbed = new MessageEmbed()

.setTitle('Success!')
.setColor(greenColor)
.setDescription(`Successfully sent the clan tag info in the language Slovak into ${channelSend}!`)
.setTimestamp();

ctx.reply({ embeds: [successEmbed] });
    }
}

export default ClantagczCommand;