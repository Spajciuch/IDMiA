import * as Discord from "discord.js"
import { database } from "firebase"

module.exports.run = async (client: Discord.Client, message: Discord.Message, args: Array<string>, embedColor: Discord.ColorResolvable, l: any, localStorage: any) => {
    let member: Discord.GuildMember

    if (!message.mentions.members.first()) {
        if (!message.guild.members.cache.get(args[0])) return message.channel.send({ embeds: [l.noArgs] })
        else member = message.guild.members.cache.get(args[0])
    } else {
        member = message.mentions.members.first()
    }

    database().ref(`/warns/${message.guild.id}/${member.id}`).once("value").then(data => {
        if (!data.val()) {
            const embed = new Discord.MessageEmbed()
                .setColor(embedColor)
                .setTitle(l.checkTitle)
                .setDescription(l.checkEmpty)
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
        } else {
            const warnHistory = data.val()

            let moderators = warnHistory.moderators
            const reasons = warnHistory.reasons

            if (moderators.length !== reasons.length) {
                for (var i = 0; i <= reasons.length - moderators.length - 1; i++) {
                    moderators.splice(i, 0, "???")
                }
            }

            let description = ""

            for (var i = 0; i <= moderators.length - 1; i++) {
                description += `• ${reasons[i]} - <@${moderators[i]}>\n`
            }


            const embed = new Discord.MessageEmbed()
                .setColor(embedColor)
                .setThumbnail(member.user.displayAvatarURL({format: "png", size: 2048}))
                .setTitle(l.checkTitle + ` użytkownika ${member.user.tag}`)
                .setDescription(description)
                .setFooter(`Do bana: ${reasons.length} / ${3}`)
            message.channel.send({ embeds: [embed] })
        }
    })
}

module.exports.help = {
    name: "check",
    category: "admin"
}

module.exports.aliases = ["sprawdź"]