import * as Discord from "discord.js"

module.exports.run = async (client: Discord.Client, message: Discord.Message, args: Array<string>, embedColor: string, l: any, localStorage: any) => {
    if (!message.member.permissions.has("ManageMessages")) return message.channel.send({ embeds: [l.noPermission ]})
    if (!args[0]) return message.channel.send({ embeds: l.noArgs })

    const channel = message.channel as Discord.TextChannel

    const number = Number(args[0])
    if (isNaN(number)) return channel.send({ embeds: l.isNaN })
    const sNumber = number.toString()
    let output = []

    message.delete()

    if (number >= 101 && number <= 999) {
        for (var i = 0, len = sNumber.length; i < len; i += 1) {
            output.push(+sNumber.charAt(i));
        }

        for (var i = 0; i <= output[0] - 1; i++) {
            channel.bulkDelete(100).catch(err => {
                const embed = new Discord.EmbedBuilder()
                    .setColor("Red")
                    .setTitle(l.errorTitle)
                    .setDescription(l.clearTooOld)
                    .setTimestamp()
                channel.send({embeds: [embed]})
            })
        }

        const rest = Number(`${output[1]}${output[2]}`)
        channel.bulkDelete(rest).catch(err => {
            const embed = new Discord.EmbedBuilder()
                .setColor("Red")
                .setTitle(l.errorTitle)
                .setDescription(l.clearTooOld)
                .setTimestamp()
            channel.send({embeds: [embed]})
        })
            .then(() => {
                const embed = new Discord.EmbedBuilder()
                    .setColor("Green")
                    .setTitle(l.clearTitle)
                    .setDescription(l.clearDone.replace("${count}", number))
                    .setTimestamp()
                channel.send({embeds: [embed]}).then(m => {setTimeout(() => {m.delete()}, 3500)}) // m.delete({ timeout: 3500 }
            })

    } else if (Number(args[0]) <= 100) {
        const number = Number(args[0])
        if (isNaN(number)) return channel.send({ embeds: l.isNaN })

        channel.bulkDelete(number).catch(err => {
            const embed = new Discord.EmbedBuilder()
                .setColor("Red")
                .setTitle(l.errorTitle)
                .setDescription(l.clearTooOld)
                .setTimestamp()
            channel.send({embeds: [embed]})
        })
            .then(() => {
                const embed = new Discord.EmbedBuilder()
                    .setColor("Green")
                    .setTitle(l.clearTitle)
                    .setDescription(l.clearDone.replace("${count}", number))
                    .setTimestamp()
                channel.send({embeds: [embed]}).then(m => {setTimeout(() => {m.delete()}, 3500)})
            })
    }
}

module.exports.help = {
    name: "clear",
    category: "admin"
}

module.exports.aliases = ["prune", "delete"]