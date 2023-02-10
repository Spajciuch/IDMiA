import * as Discord from "discord.js"

module.exports.run = async (client: Discord.Client, message: Discord.Message, args: Array<string>, embedColor: Discord.ColorResolvable, l: any, localStorage: any) => {
    const channel = message.channel as Discord.TextChannel

    if (message.author.id != "367390191721381890") return (message.channel as Discord.BaseGuildTextChannel).send("Wrr!")
    
    const result = eval(args.join(" "))

    const embed = new Discord.EmbedBuilder()
        .setTitle("Eval")
        .addFields(
            { name: ":inbox_tray: Wejście", value: "```" + args.join(" ") + "```" },
            { name: ":outbox_tray: Wyjście", value: "```" + result + "```" })
        .setColor(embedColor)
        .setTimestamp()
    message.channel.send({embeds: [embed]})
}

module.exports.help = {
    name: "eval",
}

module.exports.aliases = ["e"]