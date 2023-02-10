import * as Discord from "discord.js"
import * as moment from "moment"
import fetch from "node-fetch"
import * as fs from "fs"

import { ticketsCategory, archiveChannel } from "../config.json"

module.exports.run = async (client: Discord.Client, message: Discord.Message, args: Array<string>, embedColor: Discord.ColorResolvable, l: any, localStorage: any) => {
    const channel = (message.channel as Discord.TextChannel)

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

            const declineFilter = (reaction: Discord.MessageReaction, user: Discord.User) => reaction.emoji.name == "❌" && user.bot == false
            const decline = msg.createReactionCollector({ filter: declineFilter })

            accept.on("collect", async () => {
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
                    .setTimestamp()
                msg.edit({ embeds: [waitEmbed] })
                msg.reactions.removeAll()

                let ticketLog = `TICKET - ${(message.channel as Discord.TextChannel).name} [${moment.utc(new Date()).format("DD.MM.YYYY")}]\n===============================================\n`
                const logFileName = Date.now().toString(36) + Math.random().toString(36).substr(2) + ".txt"

                let firstMessageTitle: string

                await message.channel.messages.fetch().then(async (messages: Discord.Collection<string, Discord.Message>) => {
                    const messagesArray = messages.map((msg: Discord.Message) => msg)

                    for (var i = messagesArray.length - 1; i >= 0; i--) {
                        const msg = messagesArray[i]
                        var dataToLog = `[${msg.author.tag}]${msg.content || l.ticketNoContent + " "}\n`

                        const attachmentArray = msg.attachments.map((attachment: Discord.Attachment) => attachment.attachment)

                        for (var x = 0; x <= attachmentArray.length - 1; x++) {
                            const attachmentURL = attachmentArray[x]

                            const bodyToSend = {
                                fileURL: attachmentURL,
                                fileName: logFileName.split(".")[0] + "_" + attachmentURL.toString().split("/")[attachmentURL.toString().split("/").length - 1]
                            }

                            await fetch(`https://fileserver-spyte.glitch.me/ticket-attachments`, {
                                method: 'post',
                                body: JSON.stringify(bodyToSend),
                                headers: { 'Content-Type': 'application/json' }
                            }).then(async results => {
                                const data = await results.json()
                                dataToLog += data.fileURL + "\n"
                            })
                        }

                        ticketLog += `${dataToLog}`

                        if (i == messagesArray.length - 1) {
                            firstMessageTitle = msg.embeds[0].data.author.name
                        }
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
            })
        })
    }
}

module.exports.help = {
    name: "closeTicket",
    category: "util"
}