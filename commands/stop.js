const {useQueue} = require('discord-player');
const {isInVoiceChannel} = require('../utils/VoiceChannel');
const {createEmbed} = require('../utils/EmbedUtils');

module.exports = {
    name: 'stop',
    description: 'Dừng phát nhạc và rời voice channel',
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction);
        if (!inVoiceChannel) {
            return;
        }

        await interaction.deferReply();
        const queue = useQueue(interaction.guild.id);
        if (!queue || !queue.currentTrack)
            return void interaction.followUp(createEmbed('🤷', 'Không có nhạc đang phát!'));
        queue.delete();
        return void interaction.followUp(createEmbed('⏹️', 'Đã dừng! Hết nhạc rồi em đi đây! 🦦'));
    },
};
