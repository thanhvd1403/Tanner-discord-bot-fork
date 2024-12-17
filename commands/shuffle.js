const {GuildMember} = require('discord.js');
const {useQueue} = require('discord-player');
const {isInVoiceChannel} = require('../utils/voicechannel');

module.exports = {
    name: 'shuffle',
    description: 'Bật/tắt trộn bài',
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction);
        if (!inVoiceChannel) {
            return;
        }

        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id);
        if (!queue || !queue.currentTrack)
            return void interaction.followUp({content: '🤷  |  Không có nhạc đang phát!'});

        try {
            queue.toggleShuffle();
            const shuffleState = queue.isShuffling;
            if (shuffleState) {
                return void interaction.followUp({
                    content: '🔀  |  Đã bật trộn bài! Bài tiếp theo sẽ được chọn ngẫu nhiên từ hàng chờ!',
                });
            } else {
                return void interaction.followUp({content: '▶️  |  Đã tắt trộn bài!'});
            }
        } catch (error) {
            console.log(error);
            return void interaction.followUp({
                content: 'Có lỗi gì rồi 🥲!',
            });
        }
    },
};
