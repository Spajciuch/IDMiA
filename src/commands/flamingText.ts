import * as Discord from "discord.js"
import * as flameText from 'flaming-text-generator';

module.exports.run = async (client: Discord.Client, message: Discord.Message, args: Array<string>, embedColor: Discord.ColorResolvable, l: any, localStorage: any) => {
    const text = args.join(" ") || "no text"

    const spliceAndGenerate = async function (txt: string) {
        const characterSize = txt.length
        const iterations = Math.ceil(characterSize / 50)
        const characterArray = txt.split("")

        for (var i = 0; i <= iterations - 1; i++) {
            let wordArray = characterArray.slice((50 * i), (50 * i) + 50)
            let wordToGenerate = wordArray.join("")

            await flameText.generate({ text: wordToGenerate, transparent: true, animLoop: true, fontSize: 80 }).then((data: any) => {
                const generatedLink = data.src

                if (data.error) {
                    const embed = new Discord.MessageEmbed()
                        .setColor(embedColor)
                        .setTitle(l.errorTitle)
                        .setDescription(l.ftError)
                        .setTimestamp()
                    message.channel.send({ embeds: [embed] })
                }

                const attachment = new Discord.MessageAttachment(generatedLink, `${message.author.username} - flamingText.gif`)
                message.channel.send({ files: [attachment] })
            })
        }

    }

    flameText.generate({ text: text, transparent: true, animLoop: true, fontSize: 80 }).then((data: any) => {
        const generatedLink = data.src

        if (data.error) {
            message.channel.send(l.ftTooLong).then(m => {
                m.react("✅").then(() => m.react("❌"))

                const acceptFilter = (reaction: Discord.MessageReaction, user: Discord.User) => user.id == message.author.id && reaction.emoji.name == "✅"
                const declineFilter = (reaction: Discord.MessageReaction, user: Discord.User) => user.id == message.author.id && reaction.emoji.name == "❌"

                const accept = m.createReactionCollector({ filter: acceptFilter })
                const decline = m.createReactionCollector({ filter: declineFilter })

                accept.on("collect", r => {
                    message.channel.send(l.ftWait)
                    spliceAndGenerate(text)
                })

                decline.on("collect", r => {
                    return
                })
            })
            return
        }

        const attachment = new Discord.MessageAttachment(generatedLink, `${message.author.username} - flamingText.gif`)
        message.channel.send({ files: [attachment] })
    })
}

module.exports.help = {
    name: "flamingText",
    category: "util"
}

module.exports.aliases = ["ft", "flaming", "flame", "fire"]