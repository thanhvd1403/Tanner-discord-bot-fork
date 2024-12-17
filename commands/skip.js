const {GuildMember} = require('discord.js');
const {useQueue} = require('discord-player');
const {isInVoiceChannel} = require('../utils/voicechannel');

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
            return void interaction.followUp({content: '🤷  |  Không có nhạc đang phát!'});
        const currentTrack = queue.currentTrack;

        const success = queue.node.skip();
        return void interaction.followUp({
            content: success ? `✅  |  Bỏ qua **${currentTrack}**!` : 'Có lỗi gì rồi 🥲!',
        });
    },
};
