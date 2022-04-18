import * as Discord from "discord.js"

export function run(client: Discord.Client, localStorage: any) {
    client.on('raw', async packet => {
        if (!["GUILD_MEMBER_UPDATE"].includes(packet.t)) return

        const allRoles = packet.d.roles

        const genderRoles = ["959564600209186826", "959564519951200356", "959564346088894544"]
        const ageRoles = ["959598600411836446", "959599666494836807", "959599926914990130", "959599995256975430", "959600067487076393", "959600258541813800"]
        const rulesAccepted = "852625657619415050"

        const foundGender = allRoles.some((r: any) => genderRoles.includes(r))
        const foundAge = allRoles.some((r: any) => ageRoles.includes(r))
        const foundRules = allRoles.some((r: any) => r == rulesAccepted)

        const tymek = "965731323631267912"

        const guild = await client.guilds.fetch("849713842551259237")
        const member = await guild.members.fetch(packet.d.user.id)

        if (foundAge && foundGender && foundRules) {
            member.roles.add(tymek)
        } else {
            member.roles.remove(tymek)
        }
    })
}