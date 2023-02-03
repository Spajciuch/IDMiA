import * as Discord from "discord.js"
import { database } from "firebase"

export function run(client: Discord.Client, localStorage: any) {
    client.on('raw', async packet => {
        if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return

        const guild = client.guilds.cache.get(packet.d.guild_id)
        const member = await guild.members.fetch(packet.d.user_id)
        const emoji = packet.d.emoji.name
        const channel = client.channels.cache.get(packet.d.channel_id) as Discord.TextChannel
        const messageID = packet.d.message_id

        // console.log(packet)

        database().ref(`/tickets/${guild.id}`).once("value").then(async d => {
            if (d.val()) {
                const data = d.val()
                if (data.mainMessage !== messageID) return
                if(member.user.bot) return

                const message = await channel.messages.fetch(messageID)
                const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(member.user.id));

                console.log("XD")

                try {
                    for (const reaction of userReactions.values()) {
                        await reaction.users.remove(member.user.id)
                    }
                } catch (error) {
                    console.error('Failed to remove reactions.');
                }
            }
        })
    })
}