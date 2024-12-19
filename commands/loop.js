const {ApplicationCommandOptionType} = require('discord.js');
const {QueueRepeatMode, useQueue} = require('discord-player');
const {isInVoiceChannel} = require('../utils/VoiceChannel');
const {createEmbed} = require('../utils/EmbedUtils');

module.exports = {
    name: 'loop',
    description: 'Chỉnh chế độ lặp lại',
    options: [
        {
            name: 'mode',
            type: ApplicationCommandOptionType.Integer,
            description: 'Chế độ lặp',
            required: true,
            choices: [
                {
                    name: 'Tắt',
                    value: QueueRepeatMode.OFF,
                },
                {
                    name: 'Lặp 1 bài',
                    value: QueueRepeatMode.TRACK,
                },
                {
                    name: 'Lặp hàng chờ',
                    value: QueueRepeatMode.QUEUE,
                },
                {
                    name: 'Autoplay',
                    value: QueueRepeatMode.AUTOPLAY,
                },
            ],
        },
    ],
    async execute(interaction) {
        try {
            const inVoiceChannel = isInVoiceChannel(interaction);
            if (!inVoiceChannel) {
                return;
            }

            await interaction.deferReply();

            const queue = useQueue(interaction.guild.id);
            if (!queue || !queue.currentTrack) {
                return void interaction.followUp(createEmbed('🤷', 'Không có nhạc đang phát!'));
            }

            const loopMode = interaction.options.getInteger('mode');
            queue.setRepeatMode(loopMode);
            const mode = loopMode === QueueRepeatMode.TRACK ? '🔂' : loopMode === QueueRepeatMode.QUEUE ? '🔁' : '▶️';

            return void interaction.followUp(createEmbed(mode, 'Đã cập nhật chế độ lặp!'));
        } catch (error) {
            console.log(error);
            return void interaction.followUp({
                content: '😵 Xếp ơi có vấn đề: ' + error.message,
            });
        }
    },
};
