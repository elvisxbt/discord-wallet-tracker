import { Client, Events, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import Web3 from 'web3';
dotenv.config();
const token = process.env.DISCORD_TOKEN;

// Create a new client instance with necessary intents
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent // Ensure this intent is enabled
    ] 
});

// Initialize Web3 with WebSocket provider
const web3 = new Web3(process.env.PROJECT_ID);

// List to store addresses
const addresses = [];

// When the client is ready, run this code (only once).
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('messageCreate', async message => {
    console.log(`Received message: ${message.content}`); // Log received messages

    if (message.content.startsWith('!monitor')) {
        const args = message.content.split(' ');
        if (args.length !== 2) {
            message.channel.send('Usage: !monitor <ethereum_address>');
            return;
        }

        const address = args[1];
        if (!web3.utils.isAddress(address)) {
            message.channel.send('Invalid Ethereum address.');
            return;
        }

        if (!addresses.includes(address)) {
            addresses.push(address);
            message.channel.send(`Monitoring address: ${address}`);

            // Monitor the address for new transactions
            web3.eth.subscribe('logs', {
                address: address
            }, (error, result) => {
                if (!error) {
                    // Parse the log data
                    const parsedData = {
                        address: result.address,
                        blockNumber: result.blockNumber,
                        transactionHash: result.transactionHash,
                        data: result.data,
                        topics: result.topics
                    };

                    // Send a message with the parsed data
                    message.channel.send(`New activity detected on address ${address}:
                    - Block Number: ${parsedData.blockNumber}
                    - Transaction Hash: ${parsedData.transactionHash}
                    - Data: ${parsedData.data}
                    - Topics: ${parsedData.topics.join(', ')}`);
                } else {
                    console.error(error);
                }
            });
        } else {
            message.channel.send(`Address ${address} is already being monitored.`);
        }
    }
});

// Log in to Discord with your app's token
client.login(token).catch(console.error);