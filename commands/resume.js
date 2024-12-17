const {useQueue} = require('discord-player');
const {isInVoiceChannel} = require('../utils/voicechannel');

module.exports = {
    name: 'resume',
    description: 'Tiếp tục nhạc đang phát',
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction);
        if (!inVoiceChannel) {
            return;
        }

        await interaction.deferReply();
        const queue = useQueue(interaction.guild.id);
        if (!queue || !queue.currentTrack)
            return void interaction.followUp({
                content: '🤷  |  Không có nhạc đang phát!',
            });

        const success = queue.node.resume();
        const currentTrack = queue.currentTrack;
        return void interaction.followUp({
            content: success ? `▶  |  Tiếp tục **${currentTrack}**` : 'Có lỗi gì rồi 🥲!',
        });
    },
};
