import * as Discord from "discord.js"
import { database } from "firebase"

module.exports.run = async (client: Discord.Client, message: Discord.Message, args: Array<string>, embedColor: Discord.ColorResolvable, l: any, localStorage: any) => {
    if (!message.member.permissions.has("ManageGuild")) return message.channel.send({ embeds: [l.noPermission] })

    function onlyRoles(array: Array<string>) {
        let state = true
        for (var i = 0; i <= array.length - 1; i++) {
            if (array[i].includes("<@&") && array[i].includes(">") && array[i].length == 22) {
                // do nothing
            } else {
                return false
            }
        }

        return true
    }

    function hasDuplicates(array: Array<string>) {
        return (new Set(array)).size !== array.length
    }

    function isEmoji(str: string) {
        var ranges = [
            '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])' // U+1F680 to U+1F6FF
        ];
        if (str.match(ranges.join('|'))) {
            return true;
        } else {
            return false;
        }
    }

    const embed = new Discord.EmbedBuilder()
        .setColor(embedColor)
        .setTitle(l.reactionRoleTitle)
        .setDescription(l.reactionRoleInstruction)
        .setTimestamp()
    message.channel.send({ embeds: [embed] })

    const filter = (msg: Discord.Message) => msg.author.id == message.author.id
    const collector = new Discord.MessageCollector(message.channel as Discord.TextChannel, { filter: filter })

    let roles: Array<any>

    collector.on("collect", msg => {
        if (msg.content.toLowerCase() == "stop") {
            roles = undefined

            const embed = new Discord.EmbedBuilder()
                .setColor("Red")
                .setTitle(l.reactionRoleTitle)
                .setDescription(l.stopped)
                .setTimestamp()
            message.channel.send({ embeds: [embed] })

            return collector.stop()
        }

        roles = msg.content.split(" ")

        if (hasDuplicates(roles)) {
            const embed = new Discord.EmbedBuilder()
                .setColor("Red")
                .setTitle(l.errorTitle)
                .setDescription(l.reactionRoleDuplicates)
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
            return
        }

        if (!onlyRoles(roles)) {
            const embed = new Discord.EmbedBuilder()
                .setColor("Red")
                .setTitle(l.errorTitle)
                .setDescription(l.reactionRoleNoRoles)
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
            return
        }

        collector.stop()
    })

    collector.on("end", () => {
        if (!roles || roles == undefined) return

        const embed = new Discord.EmbedBuilder()
            .setColor(embedColor)
            .setTitle(l.reactionRoleTitle)
            .setDescription(l.reactionRoleEmojiInstruction)
            .setTimestamp()
        message.channel.send({ embeds: [embed] })

        const emojiCollector = new Discord.MessageCollector(message.channel as Discord.TextChannel, { filter: filter })

        let emojis: Array<string>

        emojiCollector.on("collect", msg => {
            if (msg.content.toLowerCase() == "stop") {
                emojis = undefined

                const embed = new Discord.EmbedBuilder()
                    .setColor("Red")
                    .setTitle(l.reactionRoleTitle)
                    .setDescription(l.stopped)
                    .setTimestamp()
                message.channel.send({ embeds: [embed] })

                return emojiCollector.stop()
            }

            emojis = msg.content.split(" ")

            if (hasDuplicates(emojis)) {
                const embed = new Discord.EmbedBuilder()
                    .setColor("Red")
                    .setTitle(l.errorTitle)
                    .setDescription(l.reactionRoleEmojiDuplicates)
                    .setTimestamp()
                message.channel.send({ embeds: [embed] })
                return
            }

            for (var i = 0; i <= emojis.length - 1; i++) {
                if (!isEmoji(emojis[i])) {
                    let emojiArray = emojis[i].split(":")

                    if (!emojis[i].includes("<:") && !emojis[i].includes(">") && emojiArray[emojiArray.length - 1].length !== 19 && emojiArray.length !== 3) {
                        const embed = new Discord.EmbedBuilder()
                            .setColor("Red")
                            .setTitle(l.errorTitle)
                            .setDescription(l.reactionRoleTooLow)
                            .setTimestamp()
                        message.channel.send({ embeds: [embed] })
                        return
                    }
                }
            }

            if (emojis.length !== roles.length) {
                const embed = new Discord.EmbedBuilder()
                    .setColor("Red")
                    .setTitle(l.errorTitle)
                    .setDescription(l.reactionRoleTooLow)
                    .setTimestamp()
                message.channel.send({ embeds: [embed] })
                return
            }

            emojiCollector.stop()
        })

        emojiCollector.on("end", () => {
            if (!emojis || emojis == undefined) return

            const embed = new Discord.EmbedBuilder()
                .setColor(embedColor)
                .setTitle(l.reactionRoleTitle)
                .setDescription(l.reactionRoleSetTitle)
                .setTimestamp()
            message.channel.send({ embeds: [embed] })

            const titleCollector = new Discord.MessageCollector(message.channel as Discord.TextChannel, { filter: filter })

            let title: string

            titleCollector.on("collect", msg => {
                if (msg.content.toLowerCase() == "stop") {
                    title = undefined

                    const embed = new Discord.EmbedBuilder()
                        .setColor("Red")
                        .setTitle(l.reactionRoleTitle)
                        .setDescription(l.stopped)
                        .setTimestamp()
                    message.channel.send({ embeds: [embed] })

                    return titleCollector.stop()
                }

                title = msg.content

                titleCollector.stop()
            })

            let description = ""

            titleCollector.on("end", async () => {
                for (var i = 0; i <= roles.length - 1; i++) {
                    description += `• ${emojis[i]} - ${roles[i]}\n`
                }

                const embed = new Discord.EmbedBuilder()
                    .setColor(embedColor)
                    .setTitle(title)
                    .setDescription(description)
                    .setTimestamp()
                message.channel.send({ embeds: [embed] }).then(async msg => {
                    for (var i = 0; i <= emojis.length - 1; i++) {
                        if (isEmoji(emojis[i])) {
                            msg.react(emojis[i])
                        } else {
                            let emojiArray = emojis[i].split(":")
                            let emojiID = emojiArray[2].replace(">", "")

                            await msg.react(emojiID)
                        }
                    }

                    database().ref(`/reactionMenu/${message.guild.id}/menuObj`).once("value", d => {
                        let menuObj = d.val()
                        if (!menuObj) menuObj = []

                        const object = {
                            emojis: emojis,
                            roles: roles,
                            title: title,
                            message: msg.id
                        }

                        menuObj[menuObj.length] = object

                        database().ref(`/reactionMenu/${message.guild.id}`).set({
                            menuObj: menuObj
                        })
                    })
                })
            })
        })
    })
}

module.exports.help = {
    name: "reactionRole",
    category: "admin"
}

module.exports.aliases = ["reactionrole", "react", "role", "reactionMenu"]