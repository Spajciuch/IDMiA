import * as Discord from "discord.js"
import * as moment from "moment"
import fetch from "node-fetch"
import * as fs from "fs"

import { ticketsCategory, archiveChannel } from "../config.json"

module.exports.run = async (client: any, message: Discord.Message, args: Array<string>, embedColor: Discord.ColorResolvable, l: any, localStorage: any) => {
    const channel = (message.channel as Discord.TextChannel)
    if (client[message.channel.id] == true) return

    if (channel.parent.name !== ticketsCategory) {
        message.react("❌")
    } else {
        const embed = new Discord.EmbedBuilder()
            .setColor("#ff0000")
            .setTitle(l.ticketsTitle)
            .setDescription(l.uSureTicket)
            .setTimestamp()
        message.channel.send({ embeds: [embed] }).then(msg => {
            msg.react("✅").then(() => msg.react("❌"))
            
            const acceptFilter = (reaction: Discord.MessageReaction, user: Discord.User) => reaction.emoji.name == "✅" && user.bot == false
            const accept = msg.createReactionCollector({ filter: acceptFilter })

            const declineFilter = (reaction: Discord.MessageReaction, user: Discord.User) => reaction.emoji.name == "❌" && user.bot == false && user.id == message.author.id
            const decline = msg.createReactionCollector({ filter: declineFilter })

            accept.on("collect", async () => {
                client[message.channel.id] = true;

                (message.channel as Discord.TextChannel).edit({
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: ["ViewChannel"]
                        },
                        {
                            id: (message.channel as Discord.TextChannel).topic.replace("UID: ", ""),
                            allow: ["ViewChannel"],
                            deny: ["SendMessages"]
                        }
                    ]
                })

                const waitEmbed = new Discord.EmbedBuilder()
                    .setColor("#7289DA")
                    .setTitle(l.ticketsTitle)
                    .setDescription(l.archivizingTicketDescription)
                    .setImage("https://media.discordapp.net/attachments/565189397000224779/1073788139522490388/idmia_closed.gif")
                    .setTimestamp()
                msg.edit({ embeds: [waitEmbed] })
                msg.reactions.removeAll()

                let ticketLog = `TICKET - ${(message.channel as Discord.TextChannel).name} [${moment.utc(new Date()).format("DD.MM.YYYY")}]\n===============================================\n`
                const logFileName = Date.now().toString(36) + Math.random().toString(36).substr(2) + ".txt"
                const secretCode = logFileName.split(".")[0]

                let firstMessageTitle: string
                let attachmentsToUpload: Array<string> = []

                const messages = await fetchMore(channel)
                const messagesArray = messages.map((msg: Discord.Message) => msg)

                for (var i = messagesArray.length - 1; i >= 0; i--) {
                    const msg = messagesArray[i]
                    var dataToLog = `[${msg.author.tag}]${msg.content || l.ticketNoContent + " "}\n`

                    const attachmentArray = msg.attachments.map((attachment: Discord.Attachment) => attachment.attachment)

                    for (var x = 0; x <= attachmentArray.length - 1; x++) {
                        dataToLog += `[${secretCode}]\n`
                        attachmentsToUpload.push(attachmentArray[x].toString())
                    }

                    ticketLog += `${dataToLog}`
                }

                const botMessagesArray = messagesArray.filter(m => m.author.id == client.user.id)
                const botEmbedMessages = botMessagesArray.filter(m => m.embeds[0])

                if (botEmbedMessages) {
                    const description = botEmbedMessages.find(m => m.embeds[0].description.startsWith("•"))
                    firstMessageTitle = description.embeds[0].data.author.name

                } else {
                    console.log(botMessagesArray)
                    console.log("\n\n\n\n\n\n\n" + messagesArray)
                    firstMessageTitle = "BOTA POKURWIŁO"
                }

                const attachmentsObj = {
                    filesArray: attachmentsToUpload,
                    secretCode: secretCode
                }

                await fetch(`https://fileserver-spyte.glitch.me/ticket-attachments`, {
                    method: 'post',
                    body: JSON.stringify(attachmentsObj),
                    headers: { 'Content-Type': 'application/json' }
                }).then(async results => {
                    const data = await results.json()
                    const links: Array<string> = data.links

                    for (var i = 0; i <= links.length - 1; i++) {
                        ticketLog = ticketLog.replace(`[${secretCode}]`, links[i])
                    }
                })


                const localSave = `./tickets/${logFileName}`
                if (!fs.existsSync("./tickets")) {
                    await fs.mkdirSync("./tickets")
                }

                fs.writeFileSync(localSave, ticketLog)

                const bodyToSend = {
                    file: ticketLog
                }

                await fetch(`https://fileserver-spyte.glitch.me/upload/${logFileName}`, {
                    method: 'post',
                    body: JSON.stringify(bodyToSend),
                    headers: { 'Content-Type': 'application/json' }
                }).then(() => {
                    message.guild.channels.fetch(archiveChannel).then(ch => {
                        const channel = ch as Discord.TextChannel

                        const arcEmbed = new Discord.EmbedBuilder()
                            .setColor("#7289DA")
                            .setTitle(l.ticketSaveTitle.replace("${topic}", firstMessageTitle))
                            .setDescription(l.ticketSaveDescription.replace("${link}", `https://fileserver-spyte.glitch.me/file/${logFileName}`))
                            .setTimestamp()
                        channel.send({ embeds: [arcEmbed] })
                    })
                })
                    .catch(() => {
                        console.error(`[error] Wystąpił problem z wysłaniem pliku`)
                    })
                message.channel.delete()
            })

            decline.on("collect", async (r: Discord.MessageReaction) => {
                r.users.remove(message.author)
                msg.delete()
                message.delete()
            })
        })
    }
}

module.exports.help = {
    name: "closeTicket",
    category: "util"
}
async function fetchMore(channel: Discord.TextChannel, limit = 1000) {
    if (!channel) {
        throw new Error(`Expected channel, got ${typeof channel}.`);
    }
    if (limit <= 100) {
        return channel.messages.fetch({ limit });
    }

    let collection = new Discord.Collection();
    let lastId = null;
    let options: any = {};
    let remaining = limit;

    while (remaining > 0) {
        options.limit = remaining > 100 ? 100 : remaining;
        remaining = remaining > 100 ? remaining - 100 : 0;

        if (lastId) {
            options.before = lastId;
        }

        let messages: any = await channel.messages.fetch(options);

        if (!messages.last()) {
            break;
        }

        collection = collection.concat(messages);
        lastId = messages.last().id;
    }

    return collection;
}