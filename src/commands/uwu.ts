import * as Discord from "discord.js"

module.exports.run = async (client: Discord.Client, message: Discord.Message, args: Array<string>, embedColor: Discord.ColorResolvable, l: any, localStorage: any) => {
    message.channel.send({ files: ["./images/üwü.jpg"] })
}

module.exports.help = {
    name: "wü",
    category: "util"
}

module.exports.aliases = ["uwu"]