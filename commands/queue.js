const {GuildMember} = require('discord.js');
const {useQueue} = require('discord-player');
const {isInVoiceChannel} = require('../utils/voicechannel');

module.exports = {
    name: 'queue',
    description: 'Xem hàng chờ',
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction);
        if (!inVoiceChannel) {
            return;
        }

        const queue = useQueue(interaction.guild.id);
        if (queue != null) {
            const trimString = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

            let queueStr = `🎼 **Tiếp theo:**\n`;

            // Build queue list
            queue.tracks.data.forEach((track, index) => {
                queueStr += `${index + 1}. ${track.title}\n`;
            });

            return void interaction.reply({
                embeds: [
                    {
                        title: `🎧  Đang phát  |  **${queue.currentTrack.title}**`,
                        description: trimString(queueStr, 4095),
                        color: 0x893f3f,
                    },
                ],
            });
        } else {
            return void interaction.reply({
                content: '🤷  |  Hàng chờ hong có gì cả!',
            });
        }
    },
};
