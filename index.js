require('dotenv').config();

const {YoutubeiExtractor} = require('discord-player-youtubei');
const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const config = require('./config.json');
const {Player} = require('discord-player');
const {createStatusEmbed, createEmbed} = require('./utils/EmbedUtils');

const client = new Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// console.log(client.commands);

const player = new Player(client);

player.extractors.register(YoutubeiExtractor, {}).then(r => console.log('Extractors loaded successfully'));

// Still needs to be refactored for 0.6
/*player.events.on('connection', (queue) => {
    queue.connection.connec.voiceConnection.on('stateChange', (oldState, newState) => {
      const oldNetworking = Reflect.get(oldState, 'networking');
      const newNetworking = Reflect.get(newState, 'networking');

      const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
        const newUdp = Reflect.get(newNetworkState, 'udp');
        clearInterval(newUdp?.keepAliveInterval);
      }

      oldNetworking?.off('stateChange', networkStateChangeHandler);
      newNetworking?.on('stateChange', networkStateChangeHandler);
    });
});*/

// player.events.on('audioTrackAdd', (queue, song) => {
//     queue.metadata.channel.send(`🎶  |  Đã thêm **${song.title}** vào hàng chờ!`);
// });

player.events.on('playerStart', (queue, track) => {
    queue.metadata.channel.send(createStatusEmbed(`🎧`, `Đang phát: **${track.cleanTitle} - ${track.author}**`));
});

// player.events.on('audioTracksAdd', (queue, track) => {
//     queue.metadata.channel.send(`🎶  |  Đã thêm playlist vào hàng chờ!`);
// });

player.events.on('disconnect', queue => {
    queue.metadata.channel.send(createEmbed('🥹', 'Em bị đuổi khỏi voice rồi, xoá queue đây!'));
});

player.events.on('emptyChannel', queue => {
    queue.metadata.channel.send(createEmbed('😶‍🌫️', 'Không thấy ai trong voice nữa, em đi đây...'));
});

// player.events.on('emptyQueue', queue => {
//     queue.metadata.channel.send('✅ | Queue finished!');
//     // Delete queue and disconnect from voice channel
//     queue.delete();
// });

player.events.on('error', (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

// For debugging
/*player.on('debug', async (message) => {
    console.log(`General player debug event: ${message}`);
});

player.events.on('debug', async (queue, message) => {
    console.log(`Player debug event: ${message}`);
});

player.events.on('playerError', (queue, error) => {
    console.log(`Player error event: ${error.message}`);
    console.log(error);
});*/

client.on('ready', async function () {
    console.log(`Logged in as ${client.user.tag}`);

    try {
        // Delete all guild-specific commands for each guild
        const guilds = await client.guilds.fetch();

        for (const guildData of guilds.values()) {
            try {
                const guild = await guildData.fetch();
                console.log('Setting commands for guild:', guild.name);
                await guild.commands.set(client.commands);
                console.log('Deployed commands for guild:', guild.name);
            } catch (error) {
                console.error(`Error processing guild ${guildData.id}:`, error);
            }
        }

        console.log('Ready!');
    } catch (error) {
        console.error('Error fetching guild data:', error);
    }

    client.user.presence.set({
        activities: [{name: config.activityName, type: Number(config.activityType)}],
        status: Discord.Status.Ready,
    });
});

client.once('reconnecting', () => {
    console.log('Reconnecting!');
});

client.once('disconnect', () => {
    console.log('Disconnect!');
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;
    if (!client.application?.owner) await client.application?.fetch();

    if (message.content === '!deploy' && message.author.id === client.application?.owner?.id) {
        await message.guild.commands
            .set(client.commands)
            .then(() => {
                message.reply('Deployed!');
            })
            .catch(err => {
                message.reply('Could not deploy commands! Make sure the bot has the application.commands permission!');
                console.error(err);
            });
    }
});

client.on('interactionCreate', async interaction => {
    const command = client.commands.get(interaction.commandName.toLowerCase());

    try {
        if (interaction.commandName == 'ban' || interaction.commandName == 'userinfo') {
            command.execute(interaction, client);
        } else {
            command.execute(interaction);
        }
    } catch (error) {
        console.error(error);
        await interaction.followUp({
            content: 'index.js: Có lỗi khi đang chạy lệnh 🥲!',
        });
    }
});

client.login(process.env.DISCORD_TOKEN);
