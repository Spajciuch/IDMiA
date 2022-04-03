import * as Discord from "discord.js"

module.exports.run = async (client: Discord.Client, message: Discord.Message, args: Array<string>, embedColor: Discord.ColorResolvable, l: any, localStorage: any) => {

    if (message.author.id != "367390191721381890") return message.channel.send("Wrr!")

    const result = eval(args.join(" "))

    const embed = new Discord.MessageEmbed()
        .setTitle("Eval")
        .addField(":inbox_tray: Wejście", "```" + args.join(" ") + "```")
        .addField(":outbox_tray: Wyjście", "```" + result + "```")
        .setColor(embedColor)
        .setTimestamp()
    message.channel.send({embeds: [embed]})
}

module.exports.help = {
    name: "eval",
}

module.exports.aliases = ["e"]