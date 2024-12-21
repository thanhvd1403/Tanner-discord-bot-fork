const {GuildMember} = require('discord.js');
const {useQueue} = require('discord-player');
const {isInVoiceChannel} = require('../utils/VoiceChannel');
const {createEmbed} = require('../utils/EmbedUtils');

module.exports = {
    name: 'nowplaying',
    description: 'Xem thông tin về bài đang phát',
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction);
        if (!inVoiceChannel) {
            return;
        }

        await interaction.deferReply();
        const queue = useQueue(interaction.guild.id);
        if (!queue || !queue.currentTrack)
            return void interaction.followUp(createEmbed('🤷', 'Không có nhạc đang phát!'));
        const progress = queue.node.createProgressBar();
        const perc = queue.node.getTimestamp();

        return void interaction.followUp({
            embeds: [
                {
                    title: 'Đang phát',
                    description: `🎧\u1CBC**${queue.currentTrack.title}** (\`${perc.progress}%\`)`,
                    fields: [
                        {
                            name: '\u200b',
                            value: progress,
                        },
                    ],
                    color: 0x893f3f,
                    epherial: true,
                },
            ],
        });
    },
};
