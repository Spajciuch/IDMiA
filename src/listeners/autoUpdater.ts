import * as Discord from "discord.js"
import { database } from "firebase"

export function run(client: Discord.Client, localStorage: any) {
    client.on("ready", () => {
        const settingsListener = database().ref(`/settings`)
        const anonListener = database().ref(`/anon`)
        const countingListener = database().ref(`/counting`)
        const propositionsListener = database().ref(`/propositions`)
        const reactionMenuListener = database().ref(`/reactionMenu`)
        const statusListener = database().ref(`/status`)
        const verificationListener = database().ref(`/verification`)
        const lastLetter = database().ref(`/lastLetter`)
        const giveawayListener = database().ref(`/giveaway`)
        const lastLetterListener = database().ref(`/lastLetter`)
        const repliesListener = database().ref(`/replies`)
        const customCommandsListener = database().ref(`/customCommands`)
        const recrutListener = database().ref(`/recrut`)
        const quizListener = database().ref(`/quizes`)
        const quizLeaderboard = database().ref(`/quizLeaderboard`)
        const storeListener = database().ref(`/serverStore/`)
        const inventoryListener = database().ref(`/memberInventory/`)
        const economyListener = database().ref(`/economy`)


        settingsListener.on("value", () => {
            client.guilds.cache.forEach(guild => {
                database().ref(`/settings/${guild.id}/`).once("value").then(data => {
                    const settings = data.val()

                    localStorage[guild.id] = settings
                })
            })
        })

        anonListener.on("value", () => {
            localStorage.anon = {}

            client.guilds.cache.forEach(guild => {

                database().ref(`/anon/${guild.id}/data`).once("value").then(data => {
                    if (data.val()) {
                        const settings = data.val()

                        localStorage.anon[guild.id] = settings
                    }
                })

            })
        })

        countingListener.on("value", () => {
            localStorage.counting = []

            client.guilds.cache.forEach(guild => {

                database().ref(`/counting/${guild.id}`).once("value").then(data => {
                    if (data.val()) {
                        const settings = data.val()
                        const list = localStorage.counting

                        localStorage.counting[list.length] = settings.channel
                    }
                })

            })
        })

        propositionsListener.on("value", () => {
            localStorage.propositions = []

            client.guilds.cache.forEach(guild => {

                database().ref(`/propositions/${guild.id}`).once("value").then(data => {
                    if (data.val()) {
                        const settings = data.val()
                        const list = localStorage.propositions

                        localStorage.propositions[list.length] = settings.channel
                    }
                })

            })
        })

        reactionMenuListener.on("value", () => {
            localStorage.reactionMenu = {}

            client.guilds.cache.forEach(guild => {

                database().ref(`/reactionMenu/${guild.id}/menuObj`).once("value").then(data => {
                    if (data.val()) {
                        const settings = data.val()

                        settings.forEach((menu: { title: any }) => {
                            const menuTitle = `${menu.title}${guild.id}`
                            localStorage.reactionMenu[menuTitle] = menu
                        })
                    }
                })

            })
        })

        statusListener.on("value", () => {
            localStorage.status = {}

            client.guilds.cache.forEach(guild => {

                database().ref(`/status/${guild.id}`).once("value").then(data => {
                    if (data.val()) {
                        const settings = data.val()

                        localStorage.status[guild.id] = settings
                    }
                })

            })
        })

        verificationListener.on("value", () => {
            localStorage.verification = {}

            client.guilds.cache.forEach(guild => {

                database().ref(`/verification/${guild.id}`).once("value").then(data => {
                    if (data.val()) {
                        const settings = data.val()

                        localStorage.verification[guild.id] = settings
                    }
                })

            })
        })

        lastLetter.on("value", () => {
            localStorage.lastLetter = []

            client.guilds.cache.forEach(guild => {

                database().ref(`/lastLetter/${guild.id}`).once("value").then(data => {
                    if (data.val()) {
                        const settings = data.val()

                        const list = localStorage.lastLetter
                        localStorage.lastLetter[list.length] = settings.channel
                    }
                })
            })
        })

        giveawayListener.on("value", () => {
            localStorage.giveaway = {}

            client.guilds.cache.forEach(guild => {
                database().ref(`/giveaway/${guild.id}/giveaway`).once("value").then(data => {
                    if (data.val()) {
                        const settings = data.val()

                        localStorage.giveaway[guild.id] = []

                        settings.forEach((menu: { message: any }) => {
                            const messageId = `${menu.message}`
                            localStorage.giveaway[guild.id][messageId] = menu
                        })
                    }
                })
            })
        })

        lastLetterListener.on("value", () => {
            localStorage.lastLetter = {}

            client.guilds.cache.forEach(guild => {
                database().ref(`/lastLetter/${guild.id}/channels`).once("value", d => {
                    if (d.val()) localStorage.lastLetter[guild.id] = d.val()
                })
            })
        })

        repliesListener.on("value", () => {
            localStorage.replies = {}
            
            client.guilds.cache.forEach(guild => {

                database().ref(`/replies/${guild.id}/state`).once("value", d => {
                    if (d.val()) localStorage.replies[guild.id] = d.val()
                    else localStorage.replies[guild.id] = false
                })
            })
        })

        customCommandsListener.on("value", d => {
            localStorage.customCommands = []

            if (d.val()) localStorage.customCommands = d.val()
        })

        recrutListener.on("value", d => {
            localStorage.recrut = []

            if(d.val()) localStorage.recrut = d.val()
        })

        quizListener.on("value", d => {
            localStorage.quizList = []
            const data = d.val()

            if(d.val()) localStorage.quizList = data.quizList
        })

        quizLeaderboard.on("value", d => {
            localStorage.quizLeaderboard = {}
            const data = d.val()


            if(d.val()) localStorage.quizLeaderboard = data.list
        })

        storeListener.on("value", d => {
            localStorage.store = {}

            const data = d.val()
            
            if(d.val()) localStorage.store = data
        })

        inventoryListener.on("value", d => {
            localStorage.inventory = {}

            const data = d.val()
            if(d.val()) localStorage.inventory = data
        })
        
        economyListener.on("value", d => {
            localStorage.economy = {}

            const data = d.val()
            if(d.val()) localStorage.economy = data
        })
    })
}