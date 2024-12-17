const {ApplicationCommandOptionType} = require('discord.js');
const {useMainPlayer} = require('discord-player');
const {isInVoiceChannel} = require('../utils/voicechannel');

module.exports = {
    name: 'play',
    description: 'Phát nhạc!',
    options: [
        {
            name: 'query',
            type: ApplicationCommandOptionType.String,
            description: 'Tên bài / Link Diu túp, Spotify, SC... / Link playlist',
            required: true,
        },
    ],
    async execute(interaction) {
        const {default: Conf} = await import('conf');
        try {
            const inVoiceChannel = isInVoiceChannel(interaction);
            if (!inVoiceChannel) {
                return;
            }

            await interaction.deferReply();

            const player = useMainPlayer();
            const query = interaction.options.getString('query');
            const searchResult = await player.search(query);
            if (!searchResult.hasTracks())
                return void interaction.followUp({content: '🧐  |  Không có kết quả tìm kiếm!'});

            try {
                const config = new Conf({projectName: 'volume'});

                await player.play(interaction.member.voice.channel.id, searchResult, {
                    nodeOptions: {
                        metadata: {
                            channel: interaction.channel,
                            client: interaction.guild?.members.me,
                            requestedBy: interaction.user.username,
                        },
                        leaveOnEmptyCooldown: 300000,
                        leaveOnEmpty: true,
                        leaveOnEnd: false,
                        bufferingTimeout: 0,
                        volume: config.get('volume') || 10,
                        //defaultFFmpegFilters: ['lofi', 'bassboost', 'normalizer']
                    },
                });

                await interaction.followUp({
                    content: `⏱  |  Đang thêm ${searchResult.playlist ? 'playlist' : 'bài hát'}...`,
                });
            } catch (error) {
                await interaction.editReply({
                    content: 'Có lỗi gì rồi 🥲!',
                });
                return console.log(error);
            }
        } catch (error) {
            await interaction.reply({
                content: '😵 Xếp ơi có vấn đề: ' + error.message,
            });
        }
    },
};
