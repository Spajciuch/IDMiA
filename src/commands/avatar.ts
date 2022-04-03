import * as Discord from "discord.js"

module.exports.run = async (client: Discord.Client, message: Discord.Message, args: Array<string>, embedColor: Discord.ColorResolvable, l: any, localStorage: any) => {
    let user

    if (!args[0]) {
        user = message.author
    } else {
        const member = message.mentions.members.first()
        user = member.user
    }

    const avatarURL = user.displayAvatarURL({ size: 2048 })

    const embed = new Discord.MessageEmbed()
        .setColor(embedColor)
        .setTitle(l.avatarTitle + user.tag)
        .setImage(avatarURL)
    message.channel.send({embeds: [embed]})

}

module.exports.help = {
    name: "avatar",
    category: "util"
}

module.exports.aliases = ["awatar"]