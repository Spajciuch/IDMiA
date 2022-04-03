import * as Discord from "discord.js"
import { welocomeMessage, welcomeChannel } from "../config.json"

export function run(client: Discord.Client, localStorage: any) {
    client.on("guildMemberAdd", async member => {
        const guild = member.guild
        const channel = await guild.channels.fetch(welcomeChannel) as Discord.TextChannel

        const members = await guild.members.fetch()
        
        let botCount = 0
        members.forEach(mbr => {
            if(mbr.user.bot == true) botCount ++
        })

        const totalCount = guild.memberCount - botCount

        channel.send(welocomeMessage.replace("${member}", `${member.user}`).replace("${count}", totalCount.toString()))
    })
}