const { Client, GatewayIntentBits } = require('discord.js');
const nodemailer = require('nodemailer');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', message => {
    if (message.content.startsWith('!verify')) {
        const email = message.content.split(' ')[1];
        if (email && email.endsWith('@iitg.ac.in')) {
            const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code

            const mailOptions = {
                from: 'your-email@gmail.com',
                to: email,
                subject: 'IITGAA Discord Verification Code',
                text: `Your verification code is ${verificationCode}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    message.channel.send('There was an error sending the verification email.');
                } else {
                    message.channel.send('A verification code has been sent to your email. Please use !code <code> to verify.');
                    client.once('messageCreate', msg => {
                        if (msg.content === `!code ${verificationCode}`) {
                            message.member.roles.add('1261100753582293133');
                            message.channel.send('You have been verified and granted access!');
                        }
                    });
                }
            });
        } else {
            message.channel.send('Please provide a valid IITG email address.');
        }
    }
});
