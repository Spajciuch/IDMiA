import * as Discord from "discord.js"
import * as dotenv from "dotenv"
import * as fs from "fs"
import * as pl from "./languages/pl.json"
import * as firebase from "firebase"

dotenv.config()

type local = {
    [key: string]: any
}

declare module 'discord.js' {
    interface Client {
        commands: any
    }
}

const localStorage: local = {}

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_BANS",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_INTEGRATIONS",
        "GUILD_INVITES",
        "GUILD_MEMBERS",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "GUILD_VOICE_STATES",
        "GUILD_WEBHOOKS"],
    makeCache: Discord.Options.cacheEverything()
})

client.commands = new Discord.Collection()

const chalk = require("chalk")

const firebaseConfig = {
    apiKey: "AIzaSyC3Bb5EI0-bu9dKLc1HwQCQiy4U8dVjhNk",
    authDomain: "idmia-66bce.firebaseapp.com",
    databaseURL: "https://idmia-66bce-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "idmia-66bce",
    storageBucket: "idmia-66bce.appspot.com",
    messagingSenderId: "808304027546",
    appId: "1:808304027546:web:e12265dd5d85be06067c23"
  };
  
  const app = firebase.initializeApp(firebaseConfig);

fs.readdir("./dist/commands", async (err, files) => {
    if (err) console.log(chalk.red(`[error] ${err}`))
    const jsfile = files.filter(f => f.split(".").pop() == "js")

    if (jsfile.length <= 0) {
        console.log(chalk.red("[error] Nie znaleziono komend!"))
    }

    jsfile.forEach((f, i) => {
        const props = require(`./commands/${f}`)
        if (!props.help) return console.log(chalk.yellow(`[info] Wykryto nowy, nieprzygotowany plik komendy [${f}]`))

        console.log(chalk.cyan(`[Załadowano] ${f}`))
        client.commands.set(props.help.name, props)
    })
})

fs.readdir("./dist/listeners", async (err, files) => {
    if (err) console.log(chalk.red(`[error] ${err}`))
    const jsfile = files.filter(f => f.split(".").pop() == "js")

    if (jsfile.length <= 0) {
        console.log(chalk.red("[error] Nie znaleziono listenerów!"))
    }

    jsfile.forEach((f, i) => {
        if (f !== "autoUpdaterDev.js") {
            const props = require(`./listeners/${f}`)
            if (!props.run) return console.log(chalk.yellow(`[info] Wykryto nowy, nieprzygotowany plik typu: listener [${f}]`))

            console.log(chalk.yellow(`[Załadowano] ${f}`))
            props.run(client, localStorage)
        }
    })
})

client.on("ready", () => {
    console.log(chalk.blue(`[client] Zalogowano jako ${client.user.tag}`))
})

client.on("messageCreate", message => {
    if (message.author.bot) return
    if (message.channel.type == "DM") return

    const prefix = "ü"
    const embedColor = "#4ad8ff"
    let language = pl

    if (!message.content.startsWith(prefix)) return

    const messageArray = message.content.split(" ")
    const cmd = messageArray[0]
    const commandName = cmd.slice(prefix.length)
    const args = message.content.slice(prefix.length + commandName.length).trim().split(/ +/g)

    let commandFile = client.commands.get(cmd.slice(prefix.length)) ||
        client.commands.find((cmd: { aliases: string | string[] }) => cmd.aliases && cmd.aliases.includes(commandName))

    if (commandFile) {
        commandFile.run(client, message, args, embedColor, language)
        console.log(chalk.magenta(`[command] ${commandName} | ${message.author.tag} | ${message.guild.name} [${message.guild.id}]`))
    }
})

client.login(process.env.TOKEN)