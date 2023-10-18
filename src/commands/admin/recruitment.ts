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

class RecruitementCommand extends Command {
    constructor() {
        super({
            trigger: 'recruitment',
            description: 'Sends the recruitment information embed into #recruitment',
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
        channelSend = await discordClient.channels.fetch('1137723202504769616') as TextChannel;
        console.log(channelSend)

        let channelSend2: TextChannel;
        channelSend = await discordClient.channels.fetch('1137723202504769616') as TextChannel;
        console.log(channelSend)

        const clanEmbed = new MessageEmbed()
        .setAuthor(`ARC Clan`, infoIconUrl)
        .setColor(mainColor)
        .setDescription(`To become a member of the ARC Clan, please initiate the process by using \`/apply\` in <#1138969034315010209>. You will be required to answer a set of questions within the application system. A recruiter will be with you shortly to assist you further. Rest assured, we will process your request as quickly as possible. ❤️`);

        const requirementsEmbed = new MessageEmbed()
        .setAuthor(`Requirements`, infoIconUrl)
        .setColor(mainColor)
        .setDescription(`- You must be at least 15 years old. 🎮\n- You should have a minimum of 25 hours of playtime. ⏰\n- Active participation both in the game and on our Discord server is required. 📱💬\n- A proper microphone is essential. 🎙️\n- Fluency in English or Czech/Slovakian language is necessary. 🗣️ 🌐`)
        .setTimestamp();

        const ClanTag = await channelSend.send({ embeds: [clanEmbed, requirementsEmbed] })

  const successEmbed = new MessageEmbed()

.setTitle('Success!')
.setColor(greenColor)
.setDescription(`Successfully sent the clan recruitment info into ${channelSend}!`)
.setTimestamp();

ctx.reply({ embeds: [successEmbed] });
    }
}

export default RecruitementCommand;