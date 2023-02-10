import * as Discord from "discord.js"
import { propositions } from "../config.json"
import * as l from "../languages/pl.json"

export function run(client: Discord.Client, localStorage: any) {
    client.on("messageCreate", message => {
        if (message.channel.id !== propositions) return
        if (message.author.bot) return

        message.delete()

        const content = message.content

        const embed = new Discord.EmbedBuilder()
            .setColor("#00ffae")
            .setAuthor({ name: l.propositionTitle.replace("${member}", message.author.tag), iconURL: message.author.displayAvatarURL({ extension: "png", size: 1024 }) })
            .setDescription(`• ${content}`)
            .setTimestamp()
        message.channel.send({ embeds: [embed] }).then(m => {
            m.react("✅").then(() => m.react("❌"))
        })
    })
}
