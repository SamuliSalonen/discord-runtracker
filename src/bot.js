require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const dataPath = "runinfo.json";
const monthlyGoal = 200;

let fullRunData = [];

fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    fullRunData = JSON.parse(data);
})



const commands = {

    "!addkm": (author, parts, msg) => {
        if (parts.length > 1) {
            const amount = (parts[1]);

            if (isNaN(amount)) return;
            if (amount <= 0) return;

            const distance = parseFloat(parts[1]);

            console.log(author);
            console.log(parts);
            const runData = {
                id: author.id,
                username: author.username,
                distance: distance,
                time: Date.now()
            };

            fullRunData.push(runData);

            fs.writeFileSync(dataPath, JSON.stringify(fullRunData));
            msg.channel.send("Succesfully added "+runData.distance+" KM");
            //   console.log(runData);
        }
    },
    "!total": (author, parts, msg) => {
        let total = 0;
        const now = new Date();

        for (let i = 0; i < fullRunData.length; i++) {
            const element = fullRunData[i];
            const date = new Date(element.time);
            const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
            const timeDiff = now.getTime() - date.getTime();
            if (timeDiff < thirtyDaysInMs) {
                total += element.distance;
            }


        }

        msg.channel.send("Total: " + total + "KM. which is " + ((total / monthlyGoal) * 100) + "% of the monthly goal of " + monthlyGoal + "KM");

    }

};

client.login(process.env.DiscordBotToken);

client.on('message', async (msg) => {
    if(process.env.LimitChannel && msg.channel.id!=process.env.LimitChannel) return;
    
    const parts = msg.content.replace(/\s+/g, ' ').trim().toLowerCase().split(' ');

    const command = commands[parts[0]];
    if (command) {
        command(msg.author, parts, msg);
    }

});