require('dotenv').config();
const {Client, GatewayIntentBits} = require('discord.js');

const client = new Client({intents: [GatewayIntentBits.Guilds]});

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    try {
        // Step 1: Delete all global commands
        const globalCommands = await client.application.commands.fetch();
        if (globalCommands.size > 0) {
            console.log(`Found ${globalCommands.size} global command(s). Deleting...`);
            globalCommands.forEach(async command => {
                await client.application.commands.delete(command.id);
                console.log(`Deleted global command: ${command.name}`);
            });
        } else {
            console.log('No global commands found.');
        }

        // Step 2: Delete all guild-specific commands for each guild
        const guilds = await client.guilds.fetch();

        guilds.forEach(async guild => {
            try {
                const fetchedGuild = await guild.fetch();
                const guildCommands = await fetchedGuild.commands.fetch();

                if (guildCommands.size > 0) {
                    console.log(`Found ${guildCommands.size} command(s) in guild ${fetchedGuild.name}. Deleting...`);
                    guildCommands.forEach(async command => {
                        await fetchedGuild.commands.delete(command.id);
                        console.log(`Deleted guild command: ${command.name} in ${fetchedGuild.name}`);
                    });
                } else {
                    console.log(`No commands found in guild ${fetchedGuild.name}.`);
                }
            } catch (error) {
                console.error(`Error processing guild ${guild.id}:`, error);
            }
        });
    } catch (error) {
        console.error('Error deleting commands:', error);
    }

    console.log('Finished deleting all commands.');
});

client.login(process.env.TOKEN);
