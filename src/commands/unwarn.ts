import * as Discord from "discord.js"
import { database } from "firebase"
import {warnRoles} from "../config.json"

module.exports.run = async (client: Discord.Client, message: Discord.Message, args: Array<string>, embedColor: Discord.ColorResolvable, l: any, localStorage: any) => {
    if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send({ embeds: [l.noPermission] })

    const memberID = args[0].replace("<", "").replace("@", "").replace("!", "").replace(">", "")
    if (!memberID || memberID.length !== 18) return message.channel.send({ embeds: [l.noMember] })

    const member = message.guild.members.cache.get(memberID)

    database().ref(`/warns/${message.guild.id}/${memberID}`).once("value").then(d => {
        const warnData = d.val()

        if (!warnData) {
            const embed = new Discord.MessageEmbed()
                .setColor("RED")
                .setTitle(l.errorTitle)
                .setDescription(l.checkEmpty)
                .setTimestamp()
            return message.channel.send({ embeds: [embed] })
        }

        let moderators = warnData.moderators
        let reasons = warnData.reasons

        if (moderators.length !== reasons.length) {
            for (var i = 0; i <= reasons.length - moderators.length - 1; i++) {
                moderators.splice(i, 0, "???")
            }
        }

        let description = ""

        for (var i = 0; i <= moderators.length - 1; i++) {
            description += `• ${i + 1}. ${reasons[i]} - <@${moderators[i]}>\n`
        }

        const embed = new Discord.MessageEmbed()
            .setColor(embedColor)
            .setTitle(l.checkTitle + message.author.tag)
            .setDescription(description)
            .addField(l.unwarnInstructionTitle, l.unwarnInstruction)
        message.channel.send({ embeds: [embed] }).then(() => {
            const filter = (m: Discord.Message) => m.author.id == message.author.id
            const collector = new Discord.MessageCollector(message.channel as Discord.TextChannel, { filter: filter })

            let index: number = -999

            collector.on("collect", msg => {
                if (Number(msg.content) == 0) {
                    const embed = new Discord.MessageEmbed()
                        .setColor("GREEN")
                        .setTitle(l.checkTitle)
                        .setDescription(l.canceled)
                        .setTimestamp()
                    message.channel.send({ embeds: [embed] })

                    return collector.stop()
                }

                if(msg.content.toLowerCase() == "all") {
                    database().ref(`/warns/${message.guild.id}/${memberID}`).set({
                    }).then(() => {
                        const embed = new Discord.MessageEmbed()
                            .setColor("GREEN")
                            .setTitle(l.checkTitle)
                            .setDescription(l.unwarnedAll.replace("${member}", member).replace("${moderator}", message.member))
                            .setTimestamp()
                        message.channel.send({ embeds: [embed] })

                        member.roles.remove(warnRoles[0])
                        member.roles.remove(warnRoles[1])
                    })

                    return collector.stop()
                }

                if (isNaN(Number(msg.content))) {
                    message.channel.send({ embeds: [l.isNaN] })
                    return
                }

                const number = Number(msg.content)
                if (number - 1 < 0 || number - 1 > moderators.length) {
                    message.channel.send({ embeds: [l.outOfRange] })
                    return
                }

                index = number - 1
                collector.stop()
            })

            collector.on("end", () => {
                if (index !== -999) {
                    moderators.splice(index, 1)
                    reasons.splice(index, 1)

                    database().ref(`/warns/${message.guild.id}/${memberID}`).set({
                        moderators: moderators,
                        reasons: reasons
                    }).then(() => {
                        const embed = new Discord.MessageEmbed()
                            .setColor("GREEN")
                            .setTitle(l.checkTitle)
                            .setDescription(l.unwarned.replace("${member}", member).replace("${moderator}", message.member))
                            .setTimestamp()
                        message.channel.send({ embeds: [embed] })

                        member.roles.remove(warnRoles[moderators.length])
                    })
                }
            })
        })
    })
}

module.exports.help = {
    name: "nwarn",
    category: "admin"
}