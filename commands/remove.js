const {GuildMember, ApplicationCommandOptionType} = require('discord.js');
const {useQueue} = require('discord-player');
const {isInVoiceChannel} = require('../utils/VoiceChannel');
const {createEmbed} = require('../utils/EmbedUtils');

module.exports = {
    name: 'remove',
    description: 'Xoá một bài khỏi hàng chờ',
    options: [
        {
            name: 'number',
            type: ApplicationCommandOptionType.Integer,
            description: 'Số thứ tự của bài cần xoá',
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
            return void interaction.followUp(createEmbed('🤷', 'Không có nhạc đang phát!'));

        const number = interaction.options.getInteger('number') - 1;
        if (number > queue.tracks.size) return void interaction.followUp(createEmbed('😡', 'Số này to quá!'));

        const removedTrack = queue.node.remove(number);
        return void interaction.followUp(
            removedTrack ? createEmbed(`✅`, `Đã xoá bài **${removedTrack.cleanTitle}**!`) : 'Có lỗi gì rồi 🥲!',
        );
    },
};
