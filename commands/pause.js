const {GuildMember} = require('discord.js');
const {useQueue} = require('discord-player');
const {isInVoiceChannel} = require('../utils/voicechannel');

module.exports = {
    name: 'pause',
    description: 'Tạm dừng nhạc đang phát',
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
        const success = queue.node.pause();
        return void interaction.followUp({
            content: success ? '⏸  |  Tạm dừng!' : 'Có lỗi gì rồi 🥲!',
        });
    },
};
