const {useQueue} = require('discord-player');
const {isInVoiceChannel} = require('../utils/VoiceChannel');
const {createEmbed} = require('../utils/EmbedUtils');

module.exports = {
    name: 'skip',
    description: 'Bỏ qua bài đang phát',
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction);
        if (!inVoiceChannel) {
            return;
        }

        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id);
        if (!queue || !queue.currentTrack)
            return void interaction.followUp(createEmbed('🤷', 'Không có nhạc đang phát!'));
        const currentTrack = queue.currentTrack;

        const success = queue.node.skip();
        return void interaction.followUp(
            success ? createEmbed(`✅`, `Bỏ qua **${currentTrack.cleanTitle}**!`) : 'Có lỗi gì rồi 🥲!',
        );
    },
};
