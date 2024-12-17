const {GuildMember, ApplicationCommandOptionType} = require('discord.js');
const {useQueue} = require('discord-player');
const {isInVoiceChannel} = require('../utils/voicechannel');

module.exports = {
    name: 'move',
    description: 'Đổi vị trí một bài trong hàng chờ',
    options: [
        {
            name: 'track',
            type: ApplicationCommandOptionType.Integer,
            description: 'Số thứ tự của bài trong hàng chờ',
            required: true,
        },
        {
            name: 'position',
            type: ApplicationCommandOptionType.Integer,
            description: 'Vị trí mới',
            required: true,
        },
    ],
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction);
        if (!inVoiceChannel) {
            return;
        }

        await interaction.deferReply();
        const queue = useQueue(interaction.guild.id);

        if (!queue || !queue.currentTrack)
            return void interaction.followUp({content: '🤷  |  Không có nhạc đang phát!'});

        const queueNumbers = [
            interaction.options.getInteger('track') - 1,
            interaction.options.getInteger('position') - 1,
        ];

        if (queueNumbers[0] > queue.tracks.size || queueNumbers[1] > queue.tracks.size)
            return void interaction.followUp({content: '😡  |  Số này to quá!'});

        try {
            const track = queue.node.remove(queueNumbers[0]);
            queue.node.insert(track, queueNumbers[1]);
            return void interaction.followUp({
                content: `✅  |  Đã đổi vị trí bài **${track}**!`,
            });
        } catch (error) {
            console.log(error);
            return void interaction.followUp({
                content: 'Có lỗi gì rồi 🥲!',
            });
        }
    },
};
