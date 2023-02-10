import * as Discord from "discord.js"
import firebase, { database } from "firebase"
import { ticketsCategory, prefix, maxTickets } from "../config.json"
import * as l from "../languages/pl.json"

export function run(client: Discord.Client, localStorage: any) {
    client.on('raw', async packet => {
        if (!['MESSAGE_REACTION_ADD'].includes(packet.t)) return

        const guild = client.guilds.cache.get(packet.d.guild_id)
        const member = await guild.members.fetch(packet.d.user_id)
        const emoji = packet.d.emoji.name
        const channel = client.channels.cache.get(packet.d.channel_id) as Discord.TextChannel
        const messageID = packet.d.message_id
        const data = localStorage.tickets[guild.id]

        if (data.mainMessage !== messageID) return
        if (member.user.bot) return

        const message = await channel.messages.fetch(messageID)

        try {
            message.reactions.resolve(emoji).users.remove(member.user)
        } catch (error) {
            console.error('Failed to remove reactions.');
        }

        const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]
        const topic = data.topics[emojis.indexOf(emoji)]

        const uniqueID = Date.now().toString(36) + Math.random().toString(36).substr(2)
        const channelName = `${member.user.username}_${uniqueID}`

        let categoryChannel: Discord.CategoryChannel
        let allChannels: Discord.Collection<string, Discord.NonThreadGuildBasedChannel>

        await message.guild.channels.fetch().then(ch => {
            categoryChannel = ch.find((c: Discord.GuildChannel) => c.name == ticketsCategory && c.type == Discord.ChannelType.GuildCategory) as Discord.CategoryChannel
            allChannels = ch
        })

        let userOwned = 0

        if (categoryChannel) {
            allChannels.forEach(channel => {
                if ((channel as Discord.TextChannel).topic == `UID: ${member.user.id}` && channel.parent.name == ticketsCategory) {
                    userOwned++
                }
            })
        }

        if (userOwned >= maxTickets) {
            const embed = new Discord.EmbedBuilder()
                .setColor("#ff0000")
                .setTitle(l.ticketsTitle)
                .setDescription(l.ticketsTooMany)
                .setTimestamp()
            member.user.send({ embeds: [embed] })

            return
        }

        guild.channels.create({
            name: channelName,
            type: Discord.ChannelType.GuildText,
            topic: `UID: ${member.user.id}`,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: ["ViewChannel"]
                },
                {
                    id: member.user.id,
                    allow: ["ViewChannel"]
                }
            ]
        }).then(async ticketChannel => {
            if (!categoryChannel) {
                await guild.channels.create({ name: ticketsCategory, type: Discord.ChannelType.GuildCategory }).then(c => {
                    categoryChannel = c
                })
            }

            ticketChannel.setParent((categoryChannel as Discord.CategoryChannel))
            await ticketChannel.edit({
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: ["ViewChannel"]
                    },
                    {
                        id: member.user.id,
                        allow: ["ViewChannel"]
                    }
                ]
            })

            const attachment = new Discord.AttachmentBuilder("./images/IDMIA - TICKET.png", { name: "ticket.png" })
            const embed = new Discord.EmbedBuilder()
                .setColor("#ff9100")
                .setAuthor({ name: `${topic} - ${l.ticketsMadeBy} ${member.user.tag}`, iconURL: member.user.displayAvatarURL({ extension: "png", "size": 1024 }) })
                .setThumbnail("attachment://ticket.png")
                .setDescription(l.ticketsDescription.replace("${prefix}", prefix))
                .setTimestamp()
            ticketChannel.send({ embeds: [embed], files: [attachment] }).then(() => {
                // ticketChannel.send(`${guild.roles.cache.find(r => r.name =="@everyone")}`).then(m => m.delete())
            })
        })
    })
}