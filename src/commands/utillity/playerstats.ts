import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch'; // Install this library if not already installed
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { infoIconUrl, mainColor, redColor, xmarkIconUrl } from '../../handlers/locale';
import { config } from '../../config';

class PlayerstatsCommand extends Command {
    constructor() {
        super({
            trigger: 'playerstats',
            description: 'Get player statistics',
            type: 'ChatInput',
            module: 'utillity',
            args: [
                {
                    trigger: 'playerId',
                    description: 'The player ID',
                    isLegacyFlag: false,
                    required: true,
                    type: 'String',
                },
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
        const playerId = ctx.args['playerId'];
        const apiUrl = `https://api.cosmicv.net/stats/user/${playerId}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                ctx.reply('Failed to fetch player statistics. Please try again later.');
                return;
            }

            const data = await response.json();

            if (data.status !== 200 || !data.data) {
                ctx.reply('Failed to fetch player statistics. Please verify the player ID and try again.');
                return;
            }

            const playerData = data.data.player;
            const stats = JSON.parse(playerData.stats);

            const embed = new MessageEmbed()
                .setAuthor(`Player Stats for ${playerData.username}`, infoIconUrl)
                .setColor(mainColor)
                .addFields(
                    { name: 'Username', value: `${playerData.username}`, inline: true },
                    { name: 'Prestige', value: `${playerData.prestige}`, inline: true },
                    { name: 'Competitive Rank', value: `${playerData.competitive}`, inline: true },
                    { name: 'Total XP', value: `${playerData.xp.toLocaleString()}`, inline: true },
                    { name: 'Total Money', value: `$${playerData.money.toLocaleString()}`, inline: true },
                    { name: 'Games Won', value: `${stats.wins}`, inline: true },
                    { name: 'Games Played', value: `${stats.gamesPlayed}`, inline: true },
                    { name: 'Headshots', value: `${stats.headshots.toLocaleString()}`, inline: true },
                    { name: 'Driver Assists', value: `${stats['driver-assist'].toLocaleString()}`, inline: true },
                    { name: 'Longshot Kills', value: `${stats.longshot.toLocaleString()}`, inline: true },
                    { name: 'Furthest Headshot', value: `${stats['longest-headshot'].toLocaleString()}m`, inline: true },
                    { name: 'Vehicle Destroyed', value: `${stats['destroyed-vehicles'].toLocaleString()}`, inline: true },
                    { name: 'Vehicle Ammo Refills', value: `${stats['destroyed-vehicles'].toLocaleString()}`, inline: true },
                    { name: 'Total Vehicle Kills', value: `${stats.vehicleKills}`, inline: true },
                    { name: 'First Joined', value: new Date(playerData.created_at).toDateString(), inline: true },
                );

                if (playerData.stats && playerData.stats.Level !== undefined) {
                    embed.addField('Level', `${playerData.stats.Level}`, true);
                }
                
                if (playerData.last_joined !== undefined) {
                    embed.addField('Last Joined', new Date(playerData.last_joined * 1000).toDateString(), true);
                }

            ctx.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            
            const errorEmbed = new MessageEmbed()
            .setAuthor(`Error`, xmarkIconUrl)
            .setDescription(`An error occurred while fetching player statistics from CosmicV`)
            .setColor(redColor)
            .setTimestamp();
            ctx.reply({ embeds: [errorEmbed] });
        }
    }
}

export default PlayerstatsCommand;