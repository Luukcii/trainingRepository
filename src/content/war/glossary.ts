// Every term a player might tap. Both rulebooks, the map and the Discord bot read from this one list.
// Source: Max's Hardset Register (BC-004 / HAFW-000), every decision through 169 (5 Nov 2026), checked 8 Nov.
// "missing" marks what the Register itself hasn't settled. Never fill one in with a guess.
import type { GlossaryEntry } from "./types";

export const glossary: GlossaryEntry[] = [
  // The war itself
  {
    id: "faction-war",
    term: "Faction war",
    short: "A one-month war between three [[kingdom|kingdoms]] for land, wealth, [[faith|Faith]] and [[fame|Fame]]. It is fought on the map with [[attack|Attacks]] and [[envoy|Envoys]], and settled in [[war-game|war games]] of For Honor.",
    more: ["Every war starts from scratch: nothing carries over except a [[mercenary|Mercenary's]] [[reputation|Reputation]] tier, which drops one step."],
  },
  {
    id: "kingdom",
    term: "Kingdom (faction)",
    short: "One of the three sides: the Crusaders of [[svaroth|Svaroth]], the Samurai of [[kogahara|Kōgahara]] and the Berserkrs of [[valdyruus|Valdyruus]]. Every member belongs to one.",
    more: [
      "Each kingdom starts with a [[capital]], twelve numbered [[territory|territories]] and 75,000 [[gold|Gold]], held by its [[faction-leader|faction leader]].",
      "Each plays only its own heroes: Svaroth the Knights, Kōgahara the Samurai, Valdyruus the Vikings. Players choose their kingdom freely; there are no caps. Switching later is a [[faction-swap|faction swap]].",
    ],
  },
  {
    id: "svaroth",
    term: "Svaroth",
    short: "The Crusaders. Capital: the Holy City of Aurelia Sanctum, on the western island; more land lies along the southern coast.",
    more: [
      "Natural victory: [[faith-win|Faith]]. Faith from deeds counts ×1.25, and each territory Svaroth captures gives its new owner 50 Faith.",
      "Sacred good: Wine. Holy days: Saturday, plus Sunday for Svaroth alone.",
    ],
  },
  {
    id: "kogahara",
    term: "Kōgahara",
    short: "The Samurai. Capital: Jisei no Shiro, in the east. Its [[envoy|Envoys]] travel twice as fast as everyone else's.",
    more: [
      "Natural victory: [[fame-win|Fame]]. Fame from deeds counts ×1.25, and Bushido gives +50 Fame each time Kōgahara holds off an Attack on one of its home territories.",
      "Kōgahara borders both enemies and fights on two fronts. When an Attack on one of its home territories fails, the defender keeps 75% of the attacker's troops (everyone else keeps 25%).",
      "Sacred good: Incense. Festival days: Saturday, plus Friday for Kōgahara alone.",
    ],
  },
  {
    id: "valdyruus",
    term: "Valdyruus",
    short: "The Berserkrs. Capital: the Grand Hall of Valdrheim, in the frozen north.",
    more: [
      "Natural victory: [[trade-win|Trade]]. The north is rich in Fish, Pelts and Furs for the [[black-market|Black Market]].",
      "Vikings cross water from a [[town-hall|Town Hall]]; everyone else needs a [[castle|Castle]] to send Envoys, Attack or Hire across the sea. Sacred good: Ivory.",
    ],
  },
  {
    id: "capital",
    term: "Capital",
    short: "A kingdom's seat, marked with a star on the map. It earns double base Gold (2,250 a day) and pays double [[upkeep]].",
    more: [
      "Capitals can [[hire]] [[mercenary|Mercenaries]] from the start; other territories need a [[castle|Castle]]. If the unpaid upkeep of another territory comes due, the capital covers it.",
      "A capital that is a [[fortress|Fortress]] gives one free [[attack|Attack]], [[ambush|Ambush]] or Construct a day, and lets the leader [[tax|Tax]] and [[harvest|Harvest]] twice a day.",
      "Lose the capital without losing the war and the leader picks a new one from the land you still hold. [[blood-pact|Blood of the Saint]] can never be used on or for a capital.",
    ],
  },
  {
    id: "territory",
    term: "Territory",
    short: "A numbered region of the map. Each has an owner, a [[tier]], buildings, [[troops]] and resource sites. It earns 1,125 [[gold|Gold]] a day before bonuses and pays daily [[upkeep]].",
    more: [
      "Territories are taken by winning [[attack|Attacks]]: 3 wins, or 4 at a [[fortress|Fortress]], then a [[last-stand-duel|Last Stand Duel]] at a Castle or Fortress.",
      "Neighbours are territories whose borders meet on the map; corners count. Leaders give and take territories; inactivity or neglect can get one reassigned.",
    ],
  },
  {
    id: "tier",
    term: "Tier (Town Hall, Castle, Fortress)",
    short: "How developed a territory is: [[town-hall|Town Hall]] → [[castle|Castle]] → [[fortress|Fortress]]. Each tier replaces the last, raises output, and makes services cost ×2.5 (Castle) or ×5 (Fortress).",
    more: [
      "Service prices follow the tier of the territory that pays. Buyers with no territory pay Town Hall prices at the Store; for Black Market contracts they pay by the tier of the territory being fought over.",
      "Tier points multiply Gold and resource output: +2 at a Town Hall, +3 at a Castle, +4 at a Fortress, each point ×1.175. They don't touch troops or Faith.",
    ],
  },
  { id: "town-hall", term: "Town Hall", short: "The first [[tier]] (+2 points). Every territory starts here. Envoys take 24 hours to cross it, and it falls after 3 winning Attacks." },
  {
    id: "castle",
    term: "Castle",
    short: "The second [[tier]] (+3 points). Upgrading costs 12,000 Gold, 900 Stone and 900 Lumber and takes 36 hours.",
    more: ["Builds 25% faster, Envoys cross it in 18 hours, it can [[hire]] [[mercenary|Mercenaries]] and cross water, and its owner gets a [[last-stand-duel|Last Stand Duel]] before it falls. Services cost ×2.5. Upkeep 1,500 a day."],
  },
  {
    id: "fortress",
    term: "Fortress",
    short: "The top [[tier]] (+4 points). Upgrading a Castle costs 25,000 Gold, 1,500 Stone and 1,650 Lumber and takes 2 days.",
    more: [
      "It takes 4 winning Attacks to capture, and the owner picks the mode of that 4th game; then the [[last-stand-duel|Last Stand Duel]].",
      "Builds 50% faster, Envoys cross it in 12 hours, services cost ×5. Upkeep 3,000 a day. A capital Fortress gives the kingdom a free action a day.",
    ],
  },
  {
    id: "neutral",
    term: "Neutral ground",
    short: "Places no kingdom owns: [[grimgarth|Grimgarth]] and [[xibalba|Xibalba]]. They can't be Attacked, and no [[obstacle]] can be placed on them.",
  },
  {
    id: "grimgarth",
    term: "Grimgarth",
    short: "Home of the [[mercenary|Mercenaries]], on the west coast of the mainland between Dyflin, Seiryū and Numashiro. Anyone may pass through freely.",
    more: [
      "An Envoy passing through sets off the [[grimgarth-alert|Grimgarth alert]].",
      "Grimgarth has 1 Goldmine, 1 Stone, 1 Forest and 1 Economic or Luxury resource of the Mercenaries' choosing. Its buildings can't be upgraded, and it doesn't trade with territories.",
    ],
  },
  {
    id: "grimgarth-alert",
    term: "Grimgarth alert",
    short: "When an [[envoy|Envoy]] passes through [[grimgarth|Grimgarth]], the bot tells the Mercenaries in their channel, and they may choose to [[raid]] it.",
    more: ["[[smuggling|Smuggling]] and [[loki-shroud|Loki's Shroud]] stop the alert. Anywhere else, Mercenaries need their own information."],
  },
  {
    id: "xibalba",
    term: "Xibalba",
    short: "A small black island off the coast between Svaroth's lands: home of [[vaelith|Vaelith]] and the [[black-market|Black Market]].",
  },
  {
    id: "war-day",
    term: "War day",
    short: "One day of the war, which lasts 30. Each day resets at midnight UTC (6 PM US Central in winter): AP refills, income and upkeep are paid, and daily limits start over.",
    more: ["The month splits into [[quarter|quarters]]. The war ends at the day-30 reset; games already called may finish."],
  },
  {
    id: "quarter",
    term: "Quarter",
    short: "A quarter of the war: days 1–7, 8–14, 15–21 and 22–30. Anyone who switches kingdoms mid-war plays for the new one from the start of the next quarter.",
    more: ["After days 7, 14 and 21, and at day 30, the bot posts a public reveal for each kingdom: progress on each victory, total Gold, Stone and Lumber combined, and Economic and Luxury goods as one value. Totals only, never which goods."],
  },

  // People
  {
    id: "faction-leader",
    term: "Faction leader",
    short: "Runs a kingdom and spends its [[ap|AP]]: [[attack|Attack]], [[ambush|Ambush]], [[proselytize|Proselytize]], [[tax|Tax]], [[harvest|Harvest]] and Construct are leader-only.",
    more: ["Only leaders buy [[troops]] at the Store and trade troops with other kingdoms. Leaders hand territories to members, can override owners' decisions, and upgrade matches. Leaders are chosen by the server."],
  },
  {
    id: "territory-owner",
    term: "Territory owner",
    short: "A member who holds a [[territory]]. Builds on it, sells its Stone and Lumber, sends [[envoy|Envoys]], [[hire|hires]] Mercenaries, and trades with any territory in any kingdom. Owners have no AP.",
    more: ["Owners buy Black Market troops, goods, information and [[obstacle|obstacles]], and Banners, Roads and Wards for their land. Everything still needs staff approval, and the leader has the last say."],
  },
  {
    id: "member",
    term: "Member",
    short: "Anyone in a kingdom. Earns 50 [[gold|Gold]] a day, plus 100 per [[war-game|war game]] played, or 200 for a win. New members get 575 Gold on joining.",
    more: ["Members spend their own Gold on [[contract|contracts]], Store characters, [[bounty|bounties]], gifts to their owner or leader, and Gold offerings at shrines. They earn [[faith|Faith]] and [[fame|Fame]] through deeds."],
  },
  {
    id: "mercenary",
    term: "Mercenary",
    short: "A player of no kingdom, based at [[grimgarth|Grimgarth]], who fights for whoever [[hire|hires]] them and plays any hero.",
    more: [
      "Hired for duels, Attacks, defences, Ambushes or guarding an Envoy; they keep half the fee. They also [[raid]] Envoys, run [[escort|escorts]] and claim [[bounty|bounties]]. They get 50 Gold a day like members.",
      "They trade only with Grape, the Chief Server Tech and Vaelith, and can buy goods and contracts at the Black Market, but not information or obstacles. The richest Mercenary at day 30 wins the Fortune prize.",
    ],
  },
  { id: "staff", term: "Staff", short: "The people who run the war: Vaelith and the Server Techs. Every trade and action needs their approval; they keep the record, post the [[hero-tier|hero tier list]] and settle disputes." },
  {
    id: "vaelith",
    term: "Vaelith",
    short: "Keeper of the [[black-market|Black Market]] at [[xibalba|Xibalba]], with the final say on fairness. Vaelith knows everything that happens in the war and sells it.",
  },
  { id: "grape", term: "Grape", short: "Who you pay for a [[resource-discovery|resource discovery]]. Mercenaries may trade with Grape." },
  {
    id: "reputation",
    term: "Reputation",
    short: "A [[mercenary|Mercenary's]] standing, which multiplies their hire and escort price: Sellsword ×1, Blade for Hire ×1.25 (5+), Veteran ×1.5 (15+), Legend ×2 (30+).",
    more: [
      "+2 for winning a hired match, −1 for losing one, +1 for a safe escort, a successful raid (+2 for a jackpot), a claimed bounty or an endorsement (one per endorser a day).",
      "A tier once reached is kept for the war. Each new war, every Mercenary drops one tier.",
    ],
  },

  // Economy
  {
    id: "gold",
    term: "Gold",
    short: "The money of the war. Each kingdom starts with 75,000. Territories earn it every day, Goldmines add more, and trade turns goods into it. All amounts are whole numbers.",
    more: ["A territory's Gold a day = (1,125 + 275 per Goldmine) × 1.175 for every tier and Goldmine point. A capital starts from 2,250."],
  },
  {
    id: "goldmine",
    term: "Goldmine",
    short: "A resource building on a Goldmine site: +275 [[gold|Gold]] a day and +2 points. Costs 4,000 Gold, 300 Stone, 300 Lumber; 4 hours. The map has 26 sites.",
    more: ["Upgrade to a Gold Quarry (500 a day, +4 points; 12,000 Gold, 900 Stone, 900 Lumber; 2 days). It replaces the Goldmine on its site."],
  },
  {
    id: "stone-lumber",
    term: "Stone and Lumber",
    short: "Building materials. The [[store|Store]] sells Lumber for 4 and Stone for 5 Gold a unit, and buys them back for 2 and 2.5. It never runs out.",
    more: [
      "Stone comes from 17 sites (Stone Mine 225 a day, Stone Quarry 425), Lumber from 13 forests (Sawmill 350, Lumber Mill 575), before tier points.",
      "Only a territory's owner sells its Stone and Lumber, up to one day of that building's output a day. Players can't trade them with each other; territories and kingdoms can.",
    ],
  },
  {
    id: "economic-goods",
    term: "Economic goods",
    short: "Everyday goods (Fish, Cattle, Iron, Pelts, Furs…), traded only at the [[black-market|Black Market]]. The map has 84 sites.",
    more: ["Each site needs its own building (2,500 Gold, 200 Stone, 200 Lumber) and has one upgrade that triples its output (9,000 Gold, 700 Stone, 700 Lumber; 5 days). Tier points don't apply."],
  },
  {
    id: "luxury-goods",
    term: "Luxury goods",
    short: "Rare goods (Ruby, Jade, Silk, Obsidian…) that sell for more at the [[black-market|Black Market]]. The map has 28 sites.",
    more: ["Built and upgraded like Economic goods. The one Diamond site rolls a d100 each day for a 19,000-Gold diamond."],
  },
  {
    id: "resource-discovery",
    term: "Resource discovery",
    short: "Pay [[grape|Grape]] to find a new resource site: 15,000 Gold for an Economic good, 45,000 for a Luxury. An owner for their own land; a leader for any of the kingdom's.",
  },
  {
    id: "upkeep",
    term: "Upkeep",
    short: "What each territory costs to run, paid in Gold every [[war-day|war day]]: Town Hall 500, Castle 1,500, Fortress 3,000 (a capital pays double), plus each building's own upkeep.",
    more: [
      "If a territory can't pay, the capital pays for it and the territory's output is halved until it pays the capital back. After 3 missed days in a row, the leader may reassign it.",
      "The Absolution relic wipes one day of one territory's upkeep.",
    ],
  },
  {
    id: "harvest",
    term: "Harvest",
    short: "Leader only, 4 [[ap|AP]]: moves half of the whole kingdom's Stone and Lumber income for that day from its territories to the [[capital]]. Once a day, twice with a capital Fortress.",
  },
  {
    id: "tax",
    term: "Tax",
    short: "Leader only, 4 [[ap|AP]]: moves half of the whole kingdom's Gold income for that day from its territories to the [[capital]]. Once a day, twice with a capital Fortress.",
    more: ["Savings are never taxed, so owners can still save for their own upgrades."],
  },
  {
    id: "store",
    term: "Store",
    short: "The server shop. Sells Stone and Lumber, buildings, [[troops]] (leaders only), Mercenary hires, match changes, Wu Lin and Outlander characters, bounties, insurance, Banners, Roads and Wards, in [[gold|Gold]], and the Faith shop in Faith.",
  },
  {
    id: "black-market",
    term: "Black Market",
    short: "[[vaelith|Vaelith's]] market at [[xibalba|Xibalba]]. The only place to trade Economic and Luxury goods, at prices that move every hour, plus secrets, [[contract|contracts]], [[blood-pact|blood pacts]] and [[obstacle|obstacles]].",
    more: [
      "Prices follow the Market's own stock and stay between 75% and 150% of base. Vaelith charges 17% more than he pays. Big sales slide: each unit is paid at a slightly worse price, so a dump fetches less than steady selling. Sold out means sold out.",
      "Any territory can also buy troops here, at twice the Store price.",
    ],
  },
  {
    id: "trade-service",
    term: "Trade win service",
    short: "A purchase that counts toward the [[trade-win|Trade victory]]. Store: hires, match changes, characters, bounties, Envoy insurance, Banners, Roads, Wards. Black Market: information, Smuggling, Sabotage, contracts, blood pacts, obstacles.",
    more: ["Don't count: buying or selling goods, buildings, troops, the Faith shop, faction swaps, resource discovery, the Offering and the Diamond."],
  },
  { id: "bounty", term: "Bounty", short: "A reward anyone with Gold posts on a target; anyone, Mercenaries included, can claim it. The Store keeps 10%." },
  {
    id: "faction-swap",
    term: "Faction swap",
    short: "Move to another kingdom for 600 [[gold|Gold]]. You play for the new kingdom from the start of the next [[quarter]].",
    more: ["A territory owner who switches leaves the territory with the old kingdom."],
  },
  {
    id: "diamond",
    term: "Diamond",
    short: "Needed for the [[trade-win|Trade victory]]. The Black Market always holds one: 75,000 Gold, restocked 3 days after it sells. Leaders and territory owners can buy it.",
  },
  {
    id: "hire",
    term: "Hire",
    short: "Pay a [[mercenary|Mercenary]] to fill a slot in a duel, Attack, defence or Ambush: 4,000 / 10,000 / 20,000 Gold by the hiring territory's tier, times their [[reputation|Reputation]]. No AP.",
    more: ["The Mercenary keeps half; the Store takes half. Capitals can hire from the start, other territories from a Castle. If a match upgrade adds slots the Mercenary can't fill, the match is played as is."],
  },

  // Buildings
  {
    id: "build",
    term: "Build",
    short: "Constructing or upgrading on a territory. Costs Gold, Stone and Lumber and takes real time; Castles build 25% faster, Fortresses 50%. A territory can run several builds at once.",
    more: ["Cancel a build any time and whoever paid gets half back. The leader's Construct (2 AP) halves a build's time. A [[ward|Ward]] protects a build from [[sabotage|Sabotage]]."],
  },
  {
    id: "church",
    term: "Church (Shaman's Hut, Shrine)",
    short: "Tier-one [[faith-site|Faith building]]: 4,000 Gold, 300 Stone, 300 Lumber; 1 day. Gives its builder 150 Faith and sets the kingdom's Faith multiplier to ×1.",
  },
  {
    id: "cathedral",
    term: "Cathedral (Citadel, Ritual Site, Temple)",
    short: "Tier-two [[faith-site|Faith building]]: 18,000 Gold, 1,350 Stone, 1,350 Lumber; 3 days. Gives its builder 400 Faith and doubles all the kingdom's Faith (×2).",
  },
  {
    id: "monastery",
    term: "Monastery",
    short: "Tier-three [[faith-site|Faith building]]: 90,000 Gold, 6,750 Stone, 6,750 Lumber; 3 days. Gives its builder 1,000 Faith and multiplies all the kingdom's Faith ×4. Not required for the Faith victory.",
  },
  {
    id: "guild-hall",
    term: "Guild Hall",
    short: "Tier-one troop building: 5,000 Gold, 400 Stone, 400 Lumber; 8 hours. Comes with 250 [[troops]], makes 100 a day, and unlocks [[attack|Attacks]].",
  },
  {
    id: "barracks",
    term: "Barracks",
    short: "Tier-two troop building: 22,000 Gold, 1,650 Stone, 1,650 Lumber; 3 days. Makes 200 [[troops]] a day and unlocks [[ambush|Ambushes]]. Envoys don't need one.",
  },
  {
    id: "armory",
    term: "Armory",
    short: "Tier-three troop building: 75,000 Gold, 5,600 Stone, 5,600 Lumber; 4 days. Makes 400 [[troops]] a day.",
  },
  { id: "banner", term: "Banner", short: "Rename a territory and give it your own flag: 5,000 / 12,500 / 25,000 Gold by tier, once per war per territory, staff approve. Free after a capture or transfer." },
  { id: "road", term: "Road", short: "Speeds every Envoy through your territory: dirt −5% (3,000 Gold + 200 Stone), paved −10% (9,000 + 600), royal highway −15% (20,000 + 1,500). Captured land keeps its roads." },
  { id: "ward", term: "Ward", short: "Guards one [[build]] from [[sabotage|Sabotage]] for 24 hours, for 15% of that build's Gold cost. Bought by the owner of the territory with the build." },

  // Military
  {
    id: "troops",
    term: "Troops",
    short: "A resource kept on each territory and spent on [[attack|Attacks]], [[ambush|Ambushes]] and [[proselytize|Proselytize]]. Made by troop buildings (100 / 200 / 400 a day) or bought.",
    more: [
      "Leaders buy at the Store: 1,000 / 2,500 / 5,000 Gold per 100, by the tier of the territory receiving them. Any territory can buy at the Black Market for double.",
      "Troops only cross between kingdoms leader to leader; inside a kingdom they move by [[envoy|Envoy]].",
    ],
  },
  {
    id: "ap",
    term: "AP (Action Points)",
    short: "A kingdom's actions: 4 a day, up to 12 saved. Only the leader spends them.",
    more: ["Attack 1 (free after a win on the same territory that day), Ambush 1, Construct 2, Proselytize 2, Tax 4, Harvest 4, doubling an Envoy's load 1. Envoys and Hire cost no AP. AP earned while full is lost."],
  },
  {
    id: "attack",
    term: "Attack",
    short: "Leader only: one [[war-game|war game]] (a Skirmish unless changed) against a neighbouring enemy [[territory]]. Costs 1 [[ap|AP]] plus troops: 500, 750, 1,000 and 1,500 for the day's 1st to 4th.",
    more: [
      "Each win adds to your kingdom's count on that territory and never resets: 3 wins take it, 4 at a Fortress, then the [[last-stand-duel|Last Stand Duel]] at a Castle or Fortress. A win that doesn't capture returns half the troops; the capture also takes 15% of the troops stored there.",
      "A loss loses the troops spent (the defender keeps 25%, or 75% on a Samurai home territory) and locks you out of that territory for 24 hours. Wins bring [[momentum]].",
    ],
  },
  {
    id: "momentum",
    term: "Momentum",
    short: "After a winning [[attack|Attack]], the next Attack on the same territory that day costs no AP. Troops are still paid. The streak ends at the first loss.",
  },
  {
    id: "last-stand-duel",
    term: "Last Stand Duel",
    short: "When an attacker has the wins to take a [[castle|Castle]] or [[fortress|Fortress]], its owner duels the attacking kingdom's champion. Win, and the attacker drops back one win; lose, and the territory falls.",
    more: ["The owner can do this any number of times. If either side can't make it, the duel is rescheduled within 48 hours."],
  },
  {
    id: "envoy",
    term: "Envoy",
    short: "A convoy carrying [[troops]], Stone, Lumber, goods or Gold to any territory. No AP: 500 / 1,500 / 3,000 Gold by the sending territory's tier.",
    more: [
      "Travel: each territory crossed adds 24 hours at a Town Hall, 18 at a Castle, 12 at a Fortress, less with [[road|roads]]; a sea crossing counts as one territory. [[kogahara|Kōgahara's]] Envoys take half the time.",
      "Cargo by tier: troops 1,000–2,000 / 750–7,500 / 500–12,500; Stone and Lumber 2,000–4,000 / 1,500–15,000 / 1,000–25,000; goods up to 7,500 / 37,500 / 112,500 Gold of value; Gold without limit. A leader's 1 AP doubles the maximum for an Envoy leaving the capital.",
      "Enemies who learn where it is can [[ambush]] it; Mercenaries can [[raid]] it. Protect it with an [[escort]] or [[insurance]], hide it with [[smuggling|Smuggling]].",
    ],
  },
  {
    id: "ambush",
    term: "Ambush",
    short: "Leader only, needs a [[barracks|Barracks]]: one Skirmish against an enemy [[envoy|Envoy]] anywhere on its route. Costs 1 AP and 250 troops, with no momentum.",
    more: ["Two winning Ambushes fell the Envoy and take its troops and goods; each win also takes half its Gold. A lost Ambush locks you out of that Envoy for 12 hours. Finding the Envoy is up to your own information."],
  },
  {
    id: "raid",
    term: "Raid",
    short: "Mercenaries' attack on any [[envoy|Envoy]], anywhere, as often as they like. Won like an Ambush, with two games: Brawls, or Skirmishes for a party of 4.",
    more: ["Each successful raid takes 15% of what's left of the cargo; a d100 roll of 7 or under takes 65% instead. Loot becomes Gold at the Store's buy-back price, split among the raiders. Escorted Envoys can't be raided."],
  },
  {
    id: "escort",
    term: "Escort",
    short: "Hire a squad of 4 [[mercenary|Mercenaries]] to guard an [[envoy|Envoy]]: it becomes safe from Ambushes and raids. 2,000 / 5,000 / 10,000 Gold per day of travel by tier, times the lead's Reputation.",
    more: ["The squad gets 75% and the Store 25%. The squad can't be hired for anything else until the Envoy arrives."],
  },
  { id: "insurance", term: "Envoy insurance", short: "20% of the cargo's value. Covers Mercenary [[raid|raids]] only, not Ambushes: refunds half of what raids take, in Gold." },
  { id: "smuggling", term: "Smuggling", short: "Pay [[vaelith|Vaelith]] 10% of the cargo's value and your [[envoy|Envoy]] sets off no [[grimgarth-alert|Grimgarth alert]]. It hides the Envoy but doesn't protect it." },
  { id: "sabotage", term: "Sabotage", short: "Bought from Vaelith by leaders and owners: delays an enemy [[build]] by 12 hours for 25% of its Gold cost. Once a day per building per kingdom; a [[ward|Ward]] blocks it. The victim sees the delay, not who caused it." },
  {
    id: "proselytize",
    term: "Proselytize",
    short: "Leader only: a Tribute match against a neighbouring enemy [[faith-site|Faith building]]. Costs 2 AP and half an Attack's troops; at most 5 a day. A win moves 1,000 [[faith|Faith]] from their kingdom to yours.",
    more: ["A loss locks you out of that site for 24 hours. Holding one off earns the defender 100 Faith. The Sanctuary relic protects a site for 24 hours."],
  },

  // War games
  {
    id: "war-game",
    term: "War game",
    short: "A For Honor match that settles an Attack, Ambush, raid or duel. Modes climb Duel → Brawl → Skirmish → Elimination → Dominion → Breach.",
    more: [
      "Attacks and Ambushes are Skirmishes unless upgraded; raids are Brawls. A game must start within 30 minutes of being called; a side with nobody there forfeits. One player is enough to play it short-handed.",
      "Lobby order: bans, hero contracts, map, then [[forced-service|Forced Service]]. The defender picks the map unless someone holds Blood of the Land. Each side picks its lineup by majority vote. Players from the third kingdom may join either side.",
    ],
  },
  { id: "match-upgrade", term: "Match upgrade", short: "A leader pays to move a war game up the mode ladder: 2,000 / 4,000 / 8,000 / 16,000 / 32,000 per step at a Town Hall (×2.5 / ×5 by tier). Downgrades cost half." },
  { id: "hero-tier", term: "Hero tier list", short: "Staff post it at the start of each war, in three bands, to price hero contracts. A high-tier player is one with the staff-given role or a chosen champion." },
  { id: "characters", term: "Wu Lin and Outlander characters", short: "The only heroes the Store rents or sells, for a named player: rent 1,500 / 3,750 / 7,500 a war day, or buy for the war at 15,000 / 37,500 / 75,000." },
  {
    id: "contract",
    term: "Contract",
    short: "A Black Market deal that bends one [[war-game|war game]]: ban a hero, limit duplicates, play a hero from outside your pool, or draft a player.",
    more: ["Anyone with Gold can buy one, only for a game whose mode it fits. If a mode change makes it useless, or the game is forfeited, the Gold comes back. Bans cover everyone a side fields."],
  },
  { id: "forced-service", term: "Forced Service", short: "A [[contract]] that drafts a player without territory, from any kingdom, or a Mercenary, onto your side for one game: 4,000 Gold, 10,000 for high-tier players. They play their own heroes and may not throw." },
  {
    id: "blood-pact",
    term: "Blood pact",
    short: "A deal with Vaelith that trades something precious for a rare power: Blood of the Land (choose the map), of the Sacrifice (finish a tier-2 build instantly) or of the Saint (a truce or an automatic win).",
  },
  {
    id: "obstacle",
    term: "Obstacle",
    short: "Magic placed on a territory by leaders and owners: block or slow Envoys, halve output, raise Attack costs, hide Envoys, shield, or burn troops. Priced by the tier of the land it lands on.",
    more: ["One of each kind per territory at a time, and the same kind can't hit it again for 24 hours after it ends. Never on neutral ground. The victim sees it but not who placed it, unless they buy that from Vaelith."],
  },
  { id: "aegis", term: "Aegis", short: "An [[obstacle]] on your own land: for 24 hours, taking it needs one extra win (2 of 3 becomes 2 of 4). 5,000 / 12,500 / 25,000 Gold." },
  { id: "hachiman-toll", term: "Hachiman's Toll", short: "An [[obstacle]] on enemy land: for 24 hours, Attacks launched from it cost 50% more troops. 4,000 / 10,000 / 20,000 Gold." },
  { id: "loki-shroud", term: "Loki's Shroud", short: "An [[obstacle]]: for 24 hours, Envoys passing through set off no [[grimgarth-alert|Grimgarth alert]]. 2,000 / 5,000 / 10,000 Gold." },

  // Faith and Fame
  {
    id: "faith",
    term: "Faith",
    short: "A kingdom's devotion, earned by members' deeds (prayers, bumps, boosts, helping others), Faith buildings, [[offering|offerings]] and [[proselytize|Proselytize]] wins.",
    more: [
      "The kingdom's best Faith building multiplies all its Faith: ×1, ×2 or ×4. Faith counts double on holy days in the second and last weeks of the month.",
      "Faith can't be traded. It goes to the leader for the [[faith-win|Faith victory]], or is spent in the Faith shop or on Blood of the Saint, which counts against the victory.",
    ],
  },
  {
    id: "faith-site",
    term: "Faith building",
    short: "A [[church|Church]], [[cathedral|Cathedral]] or [[monastery|Monastery]] (or their other names). Building one pays Faith once; the kingdom's best one multiplies all its Faith.",
    more: ["Enemies can [[proselytize]] a Faith building; the Sanctuary relic stops that for 24 hours."],
  },
  { id: "sacred-good", term: "Sacred good", short: "Each kingdom's holy good: Wine for the Crusaders, Incense for the Samurai, Ivory for the Berserkrs. A territory that produces it can make an [[offering]]." },
  { id: "offering", term: "Offering", short: "Give Vaelith a day's output of your kingdom's [[sacred-good|sacred good]] for 100 Faith, once a day per territory. Members can also offer Gold at shrines; Vaelith decides its Faith." },
  { id: "relic", term: "Relic", short: "Bought with Faith. Sanctuary (2,000): one Faith building can't be Proselytized for 24 hours. Absolution (1,000): wipes one day of one territory's upkeep." },
  {
    id: "fame",
    term: "Fame",
    short: "A kingdom's renown, earned by members promoting the server: reels, edits, promos, events, recruits, contests, art and duels. Fame can't be spent or lost.",
    more: ["Fame counts double on Festival days in the second and last weeks of the month. At most 3 content posts a day count."],
  },

  // Victory
  {
    id: "victory",
    term: "Victory",
    short: "Four races run at once: [[faith-win|Faith]], [[fame-win|Fame]], [[trade-win|Trade]] and [[domination|Domination]]. The first kingdom to finish one wins the whole war.",
    more: [
      "Each kingdom's natural victory costs it half the lump sum: Faith for Svaroth, Fame for Kōgahara, Trade for Valdyruus.",
      "If nobody finishes by day 30, the kingdom holding the most territory wins; a tie goes to whoever is furthest along its best victory. Alliances can't share a win. The winners get a Victor role until the next war ends.",
    ],
  },
  {
    id: "faith-win",
    term: "Faith victory",
    short: "Reach the Faith target (11,000 + 700 per active member; 25,000 with 20), every territory owner and the leader hold 500+ Faith, and pay 300,000 Gold (Svaroth 150,000).",
  },
  {
    id: "fame-win",
    term: "Fame victory",
    short: "Reach the Fame target (9,000 + 600 per active member; 21,000 with 20), post 15 pieces of public content, every territory owner hosts or joins an event with 4+ non-owners, and pay 125,000 Gold (Kōgahara 62,500).",
  },
  {
    id: "trade-win",
    term: "Trade victory",
    short: "Make 425,000 Gold of Black Market sales, trade every Economic and Luxury good at least once, buy one Store and one Black Market [[trade-service|service]], own a [[diamond|Diamond]], and pay 500,000 Gold (Valdyruus 250,000).",
  },
  {
    id: "domination",
    term: "Domination victory",
    short: "Take a rival kingdom's capital and 3 of its territories, pay 200,000 Gold, and win the [[domination-duel|Domination duel]]. Breaking one rival wins the whole war.",
  },
  {
    id: "domination-duel",
    term: "Domination duel",
    short: "The final duel of a [[domination|Domination victory]]: leader against leader, or a second or champion either leader elects. Held within 48 hours of the request, at a time the defender picks; a no-show forfeits.",
  },
  {
    id: "hardset-register",
    term: "Hardset Register",
    short: "Max's master record of every rule decision (BC-004 / HAFW-000). These rulebooks are built from it; if they ever disagree, the Register wins.",
  },
];

const byId = new Map(glossary.map((entry) => [entry.id, entry]));

export function findTerm(id: string): GlossaryEntry | undefined {
  return byId.get(id);
}
