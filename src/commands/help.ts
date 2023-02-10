import * as Discord from "discord.js"
import * as config from "../config.json"

module.exports.run = async (client: Discord.Client, message: Discord.Message, args: Array<string>, embedColor: Discord.ColorResolvable, l: any, localStorage: any) => {
    if (!args[0]) {
        let description = ""

        const commandNames = client.commands.filter((cmd: { help: { category: string } }) => cmd.help.category !== "hidden").map((cmd: { help: { name: string } }) => '`' + cmd.help.name + '`')

        for (var i = 0; i <= commandNames.length - 1; i++) {
            description = commandNames.join(", ")
        }

        const embed = new Discord.EmbedBuilder()
            .setColor(embedColor)
            .setTitle(l.help.mainTitle.replace("${client}", client.user.tag))
            .setDescription(l.help.mainScreen.replace("${prefix}", config.prefix))
            .addFields({name: l.help.allCommands, value: description})
            .setThumbnail(client.user.avatarURL({ size: 1024, extension: "png" }))
        message.channel.send({ embeds: [embed] })
    } else {
        const commandName = args[0]
       
        const embed = new Discord.EmbedBuilder()
        .setColor(embedColor)
        .setTitle(l.help.mainTitle.replace("${client}", client.user.tag))
        .setThumbnail(client.user.avatarURL({ size: 1024, extension: "png" }))
        .setDescription(l.help[commandName] || "• Na razie do tej komendy nie ma opisu")

        message.channel.send({embeds: [embed]})
    }
}


module.exports.help = {
    name: "help",
    category: "util"
}