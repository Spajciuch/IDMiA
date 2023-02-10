import * as Discord from "discord.js"
import { database } from "firebase"
import { warnRoles } from "../config.json"

module.exports.run = async (client: Discord.Client, message: Discord.Message, args: Array<string>, embedColor: Discord.ColorResolvable, l: any, localStorage: any) => {
    if (!message.member.permissions.has("BanMembers")) return message.channel.send({ embeds: [l.noPermission] })

    const member: Discord.GuildMember = message.mentions.members.first()
    if (!member) return message.channel.send({ embeds: [l.noMention] })

    const reason = args.join(" ").slice(args[0].length + 1)
    if (!reason) return message.channel.send({ embeds: [l.noArgs] })

    database().ref(`/warns/${message.guild.id}/${member.user.id}`).once("value", d => {
        const data = d.val()

        let reasons: Array<string> = []
        let moderators: Array<string> = []

        if (data) {
            reasons = data.reasons
            moderators = data.moderators
        }

        reasons.push(reason)
        moderators.push(message.author.id)

        database().ref(`/warns/${message.guild.id}/${member.user.id}`).set({
            reasons,
            moderators
        }).then(() => {
            const embed = new Discord.EmbedBuilder()
                .setColor("#ffd500")
                .setTitle(l.warnTitle)
                .setDescription(l.warnDescription.replace("${member}", member.user.tag).replace("${reason}", reason).replace("${moderator}", message.member))
                .setTimestamp()
            message.channel.send({ embeds: [embed] })

            if (reasons.length > 2) {
                member.ban()

                const banEmbed = new Discord.EmbedBuilder()
                    .setColor("Red")
                    .setTitle(l.banTitle)
                    .setDescription(l.banned.replace("${member}", member).replace("${admin}", "zbyt dużą ilość zgłoszeń"))
                    .setTimestamp()
                    .setThumbnail(member.user.displayAvatarURL({ extension: "png", size: 2048 }))
                return message.channel.send({ embeds: [banEmbed] })
            }

            const roleIndex = reasons.length - 1
            const role = warnRoles[roleIndex]

            member.roles.add(role)
        })
    })
}

module.exports.help = {
    name: "warn"
}