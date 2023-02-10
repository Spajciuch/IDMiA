import * as Discord from "discord.js"
import fetch from "node-fetch"
import { welocomeMessage, welcomeChannel } from "../config.json"

export function run(client: Discord.Client, localStorage: any) {
    client.on("guildMemberAdd", async member => {
        const guild = member.guild
        const channel = await guild.channels.fetch(welcomeChannel) as Discord.TextChannel

        const members = await guild.members.fetch()

        let botCount = 0
        members.forEach(mbr => {
            if (mbr.user.bot == true) botCount++
        })

        const count = guild.memberCount - botCount
        const {
            createCanvas,
            loadImage
        } = require('canvas')

        const canvas = createCanvas(1920, 1080)
        const ctx = canvas.getContext('2d')

        const response = await fetch(member.user.avatarURL({ extension: "png", size: 2048 }))
        const responseBuffer = await response.buffer()
        const item = await loadImage(responseBuffer)

        ctx.drawImage(item, 770, 294, 404, 404)

        const background = await loadImage("./images/baner.png")
        ctx.drawImage(background, 0, 0, 1920, 1080)

        ctx.font = `80px "MuseoModerno"`
        ctx.fillStyle = "#ffffff"
        ctx.textAlign = "center"

        ctx.fillText(`Jesteś tu: #${count}`, 960, 190)

        ctx.font = `90px "MuseoModerno"`

        ctx.fillText(member.user.tag, 975, 835)

        const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: "banner.png"})
        channel.send({ files: [attachment] })
    })
}