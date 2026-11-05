// Every term a player might tap. Both rulebooks, the map and the Discord bot read from this one list.
// Facts come from the HAFW Store & Black Market catalog (Hardset Register decisions 33–138) and the
// economy and war tests (decisions up to 169). "missing" marks what the Register itself must still supply.
import type { GlossaryEntry } from "./types";

export const glossary: GlossaryEntry[] = [
  // The war itself
  {
    id: "faction-war",
    term: "Faction war",
    short: "A one-month war between three [[kingdom|kingdoms]] for land, wealth, [[faith|Faith]] and [[fame|Fame]]. It is fought on the map with [[attack|Attacks]] and [[envoy|Envoys]], and settled in [[war-game|war games]].",
  },
  {
    id: "kingdom",
    term: "Kingdom (faction)",
    short: "One of the three sides: [[svaroth|Svaroth]] (Knights), [[kogahara|Kōgahara]] (Samurai) and [[valdyruus|Valdyruus]] (Vikings). Every member belongs to one.",
    more: ["Each kingdom starts with a [[capital]], twelve numbered [[territory|territories]] and 75,000 [[gold|Gold]]. A member can switch with a [[faction-swap|faction swap]]."],
  },
  {
    id: "svaroth",
    term: "Svaroth",
    short: "The Knights. Capital: the Holy City of Aurelia Sanctum, on the western island, plus lands across the southern sea.",
    more: ["Its homeland is an island, so fewer enemies can reach it by land."],
  },
  {
    id: "kogahara",
    term: "Kōgahara",
    short: "The Samurai. Capital: Jisei no Shiro, in the east. Its [[envoy|Envoys]] travel twice as fast as everyone else's.",
    more: ["Kōgahara borders both enemies, so it fights on two fronts. Testing showed it loses ground most often, which is why its Envoys got the speed bonus."],
  },
  {
    id: "valdyruus",
    term: "Valdyruus",
    short: "The Vikings. Capital: the Grand Hall of Valdrheim, in the frozen north.",
    more: ["Vikings can raid by sea even from a [[town-hall|Town Hall]] territory."],
  },
  {
    id: "capital",
    term: "Capital",
    short: "A kingdom's seat, marked with a star on the map. Leaders pledge their capital for [[blood-pact|Blood of the Land]], and it can never be the target of Blood of the Saint's truce.",
    more: ["Capitals can hire [[mercenary|Mercenaries]] from the start; other territories need a [[castle|Castle]] first."],
  },
  {
    id: "territory",
    term: "Territory",
    short: "A numbered region of the map. Each one has a holder, a [[tier]], buildings, [[troops]] and resource sites that produce goods every day.",
    more: ["Territories are taken with [[attack|Attacks]]. Each costs daily [[upkeep]]."],
  },
  {
    id: "tier",
    term: "Tier (Town Hall, Castle, Fortress)",
    short: "How developed a territory is: [[town-hall|Town Hall]] → [[castle|Castle]] → [[fortress|Fortress]]. Most prices are ×2.5 at a Castle and ×5 at a Fortress.",
    more: ["A territory owner pays by their own territory's tier. A buyer with no territory pays by the tier of the territory being fought over."],
  },
  { id: "town-hall", term: "Town Hall", short: "The first [[tier]]. Every territory starts here. Prices are at their base (×1)." },
  {
    id: "castle",
    term: "Castle",
    short: "The second [[tier]]. Prices are ×2.5. From a Castle, any territory can hire [[mercenary|Mercenaries]].",
  },
  { id: "fortress", term: "Fortress", short: "The top [[tier]]. Prices are ×5." },
  {
    id: "neutral",
    term: "Neutral ground",
    short: "Places no kingdom owns: [[grimgarth|Grimgarth]] and [[xibalba|Xibalba]].",
  },
  {
    id: "grimgarth",
    term: "Grimgarth",
    short: "Neutral ground in the middle of the map. It gives its name to the [[grimgarth-alert|Grimgarth alert]].",
  },
  {
    id: "grimgarth-alert",
    term: "Grimgarth alert",
    short: "The warning an [[envoy|Envoy]] normally sets off when it travels. [[smuggling|Smuggling]] and [[loki-shroud|Loki's Shroud]] stop it.",
    missing: "Who receives the alert and what it shows.",
  },
  {
    id: "xibalba",
    term: "Xibalba",
    short: "Neutral ground in the western sea, home of [[vaelith|Vaelith]] and the [[black-market|Black Market]].",
  },
  { id: "war-day", term: "War day", short: "One day of the war. The war lasts a month (30 war days). Income, upkeep and rentals count by war day." },

  // People
  {
    id: "faction-leader",
    term: "Faction leader",
    short: "Runs a kingdom. Buys [[troops]] at the [[store|Store]], spends the kingdom's [[ap|AP]], upgrades matches, and names the kingdom's titles.",
  },
  {
    id: "territory-owner",
    term: "Territory owner",
    short: "A member who holds a [[territory]]. Builds on it, sells its Stone and Lumber, sends [[envoy|Envoys]] and buys from the [[black-market|Black Market]].",
  },
  {
    id: "member",
    term: "Member",
    short: "Anyone in a kingdom. Earns 50 [[gold|Gold]] a day, plus 100 per [[war-game|war game]] played, or 200 per win. New members get 575 Gold on joining.",
    more: ["Members can buy [[contract|contracts]], Store characters and [[bounty|bounties]], gift Gold to their kingdom, or make Gold offerings at shrines for [[faith|Faith]]."],
  },
  {
    id: "mercenary",
    term: "Mercenary",
    short: "A player hired to fight for a kingdom. Hiring costs 4,000 / 10,000 / 20,000 [[gold|Gold]] per slot by [[tier]], times their [[reputation|Reputation]].",
    more: ["Mercenaries may trade at the Black Market (everything except information) and claim [[bounty|bounties]]. [[forced-service|Forced Service]] can draft one."],
  },
  { id: "staff", term: "Staff", short: "The people who run the war: they keep the record, post the [[hero-tier|hero tier list]] and settle disputes." },
  {
    id: "pope",
    term: "Pope",
    short: "Sets how much [[faith|Faith]] a Gold offering at a shrine is worth (Vaelith can too).",
    missing: "How the Pope is chosen and any other powers.",
  },
  {
    id: "vaelith",
    term: "Vaelith",
    short: "Keeper of the [[black-market|Black Market]] at [[xibalba|Xibalba]]. Trades goods, secrets and dirty tricks, and knows everything that happens in the war.",
  },
  {
    id: "grape",
    term: "Grape",
    short: "Who you pay for a [[resource-discovery|resource discovery]].",
  },
  {
    id: "reputation",
    term: "Reputation",
    short: "A [[mercenary|Mercenary's]] standing. It multiplies their hire price, up to ×2.",
    missing: "How Reputation is earned and lost.",
  },

  // Economy
  {
    id: "gold",
    term: "Gold",
    short: "The money of the war. Kingdoms start with 75,000. It comes from goldmines, trade and member income, and pays for almost everything.",
  },
  { id: "goldmine", term: "Goldmine", short: "A resource site that produces [[gold|Gold]] every day. The map has 26." },
  {
    id: "stone-lumber",
    term: "Stone and Lumber",
    short: "Building materials. Buy at the [[store|Store]] for 18 (Stone) and 15 (Lumber) Gold a unit; sell back for 9 and 8.",
    more: [
      "Stone comes from 17 quarry sites, Lumber from 13 forests.",
      "A territory sells at most one day of its own output a day. The Store never runs out.",
    ],
  },
  {
    id: "economic-goods",
    term: "Economic goods",
    short: "Everyday trade goods (Fish, Iron, Cattle, Pelts…), sold at the [[black-market|Black Market]]. The map has 84 sites.",
  },
  {
    id: "luxury-goods",
    term: "Luxury goods",
    short: "Rare goods (Ruby, Jade, Silk, Incense…) that sell for more at the [[black-market|Black Market]]. The map has 28 sites.",
  },
  {
    id: "resource-discovery",
    term: "Resource discovery",
    short: "Pay [[grape|Grape]] to find a new resource site on a territory: 15,000 Gold for an Economic good, 45,000 for a Luxury.",
  },
  {
    id: "upkeep",
    term: "Upkeep",
    short: "What each territory costs to run, paid every [[war-day|war day]]. A rich kingdom also pays a wealth upkeep, so hoarded Gold shrinks.",
    missing: "The upkeep amounts per tier and the wealth-upkeep rate.",
  },
  {
    id: "harvest",
    term: "Harvest",
    short: "An action that gathers a territory's output.",
    missing: "Which territories, how often and its AP cost.",
  },
  {
    id: "tax",
    term: "Tax",
    short: "A charge on a kingdom's members or territory funds.",
    missing: "How often, how much, and whether territory funds are taxed.",
  },
  { id: "store", term: "Store", short: "The server shop. Sells building materials, [[troops]], [[mercenary|Mercenary]] hires, match changes, characters and territory services, in [[gold|Gold]]." },
  {
    id: "black-market",
    term: "Black Market",
    short: "[[vaelith|Vaelith's]] shop at [[xibalba|Xibalba]]. Buys and sells goods at prices that move every hour, and sells secrets, [[contract|contracts]], [[blood-pact|blood pacts]] and [[obstacle|obstacles]].",
    more: ["Prices follow the Market's stock and stay between 75% and 150% of base. Vaelith charges 50% more than he pays."],
  },
  {
    id: "trade-service",
    term: "Trade win service",
    short: "A purchase that counts toward the [[trade-win|Trade victory]]: Mercenary hires, match upgrades, characters, bounties, Envoy insurance, Banners, Roads, Wards, information, Smuggling, Sabotage, Blood of the Land, every contract, pact and obstacle.",
  },
  { id: "bounty", term: "Bounty", short: "A reward anyone posts on a target; anyone, Mercenaries included, can claim it. The Store keeps 10%." },
  { id: "faction-swap", term: "Faction swap", short: "Move to another kingdom for 600 [[gold|Gold]]." },
  {
    id: "diamond",
    term: "Diamond",
    short: "Sold only by [[vaelith|Vaelith]]: 75,000 Gold, one in stock at a time, restocked 3 days after a sale. Needed on its own (it doesn't count as a Trade win service).",
    missing: "What the Diamond is required for.",
  },

  // Buildings
  {
    id: "build",
    term: "Build",
    short: "Constructing or upgrading on a territory. Costs Gold, Stone and Lumber and takes time. A territory can run several builds at once.",
    more: ["Cancel a build and you get back half of what you paid. A [[ward|Ward]] protects a build from [[sabotage|Sabotage]]."],
    missing: "The full building list, costs (section 3.14) and build times (section 3.15).",
  },
  { id: "church", term: "Church", short: "A building. Costs 4,000 Gold, 300 Stone and 300 Lumber." },
  { id: "barracks", term: "Barracks", short: "Military building. A kingdom needs one before it can set an [[ambush]]." },
  { id: "armory", term: "Armory", short: "A tier-three military building, 75,000 Gold. A kingdom that saves for it usually finishes it in the last third of the month." },
  { id: "monastery", term: "Monastery", short: "A tier-three [[faith|Faith]] building, 90,000 Gold. Usually lands a couple of days after an Armory would." },
  { id: "banner", term: "Banner", short: "A territory's flag: 5,000 / 12,500 / 25,000 Gold by tier, once per war per territory. Free after a capture or transfer." },
  { id: "road", term: "Road", short: "Built on your own land by road tier: 3,000 Gold + 200 Stone, 9,000 + 600, or 20,000 + 1,500." },
  { id: "ward", term: "Ward", short: "Guards one [[build]] from [[sabotage|Sabotage]] for 24 hours. Costs 15% of that build's Gold cost." },

  // Military
  {
    id: "troops",
    term: "Troops",
    short: "Soldiers stored on a territory. Spent to launch [[attack|Attacks]] and shipped by [[envoy|Envoy]]. Leaders buy them at the Store: 1,000 / 2,500 / 5,000 Gold per 100 by tier.",
    more: ["Any territory owner can buy them from the Black Market at twice the price."],
  },
  {
    id: "ap",
    term: "AP (Action Points)",
    short: "A kingdom's daily budget of actions. Spent on [[attack|Attacks]], [[harvest|Harvests]] and doubling an [[envoy|Envoy's]] load.",
    missing: "How many AP each kingdom gets per day.",
  },
  {
    id: "attack",
    term: "Attack",
    short: "An attempt to take a neighbouring enemy [[territory]], by land or sea. It costs [[troops]] and [[ap|AP]], and is settled by one [[war-game|war game]].",
    more: ["Wins stack and build [[momentum]]. [[aegis|Aegis]] makes the next Attack need one extra win; [[hachiman-toll|Hachiman's Toll]] makes Attacks from a territory cost 50% more troops."],
    missing: "Troop cost per Attack and how many wins take a territory.",
  },
  {
    id: "momentum",
    term: "Momentum",
    short: "The edge an attacker builds by winning Attacks in a row; wins stack.",
    missing: "The exact momentum bonus.",
  },
  {
    id: "envoy",
    term: "Envoy",
    short: "A convoy carrying [[troops]] or goods from one territory to another. It takes time to travel and can be [[ambush|ambushed]] on the way.",
    more: [
      "Sending one costs 500 / 1,500 / 3,000 Gold by tier and needs no AP. A leader can spend 1 AP to double its load.",
      "Protect it with [[insurance]], hide it with [[smuggling|Smuggling]]. [[kogahara|Kōgahara's]] Envoys travel twice as fast.",
    ],
    missing: "Travel times and the cargo limit.",
  },
  {
    id: "ambush",
    term: "Ambush",
    short: "Intercepting an enemy [[envoy|Envoy]]. Needs a [[barracks|Barracks]]. It's settled by a [[war-game|war game]]; win and you take the cargo.",
  },
  {
    id: "raid",
    term: "Raid",
    short: "A strike that takes goods or troops. [[insurance|Envoy insurance]] refunds half of what a raid takes. Vikings can raid by sea from Town Hall.",
    missing: "The full raid rules: who can raid, what, and the cost.",
  },
  { id: "insurance", term: "Envoy insurance", short: "20% of the cargo's value. Refunds half of what raids take." },
  { id: "smuggling", term: "Smuggling", short: "Pay [[vaelith|Vaelith]] 10% of the cargo's value and your [[envoy|Envoy]] sets off no [[grimgarth-alert|Grimgarth alert]]." },
  { id: "sabotage", term: "Sabotage", short: "Bought from Vaelith: delays an enemy [[build]] by 12 hours for 25% of its Gold cost. Once a day per building per kingdom." },

  // War games
  {
    id: "war-game",
    term: "War game",
    short: "A match that settles an Attack, ambush or duel. Modes run from Duel (1v1) and Brawl (2v2) up to 4v4.",
    more: ["Before a game the lobby runs in order: bans, hero contracts, map choice ([[blood-pact|Blood of the Land]]), then [[forced-service|Forced Service]]. Bans beat picks; a banned pick is refunded."],
  },
  { id: "match-upgrade", term: "Match upgrade", short: "A leader pays to move a war game up the mode ladder: 2,000 / 4,000 / 8,000 / 16,000 / 32,000 per step (×2.5 / ×5 by tier). Downgrades cost half." },
  { id: "hero-tier", term: "Hero tier list", short: "Staff post it at the start of each war. It sets contract prices. A high-tier player is one with the staff-given role or a chosen champion." },
  { id: "characters", term: "Wu Lin and Outlander characters", short: "Heroes outside the three kingdoms. Rent for 1,500 / 3,750 / 7,500 a war day, or buy for 15,000 / 37,500 / 75,000." },
  {
    id: "contract",
    term: "Contract",
    short: "A Black Market deal that bends one [[war-game|war game]] against a kingdom: ban a hero, forbid duplicates, force hero choices, or draft a player.",
    more: ["Anyone with Gold can buy one. A contract a mode change makes useless is refunded."],
  },
  { id: "forced-service", term: "Forced Service", short: "A [[contract]] that drafts a member without territory, or a Mercenary, onto your side for one game. 4,000 Gold; 10,000 for high-tier players." },
  {
    id: "blood-pact",
    term: "Blood pact",
    short: "A deal with Vaelith that trades something precious for a rare power. Three exist: Blood of the Land, of the Sacrifice and of the Saint.",
  },
  {
    id: "obstacle",
    term: "Obstacle",
    short: "Magic placed on a territory for hours: block Envoys, slow them, halve output, raise Attack costs, hide Envoys, shield, or burn troops.",
    more: ["One of each kind per territory at a time. The same kind can't hit the same territory again for 24 h after it ends. The victim sees it but not who placed it, unless they buy that from Vaelith."],
  },
  { id: "aegis", term: "Aegis", short: "An [[obstacle]] on your own land: the next Attack on it needs one extra win. 24 h." },
  { id: "hachiman-toll", term: "Hachiman's Toll", short: "An [[obstacle]] on enemy land: Attacks launched from it cost 50% more troops. 24 h." },
  { id: "loki-shroud", term: "Loki's Shroud", short: "An [[obstacle]]: Envoys passing through don't set off the [[grimgarth-alert|Grimgarth alert]]. 24 h." },

  // Faith and Fame
  {
    id: "faith",
    term: "Faith",
    short: "A kingdom's devotion, earned from [[faith-site|Faith sites]], [[offering|offerings]] and shrines. Reach 25,000 for the [[faith-win|Faith victory]], or spend it on titles and relics.",
    more: ["Spending Faith counts against the Faith victory and against the 500 Faith each holder must keep."],
    missing: "Who counts as a holder for the 500-Faith rule.",
  },
  { id: "faith-site", term: "Faith site", short: "A holy place that produces [[faith|Faith]]. Enemies can [[proselytize]] it; the Sanctuary relic stops that for 24 h." },
  { id: "proselytize", term: "Proselytize", short: "A move against an enemy [[faith-site|Faith site]] to win it over.", missing: "What it costs, how it is settled and what changes hands." },
  { id: "sacred-good", term: "Sacred good", short: "Incense, Wine and Ivory. A territory that produces one can trade that day's output to Vaelith for 100 [[faith|Faith]] ([[offering]])." },
  { id: "offering", term: "Offering", short: "Give Vaelith a day's output of a [[sacred-good|sacred good]] for 100 Faith, once a day per territory. Members can also offer Gold at shrines." },
  { id: "relic", term: "Relic", short: "Bought with Faith. Sanctuary (2,000): one Faith site can't be Proselytized for 24 h. Absolution (1,000): wipes one day of one territory's upkeep." },
  {
    id: "fame",
    term: "Fame",
    short: "A kingdom's renown. Reach 21,000 for the [[fame-win|Fame victory]].",
    missing: "How Fame is earned.",
  },

  // Victory
  {
    id: "victory",
    term: "Victory",
    short: "Four races run at once: [[faith-win|Faith]], [[fame-win|Fame]], [[trade-win|Trade]] and [[domination]]. The first kingdom to finish one wins. If nobody does, the kingdom with the most land on day 30 wins.",
    more: ["Each kingdom's own victory type costs it half."],
    missing: "Which victory type belongs to which kingdom.",
  },
  { id: "faith-win", term: "Faith victory", short: "Hold 25,000 [[faith|Faith]]." },
  { id: "fame-win", term: "Fame victory", short: "Reach 21,000 [[fame|Fame]]." },
  { id: "trade-win", term: "Trade victory", short: "Reach 425,000 Gold of Black Market sales, counting [[trade-service|Trade win services]]." },
  {
    id: "domination",
    term: "Domination",
    short: "The conquest victory, decided in part by a Domination duel.",
    missing: "What triggers Domination and how long it must be held.",
  },
  {
    id: "hardset-register",
    term: "Hardset Register",
    short: "The master list of every rule decision (BC-004 / HAFW-000). These rulebooks are built from it; where they say \"not in this book yet\", the Register has the answer.",
  },
];

const byId = new Map(glossary.map((entry) => [entry.id, entry]));

export function findTerm(id: string): GlossaryEntry | undefined {
  return byId.get(id);
}
