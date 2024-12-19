const {useQueue} = require('discord-player');
const {isInVoiceChannel} = require('../utils/VoiceChannel');
const {createEmbed} = require('../utils/EmbedUtils');

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
            return void interaction.followUp(createEmbed('🤷', 'Không có nhạc đang phát!'));

        const success = queue.node.resume();
        const currentTrack = queue.currentTrack;
        return void interaction.followUp(
            success ? createEmbed(`▶️`, `Tiếp tục **${currentTrack.cleanTitle}**`) : 'Có lỗi gì rồi 🥲!',
        );
    },
};
