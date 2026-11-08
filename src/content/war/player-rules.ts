// The player rulebook: what a member needs to play, in plain words. Every [[term]] opens a pop-up.
// The full numbers live in tech-rules.ts.
import type { Rulebook } from "./types";

export const playerRules: Rulebook = {
  title: "Faction War: Player's Guide",
  subtitle: "How to play, in plain words. Tap any underlined word to see what it means.",
  asOf: "5 Nov 2026",
  sections: [
    {
      id: "one-minute",
      title: "The war in one minute",
      lead: "Three kingdoms fight for a month. The first to finish a victory race wins; otherwise most land on day 30 wins.",
      blocks: [
        { type: "p", text: "You belong to one of three [[kingdom|kingdoms]]: [[svaroth|Svaroth]] (Knights), [[kogahara|Kōgahara]] (Samurai) or [[valdyruus|Valdyruus]] (Vikings). Together you earn [[gold|Gold]], grow your [[territory|territories]] and take your enemies' land." },
        {
          type: "list",
          ordered: true,
          items: [
            "Earn Gold every [[war-day|war day]] and by playing [[war-game|war games]].",
            "Build up your territories, from [[town-hall|Town Hall]] to [[castle|Castle]] to [[fortress|Fortress]].",
            "Move [[troops]] with [[envoy|Envoys]], and launch [[attack|Attacks]] on enemy land.",
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
        { type: "p", text: "The Vikings hold the frozen north, the Knights the western island and the southern coast, and the Samurai the east. Each kingdom's [[capital]] is marked with a star." },
        { type: "p", text: "[[grimgarth|Grimgarth]] and [[xibalba|Xibalba]] are [[neutral|neutral ground]]. Xibalba is where [[vaelith|Vaelith]] runs the [[black-market|Black Market]]." },
        { type: "callout", tone: "tip", text: "Open the interactive map to see who holds what, every kingdom's numbers, and Envoys and Attacks on the move." },
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
            ["[[member|Member]]", "Play war games, earn Gold, buy contracts and bounties, gift Gold to your kingdom."],
            ["[[territory-owner|Territory owner]]", "Run a territory: build on it, sell its Stone and Lumber, send Envoys, shop at the Black Market."],
            ["[[faction-leader|Faction leader]]", "Run the kingdom: buy troops, spend AP, upgrade matches, name titles."],
            ["[[mercenary|Mercenary]]", "Fight for whoever hires you. Claim bounties and trade at the Black Market."],
            ["[[staff|Staff]]", "Run the war and keep the record."],
          ],
        },
      ],
    },
    {
      id: "gold",
      title: "Your Gold",
      lead: "You earn 50 Gold a day, plus 100 for every war game you play or 200 if you win.",
      blocks: [
        { type: "p", text: "New members get 575 Gold when they join. Spend it on [[contract|contracts]], [[characters|Wu Lin and Outlander characters]] and [[bounty|bounties]], gift it to your kingdom, or offer it at a shrine for [[faith|Faith]]." },
        { type: "p", text: "Switching kingdoms costs 600 Gold ([[faction-swap|faction swap]])." },
      ],
    },
    {
      id: "territories",
      title: "Territories",
      lead: "Territories produce goods every day, cost upkeep, and grow through three tiers.",
      blocks: [
        { type: "p", text: "Every territory starts as a [[town-hall|Town Hall]]. Upgrade it to a [[castle|Castle]], then a [[fortress|Fortress]]. Higher [[tier|tiers]] make most prices 2.5 or 5 times higher, for buyers there." },
        { type: "p", text: "Owners [[build]] on their land with Gold, [[stone-lumber|Stone and Lumber]]. Several builds can run at once. Cancel one and you get half back." },
        { type: "p", text: "Each territory costs [[upkeep]] every day. A kingdom sitting on a pile of Gold pays extra, so spend it." },
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
            "[[goldmine|Goldmines]] make Gold.",
            "Quarries and forests make [[stone-lumber|Stone and Lumber]] for building.",
            "[[economic-goods|Economic goods]] and [[luxury-goods|Luxury goods]] sell at the [[black-market|Black Market]], where prices change every hour.",
          ],
        },
        { type: "p", text: "Pay [[grape|Grape]] to find a new resource site ([[resource-discovery|resource discovery]])." },
      ],
    },
    {
      id: "military",
      title: "Troops, Envoys and Attacks",
      lead: "Ship troops to the front with Envoys, then spend them on Attacks.",
      blocks: [
        { type: "p", text: "[[troops|Troops]] sit on territories. Leaders buy them at the [[store|Store]]; owners can buy them at the Black Market for double." },
        { type: "p", text: "An [[envoy|Envoy]] carries troops or goods between territories. It takes time, and enemies with a [[barracks|Barracks]] can [[ambush]] it. Protect it with [[insurance]], or hide it with [[smuggling|Smuggling]]." },
        { type: "p", text: "An [[attack|Attack]] targets a neighbouring enemy territory. It costs troops and [[ap|AP]], and one [[war-game|war game]] settles it. Winning in a row builds [[momentum]]." },
        { type: "callout", tone: "warn", text: "Enemies can drop [[obstacle|obstacles]] on your land: a [[hachiman-toll|Toll]] makes your Attacks dearer, a Plague halves your output, God's Wrath burns troops." },
      ],
    },
    {
      id: "war-games",
      title: "War games",
      lead: "Every Attack, ambush and duel is settled by a match.",
      blocks: [
        { type: "p", text: "Modes run from Duel (1v1) and Brawl (2v2) up to 4v4. A leader can pay for a [[match-upgrade|match upgrade]]." },
        { type: "p", text: "Before a game: bans first, then hero [[contract|contracts]], then the map, then [[forced-service|Forced Service]]. Staff post the [[hero-tier|hero tier list]] at the start of each war." },
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
            "Buy information: he knows everything in the war.",
            "Buy [[contract|contracts]] that bend a war game, [[obstacle|obstacles]] for the map, and [[sabotage|Sabotage]].",
            "Make a [[blood-pact|blood pact]] if you dare.",
          ],
        },
      ],
    },
    {
      id: "faith-fame",
      title: "Faith and Fame",
      lead: "Faith and Fame are two of the four ways to win.",
      blocks: [
        { type: "p", text: "[[faith|Faith]] comes from [[faith-site|Faith sites]], [[offering|offerings]] of [[sacred-good|sacred goods]], and Gold offered at shrines. Spend it on titles and [[relic|relics]], but spending slows your Faith victory." },
        { type: "p", text: "[[fame|Fame]] is your kingdom's renown." },
      ],
    },
    {
      id: "winning",
      title: "How to win",
      lead: "Finish any victory race first. If nobody does, most land on day 30 wins.",
      blocks: [
        {
          type: "table",
          head: ["Victory", "Goal"],
          rows: [
            ["[[faith-win|Faith]]", "25,000 Faith"],
            ["[[fame-win|Fame]]", "21,000 Fame"],
            ["[[trade-win|Trade]]", "425,000 Gold of Black Market sales and [[trade-service|Trade win services]]"],
            ["[[domination|Domination]]", "Conquest, settled with a Domination duel"],
            ["No winner by day 30", "The kingdom with the most territory"],
          ],
        },
        { type: "p", text: "Each kingdom's own victory type costs it half." },
      ],
    },
  ],
};
