import * as Discord from "discord.js"
import { database } from "firebase"

module.exports.run = async (client: Discord.Client, message: Discord.Message, args: Array<string>, embedColor: Discord.ColorResolvable, l: any, localStorage: any) => {
  if (!message.member.permissions.has("ManageGuild")) return message.channel.send({ embeds: [l.noPermission] })

  const embed = new Discord.EmbedBuilder()
    .setColor(embedColor)
    .setTitle(l.ticketsTitle)
    .setDescription(l.ticketsSetup)
    .setTimestamp()
  message.channel.send({ embeds: [embed] })

  const parametersCollector = message.channel.createMessageCollector()
  let topics: Array<string> = []

  parametersCollector.on("collect", msg => {
    if (msg.author.id !== message.author.id) return

    if (msg.content) {
      topics = msg.content.split(" | ")
      parametersCollector.stop()
    }
  })

  parametersCollector.on("end", () => {
    const embed = new Discord.EmbedBuilder()
      .setColor(embedColor)
      .setTitle(l.ticketsTitle)
      .setDescription(l.ticketsConfirm.replace("${topics}", topics.join("\n• ")))
      .setTimestamp()
    message.channel.send({ embeds: [embed] }).then(m => {
      m.react("✅").then(() => m.react("❌"))

      const acceptFilter = (reaction: Discord.MessageReaction, user: Discord.User) => user.id == message.author.id && reaction.emoji.name == "✅"
      const acceptListener = m.createReactionCollector({ filter: acceptFilter })

      acceptListener.on("collect", r => {
        r.users.remove(message.author)

        let description = ""
        const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]

        for (var i = 0; i <= topics.length - 1 && i <= 10; i++) {
          description += `${emojis[i]} ${topics[i]}\n`
        }

        const attachment = new Discord.AttachmentBuilder("./images/IDMIA - TICKET.png", {name: "ticket.png"})

        const finalEmbed = new Discord.EmbedBuilder()
          .setColor(embedColor)
          .setTitle(l.ticketsTitle)
          .setDescription(l.ticketsFinal.replace("${topics}", description))
          .setThumbnail("attachment://ticket.png")
          .setTimestamp()
          
        message.channel.send({ embeds: [finalEmbed], files: [attachment] }).then(msg => {

          for (var i = 0; i <= topics.length - 1 && i <= 10; i++) {
            msg.react(emojis[i])
          }

          database().ref(`/tickets/${message.guild.id}`).set({
            mainMessage: msg.id,
            topics: topics
          })
        })
      })
    })
  })
}

module.exports.help = {
  name: "tickets",
  category: "admin"
}