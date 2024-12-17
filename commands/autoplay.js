const {QueueRepeatMode, useQueue} = require('discord-player');
const {isInVoiceChannel} = require('../utils/voicechannel');

module.exports = {
    name: 'autoplay',
    description: 'Bật/tắt autoplay (tự động chọn nhạc sau khi hết hàng chờ)',
    async execute(interaction) {
        try {
            const inVoiceChannel = isInVoiceChannel(interaction);
            if (!inVoiceChannel) {
                return;
            }
            await interaction.deferReply();

            const queue = useQueue(interaction.guild.id);
            if (!queue || !queue.currentTrack) {
                return void interaction.followUp({content: '🤷  |  Không có nhạc đang phát!'});
            }

            // Toggle autoplay mode
            const currentMode = queue.repeatMode;
            const setMode = currentMode === QueueRepeatMode.AUTOPLAY ? QueueRepeatMode.OFF : QueueRepeatMode.AUTOPLAY;
            queue.setRepeatMode(setMode);

            const modeString = {
                emoji: setMode === QueueRepeatMode.AUTOPLAY ? '✅' : '❎',
                state: setMode === QueueRepeatMode.AUTOPLAY ? 'bật' : 'tắt',
            };
            return void interaction.followUp({
                content: `${modeString.emoji}  |  Đã ${modeString.state} autoplay`,
            });
        } catch (error) {
            console.log(error);
            await interaction.followUp({
                content: '😵 Xếp ơi có vấn đề: ' + error.message,
            });
        }
    },
};
