import * as Discord from "discord.js"
import fetch from "node-fetch"

module.exports.run = async (client: Discord.Client, message: Discord.Message, args: Array<string>, embedColor: Discord.ColorResolvable, l: any, localStorage: any) => {
    const {
        createCanvas,
        loadImage
    } = require('canvas')

    const member = message.member
    const channel = await message.guild.channels.fetch("945013962519490580") as Discord.TextChannel
    const count = 4

    const canvas = createCanvas(1920, 1080)
    const ctx = canvas.getContext('2d')

    const response = await fetch(member.user.avatarURL({ format: "png", size: 2048 }))
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

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "banner.png")
    channel.send({ files: [attachment] })
    
}


module.exports.help = {
    name: "welcomeTest"
}

module.exports.aliases = ["wt"]