const {GuildMember, ApplicationCommandOptionType} = require('discord.js');
const {QueryType, useQueue, useMainPlayer} = require('discord-player');
const {isInVoiceChannel} = require('../utils/voicechannel');

module.exports = {
    name: 'playnext',
    description: 'Phát nhạc ngay sau bài hiện tại',
    options: [
        {
            name: 'query',
            type: ApplicationCommandOptionType.String,
            description: 'Tên bài / Link Diu túp, Spotify, SC... / Link playlist',
            required: true,
        },
    ],
    async execute(interaction) {
        try {
            const inVoiceChannel = isInVoiceChannel(interaction);
            if (!inVoiceChannel) {
                return;
            }

            await interaction.deferReply();

            const player = useMainPlayer();
            const query = interaction.options.getString('query');
            const searchResult = await player
                .search(query, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO,
                })
                .catch(() => {});
            if (!searchResult || !searchResult.tracks.length)
                return void interaction.followUp({content: '🧐  |  Không có kết quả tìm kiếm!'});

            const queue = useQueue(interaction.guild.id);

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                return void interaction.followUp({
                    content: '🤕  |  Không vào voice được!',
                });
            }

            await interaction.followUp({
                content: `⏱  |  Đang thêm ${searchResult.playlist ? 'playlist' : 'bài hát'}...`,
            });
            searchResult.playlist
                ? queue.node.insert(searchResult.tracks, 0)
                : queue.node.insert(searchResult.tracks[0], 0);
            if (!queue.currentTrack) await player.play();
        } catch (error) {
            console.log(error);
            await interaction.followUp({
                content: '😵 Xếp ơi có vấn đề: ' + error.message,
            });
        }
    },
};
