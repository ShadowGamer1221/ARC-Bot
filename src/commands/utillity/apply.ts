import { MessageEmbed, TextChannel, Permissions, MessageButton, MessageActionRow } from 'discord.js';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { config } from '../../config';
import { checkIconUrl, infoIconUrl, mainColor } from '../../handlers/locale';

class ClanApplicationCommand extends Command {
    constructor() {
        super({
            trigger: 'apply',
            description: 'Apply for the clan',
            type: 'ChatInput',
            module: 'clan',
            args: [],
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
        const user = ctx.user;
        const guild = ctx.guild;

        // Define a category for the clan application channels (you may need to create the category first).
        const categoryID = '1137722394648252426'; // Replace with the actual category ID.

        // Define a name for the application channel.
        const channelName = `application-${user.tag}`;

        // Get the staff role.
        const staffRole = guild.roles.cache.get('1164246177936580748');

        if (!staffRole) {
            // Handle the case where the staff role is not found.
            console.log('Staff role not found.');
            return;
        }

        // Create the application channel.
        const applicationChannel = await guild.channels.create(channelName, {
            type: 'GUILD_TEXT', // Specify the channel type as text.
            parent: categoryID, // Set the category for the channel.
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL], // Allow the user to view the channel.
                },
                {
                    id: staffRole.id, // Staff role ID
                    allow: [Permissions.FLAGS.VIEW_CHANNEL], // Allow staff to view the channel.
                },
                {
                    id: guild.roles.everyone,
                    deny: [Permissions.FLAGS.VIEW_CHANNEL], // Deny everyone else from viewing the channel.
                },
            ],
        });

        // Send a welcome message in the channel.
        const welcomeEmbed = new MessageEmbed()
            .setTitle('Clan Application')
            .setDescription('Welcome to the clan application process. A recruiter will ask you a few questions. Please answer each question one by one.')
            .setColor('GREEN')
            .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        await applicationChannel.send({ embeds: [welcomeEmbed] });

        // You can customize the questions and the application process as needed here.

        // Create a "Close" button.
        const closeButton = new MessageButton()
            .setCustomId('close')
            .setLabel('Close')
            .setStyle('DANGER');

        const actionRow = new MessageActionRow().addComponents(closeButton);

        // Send the action row with the "Close" button.
        await applicationChannel.send({ components: [actionRow] });

        // Send a success message mentioning the created ticket channel.
        const successEmbed = new MessageEmbed()
            .setTitle('Success!')
            .setColor('GREEN')
            .setDescription(`Successfully created your application ticket in ${applicationChannel}!`)
            .setTimestamp();

        ctx.reply({ embeds: [successEmbed] });

        // Handle button interactions.
        const interactionFilter = (i) => i.customId === 'close';
        const buttonCollector = applicationChannel.createMessageComponentCollector({ filter: interactionFilter });

        buttonCollector.on('collect', async (interaction) => {
            // Handle "Close" button press.
            await applicationChannel.delete();
            // Send a DM to the user that their application has been closed.
            const closeEmbed = new MessageEmbed()
                .setAuthor(`Closed!`, infoIconUrl)
                .setColor(mainColor)
                .setDescription('Your clan application has been closed. If you have been accepted, you should have received a DM from me about your status. If not, please open a new application to inquire about your application status.')
                .setTimestamp();
            user.send({ embeds: [closeEmbed] }).catch(console.error);
        });
    }
}

export default ClanApplicationCommand;