const fs = require('fs');

module.exports = {
    name: 'help',
    description: 'Liệt kê tất cả câu lệnh',
    execute(interaction) {
        let str = '';
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`./${file}`);
            str += `**/${command.name}** - ${command.description} \n`;
        }

        return void interaction.reply({
            embeds: [
                {
                    description: str,
                    color: 0x893f3f,
                },
            ],
            ephemeral: true,
        });
    },
};
