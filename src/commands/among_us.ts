import * as Discord from "discord.js"
import { database } from "firebase"

module.exports.run = async (client: Discord.Client, message: Discord.Message, args: Array<string>, embedColor: Discord.ColorResolvable, l: any, localStorage: any) => {
    message.channel.send("https://c.tenor.com/uW6H2QV23ZwAAAAC/amogus-cry-about-it.gif")
}

module.exports.help = {
    name: "amongus"
}

module.exports.aliases = ["amogus"]