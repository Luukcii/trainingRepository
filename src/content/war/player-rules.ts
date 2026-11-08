// The player rulebook: what a member needs to play, in plain words. Every [[term]] opens a pop-up.
// The full numbers live in tech-rules.ts. Source: the Hardset Register through decision 169, checked 8 Nov 2026.
import type { Rulebook } from "./types";

export const playerRules: Rulebook = {
  title: "Faction War: Player's Guide",
  subtitle: "How to play, in plain words. Tap any underlined word to see what it means.",
  asOf: "8 Nov 2026",
  sections: [
    {
      id: "one-minute",
      title: "The war in one minute",
      lead: "Three kingdoms fight for a month. The first to finish a victory wins; otherwise most land on day 30 wins.",
      blocks: [
        { type: "p", text: "You belong to one of three [[kingdom|kingdoms]]: the Crusaders of [[svaroth|Svaroth]], the Samurai of [[kogahara|Kōgahara]] or the Berserkrs of [[valdyruus|Valdyruus]]. Together you earn [[gold|Gold]], grow your [[territory|territories]] and take your enemies' land." },
        {
          type: "list",
          ordered: true,
          items: [
            "Earn Gold every [[war-day|war day]] and by playing [[war-game|war games]].",
            "Build up your territories, from [[town-hall|Town Hall]] to [[castle|Castle]] to [[fortress|Fortress]].",
            "Move [[troops]] and goods with [[envoy|Envoys]], and win [[attack|Attacks]] on enemy land.",
            "Race for one of four [[victory|victories]]: [[faith-win|Faith]], [[fame-win|Fame]], [[trade-win|Trade]] or [[domination|Domination]].",
          ],
        },
      ],
    },
    {
      id: "map",
      title: "The map",
      lead: "Each kingdom holds a capital and twelve numbered territories; two neutral places sit between them.",
      blocks: [
        { type: "p", text: "The Berserkrs hold the frozen north, the Crusaders the western island and the southern coast, and the Samurai the east. Each kingdom's [[capital]] is marked with a star." },
        { type: "p", text: "[[grimgarth|Grimgarth]], home of the [[mercenary|Mercenaries]], and [[xibalba|Xibalba]], where [[vaelith|Vaelith]] runs the [[black-market|Black Market]], are [[neutral|neutral ground]]." },
        { type: "callout", tone: "tip", text: "Open the war map to see who holds what. Log in to see your own kingdom's numbers, territories and Envoys; other kingdoms' stay secret." },
      ],
    },
    {
      id: "roles",
      title: "Who you are",
      lead: "Your role decides what you can buy and do.",
      blocks: [
        {
          type: "table",
          head: ["Role", "What you do"],
          rows: [
            ["[[member|Member]]", "Play war games, earn Gold, Faith and Fame, buy contracts and bounties, gift Gold to your kingdom."],
            ["[[territory-owner|Territory owner]]", "Run a territory: build on it, sell its Stone and Lumber, send Envoys, hire Mercenaries, trade with any territory."],
            ["[[faction-leader|Faction leader]]", "Run the kingdom: spend AP on Attacks, Ambushes, Tax and Harvest, buy troops, hand out territories."],
            ["[[mercenary|Mercenary]]", "Fight for whoever hires you, raid Envoys, escort them, claim bounties."],
            ["[[staff|Staff]]", "Run the war, approve every trade and action, keep the record."],
          ],
        },
      ],
    },
    {
      id: "gold",
      title: "Your Gold",
      lead: "You earn 50 Gold a day, plus 100 for every war game you play, or 200 if you win.",
      blocks: [
        { type: "p", text: "New members get 575 Gold when they join. Spend it on [[contract|contracts]], [[characters|Wu Lin and Outlander characters]] and [[bounty|bounties]], gift it to your territory owner or leader, or offer it at a shrine for [[faith|Faith]]." },
        { type: "p", text: "Switching kingdoms costs 600 Gold ([[faction-swap|faction swap]]), and you play for the new one from the next [[quarter]]." },
      ],
    },
    {
      id: "territories",
      title: "Territories",
      lead: "Territories earn Gold every day, cost upkeep, and grow through three tiers.",
      blocks: [
        { type: "p", text: "Every territory starts as a [[town-hall|Town Hall]] earning about 1,550 Gold a day. Upgrade it to a [[castle|Castle]], then a [[fortress|Fortress]]: each tier earns more, builds faster and is harder to take, but services there cost 2.5 or 5 times as much." },
        { type: "p", text: "Owners [[build]] with Gold, [[stone-lumber|Stone and Lumber]]: [[goldmine|Goldmines]], quarries, mills, resource buildings, troop and [[faith-site|Faith buildings]]. Several builds can run at once; cancel one and you get half back." },
        { type: "p", text: "Each territory pays [[upkeep]] every day. If it can't, the capital pays and its output is halved until it pays the capital back." },
      ],
    },
    {
      id: "resources",
      title: "Resources and trade",
      lead: "Resource sites make goods every day; sell them to grow your Gold.",
      blocks: [
        {
          type: "list",
          items: [
            "[[goldmine|Goldmines]] add Gold to their territory's daily income.",
            "Quarries and forests make [[stone-lumber|Stone and Lumber]] for building; the Store buys and sells them at fixed prices.",
            "[[economic-goods|Economic goods]] and [[luxury-goods|Luxury goods]] trade only at the [[black-market|Black Market]], where prices change every hour.",
          ],
        },
        { type: "p", text: "Any territory can trade with any territory, in any kingdom; the goods travel by Envoy. Pay [[grape|Grape]] to find a new resource site ([[resource-discovery|resource discovery]])." },
      ],
    },
    {
      id: "military",
      title: "Troops, Envoys and Attacks",
      lead: "Ship troops to the front with Envoys, then spend them on Attacks.",
      blocks: [
        { type: "p", text: "[[troops|Troops]] are kept on territories. A [[guild-hall|Guild Hall]] makes them; leaders buy more at the [[store|Store]], and any territory can buy them at the Black Market for double." },
        { type: "p", text: "An [[envoy|Envoy]] carries troops, goods or Gold to any territory. It takes real time, and enemies who find it can [[ambush]] it; Mercenaries can [[raid]] it. Guard it with an [[escort]], insure it against raids, or hide it with [[smuggling|Smuggling]]." },
        { type: "p", text: "An [[attack|Attack]] is one war game against a neighbouring enemy territory, costing troops and [[ap|AP]]. Three wins take a territory (four at a Fortress); at a Castle or Fortress the owner then gets a [[last-stand-duel|Last Stand Duel]]. Winning brings [[momentum]]." },
        { type: "callout", tone: "warn", text: "Enemies can drop [[obstacle|obstacles]] on your land: a [[hachiman-toll|Hachiman's Toll]] makes your Attacks cost more troops, a Plague halves your output, God's Wrath burns your troops." },
      ],
    },
    {
      id: "war-games",
      title: "War games",
      lead: "Every Attack, Ambush, raid and duel is settled by a For Honor match.",
      blocks: [
        { type: "p", text: "Modes climb Duel → Brawl → Skirmish → Elimination → Dominion → Breach. Attacks and Ambushes are Skirmishes unless a leader buys a [[match-upgrade|match upgrade]] or downgrade." },
        { type: "p", text: "A game must start within 30 minutes of being called. Each kingdom plays its own heroes; [[contract|contracts]] change that. Lobby order: bans, hero contracts, the map, then [[forced-service|Forced Service]]. Staff post the [[hero-tier|hero tier list]] at the start of each war." },
      ],
    },
    {
      id: "black-market",
      title: "The Black Market",
      lead: "Vaelith sells goods, secrets and dirty tricks at Xibalba.",
      blocks: [
        {
          type: "list",
          items: [
            "Trade goods at prices that rise and fall with his stock.",
            "Buy information, or trade yours: he knows everything in the war.",
            "Buy [[contract|contracts]] that bend a war game, [[obstacle|obstacles]] for the map, and [[sabotage|Sabotage]].",
            "Make a [[blood-pact|blood pact]] if you dare.",
          ],
        },
      ],
    },
    {
      id: "faith-fame",
      title: "Faith and Fame",
      lead: "Faith and Fame are two of the four ways to win, and both come mostly from what members do.",
      blocks: [
        { type: "p", text: "[[faith|Faith]] comes from prayers, bumping and boosting the server, helping others, [[faith-site|Faith buildings]] and [[offering|offerings]] of your [[sacred-good|sacred good]]. Spend it on titles and [[relic|relics]], but spending slows your Faith victory." },
        { type: "p", text: "[[fame|Fame]] comes from promoting the server: reels, edits, events, recruits, contests, art and duels. It can't be spent or lost." },
      ],
    },
    {
      id: "winning",
      title: "How to win",
      lead: "Finish any victory first. If nobody does, most land on day 30 wins.",
      blocks: [
        {
          type: "table",
          head: ["Victory", "Goal (with 20 active members)"],
          rows: [
            ["[[faith-win|Faith]]", "25,000 Faith, 500 for every owner and the leader, and 300,000 Gold"],
            ["[[fame-win|Fame]]", "21,000 Fame, 15 public posts, an event per owner, and 125,000 Gold"],
            ["[[trade-win|Trade]]", "425,000 Gold of Black Market sales, every good traded, two services, a Diamond, and 500,000 Gold"],
            ["[[domination|Domination]]", "A rival's capital and 3 of its territories, 200,000 Gold, and the Domination duel"],
            ["No winner by day 30", "The kingdom with the most territory"],
          ],
        },
        { type: "p", text: "Each kingdom's natural victory costs it half the Gold: Faith for Svaroth, Fame for Kōgahara, Trade for Valdyruus. Bigger kingdoms have higher Faith and Fame targets." },
      ],
    },
  ],
};
