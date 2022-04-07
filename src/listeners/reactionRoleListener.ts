import * as Discord from "discord.js"

export function run(client: Discord.Client, localStorag: any) {
    client.on('raw', async packet => {
        if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return

        const guild = client.guilds.cache.get(packet.d.guild_id)
        const member = await guild.members.fetch(packet.d.user_id)
        const emoji = packet.d.emoji.name
        const channel = client.channels.cache.get(packet.d.channel_id) as Discord.TextChannel

        channel.messages.fetch(packet.d.message_id).then(message => {
            if (!message.embeds) return
            if (!message.embeds[0]) return

            const title = message.embeds[0].title
            if (!title) return

            const menuTitle = `${title}${guild.id}`

            const reactionMenu = localStorag.reactionMenu[menuTitle]
            if (!reactionMenu) return

            if (message.id !== reactionMenu.message) return

            const actualEmojiArr = reactionMenu.emojis
            let newEmojiArr = []

            for (var i = 0; i <= actualEmojiArr.length - 1; i++) {
                let emojiArr = actualEmojiArr[i].split(":")

                if (emojiArr.length == 1) newEmojiArr[newEmojiArr.length] = emojiArr[0]
                else newEmojiArr[newEmojiArr.length] = emojiArr[1]
            }

            const index = newEmojiArr.indexOf(emoji)

            const role = reactionMenu.roles[index].replace("<@&", "").replace(">", "")

            if (packet.t == "MESSAGE_REACTION_ADD") {
                member.roles.add(role)
            } else {
                if (member.roles.cache.find((r: Discord.Role) => r.id == role)) member.roles.remove(role)
            }
        })
    })
}
