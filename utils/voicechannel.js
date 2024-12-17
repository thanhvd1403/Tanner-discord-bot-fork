const {GuildMember} = require('discord.js');

const isInVoiceChannel = interaction => {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
        interaction.reply({
            content: '🔇  |  Anh chị phải vào voice trước đã nha!',
            ephemeral: true,
        });
        return false;
    }

    if (
        interaction.guild.members.me.voice.channelId &&
        interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
    ) {
        interaction.reply({
            content: '👿  |  Không nghe tui thì xin đừng làm phiền!',
            ephemeral: true,
        });
        return false;
    }

    return true;
};

exports.isInVoiceChannel = isInVoiceChannel;
