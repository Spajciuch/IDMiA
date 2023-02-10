import * as Discord from "discord.js"
import { database } from "firebase"

module.exports.run = async (client: Discord.Client, message: Discord.Message, args: Array<string>, embedColor: Discord.ColorResolvable, l: any, localStorage: any) => {

    // const channel = message.guild.channels.fetch("957614745928740914")
    const embed = new Discord.EmbedBuilder()
        .setColor("#c34d76")
        .setThumbnail(message.guild.iconURL({ size: 2048, extension: "png" }))
        .setTitle("✨ Prawo w płynie po łacinie")
        .addFields(
            { name: "✨ Praescripta generalia", value: "1. Nieznajomość regulaminu nie zwalnia Cię z obowiązku jego przestrzegania\n2. Banicja to wyrok pozbawiający użytkownika czci i honoru\n3. Skargi, propozycje i odwołania od banów i kar można zgłaszać na forum (patrz - kanał #skargi lub #propozycje)\n4. Zakaz spamu\n5. Zakaz publikowania nieodpowiednich treści na kanałach do tego nie przeznaczonych\n6. Zakazane jest podszywanie się pod zarząd serwera czy innych członków\n7. Rasizm, homofobia i wszelkiego rodzaju mowa nienawiści nie będą tolerowane na tym serwerze\n8. Po wejściu na serwer koniecznym jest wybór jednej i tylko jednej roli informującej o wieku i płci członka.\n9. Rola płci w płynie została stworzona poważnie, aby umożliwić osobom nie wpisującym się w ramy dwóch płci inną opcję, i jej nadużywanie grozi banem.\n10. Kanał pomocy doraźnej nie służy do byle rozmów, wejście na niego sygnalizuje potrzebę pomocy administratora.\n11. Pisanie `n` lub `k` jest zabronione i jest karane wyrzuceniem z serwera" },
            { name: "✨ Privilegiis nobilium", value: "1. Administracja zastrzega sobie prawo do dowolnego modyfikowania regulaminu\n2. Członkowie administracji mogą bez zapowiedzi wchodzić na ograniczone ilościowo kanały\n3. Członkowie administracji mają prawo do wyciszania, przenoszenia, banowania, wyrzucania i usuwania wiadomości innych członków serwera" },
            { name: "✨ Lex populi", value: "1. Każdy użytkownik zobowiązany jest do trzymania się tematu kanału, na którym prowadzi aktywność\n2.Łamanie regulaminu przez innych członków powinno zostać zgłoszone bezpośrednio do administracji\n3.W razie nagłego problemu proszę o wejście na kanał głosowy #doraźna i poczekać na przybycie kogoś z administracji" },
            { name: "✨ Złota zasada", value: "Kochajcie Się " })
        .setTimestamp()
    message.channel.send({ embeds: [embed] })
}

module.exports.help = {
    name: "rt"
}

module.exports.aliases = ["rtest"]