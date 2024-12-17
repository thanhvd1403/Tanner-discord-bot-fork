const {ApplicationCommandOptionType} = require('discord.js');

module.exports = {
    name: 'userinfo',
    description: 'Xem thông tin của người dùng',
    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'Người dùng Discord',
            required: true,
        },
    ],
    execute(interaction, client) {
        const user = interaction.options.getUser('user');

        interaction.reply({
            content: `Name: ${user.username}, ID: ${user.id}, Avatar: ${user.displayAvatarURL({dynamic: true})}`,
            ephemeral: true,
        });
    },
};
