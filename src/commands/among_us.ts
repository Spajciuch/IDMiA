import * as Discord from "discord.js"

module.exports.run = async (client: Discord.Client, message: Discord.Message, args: Array<string>, embedColor: Discord.ColorResolvable, l: any, localStorage: any) => {
    message.channel.send("https://c.tenor.com/uW6H2QV23ZwAAAAC/amogus-cry-about-it.gif")

    message.guild.members
        .fetch()
        .then((members) => {
            members.forEach(async (member: any) => {
                const allRoles = member["_roles"]

                const genderRoles = ["959564600209186826", "959564519951200356", "959564346088894544"]
                const ageRoles = ["959598600411836446", "959599666494836807", "959599926914990130", "959599995256975430", "959600067487076393", "959600258541813800"]
                const rulesAccepted = "852625657619415050"

                const foundGender = allRoles.some((r: any) => genderRoles.includes(r))
                const foundAge = allRoles.some((r: any) => ageRoles.includes(r))
                const foundRules = allRoles.some((r: any) => r == rulesAccepted)

                const t = "965731323631267912"

                if (foundAge && foundGender && foundRules) {
                    member.roles.add(t)
                } else {
                    member.roles.remove(t)
                }
            })
        })
}
module.exports.help = {
    name: "amongus"
}

module.exports.aliases = ["amogus"]