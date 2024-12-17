const {GuildMember} = require('discord.js');
const {useQueue} = require('discord-player');
const {isInVoiceChannel} = require('../utils/voicechannel');

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
            return void interaction.followUp({
                content: '🤷  |  Không có nhạc đang phát!',
            });
        queue.delete();
        return void interaction.followUp({content: '⏹️  Đã dừng  |  Hết nhạc rồi em đi đây! 🦦'});
    },
};
