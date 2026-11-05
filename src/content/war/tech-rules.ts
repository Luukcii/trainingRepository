// The full technical rulebook: every number we have, in tables, with where it came from.
// Source: HAFW Store & Black Market catalog (Hardset Register decisions 33–138) and the economy and
// war tests (rules through decision 169, 5 Nov). Gaps are marked "missing" rather than guessed.
import type { Rulebook } from "./types";

const TIERS = "Town Hall / Castle / Fortress";

export const techRules: Rulebook = {
  title: "Faction War: Full Rulebook",
  subtitle: "Every rule and number, organised for leaders, owners and staff. Tap any underlined term for its definition.",
  asOf: "5 Nov 2026 (Hardset Register through decision 169)",
  sections: [
    {
      id: "scope",
      title: "1. Scope and sources",
      lead: "This book collects the settled rules of the HAFW faction war; the Hardset Register stays the final word.",
      blocks: [
        { type: "p", text: "Built from the [[hardset-register|Hardset Register]] (BC-004 / HAFW-000), the Store and Black Market catalog (decisions 33–138) and the war tests (decisions up to 169)." },
        { type: "callout", tone: "missing", title: "Not in this book yet", text: "Sections marked like this need text straight from the Register. See section 15 for the full list." },
      ],
    },
    {
      id: "setup",
      title: "2. Setup",
      lead: "Three kingdoms, each with a capital, twelve territories and 75,000 Gold, fight for one month.",
      blocks: [
        {
          type: "table",
          head: ["Kingdom", "People", "Capital", "Territories"],
          rows: [
            ["[[svaroth|Svaroth]]", "Knights", "Holy City of Aurelia Sanctum", "Capital + 12"],
            ["[[kogahara|Kōgahara]]", "Samurai", "Jisei no Shiro", "Capital + 12"],
            ["[[valdyruus|Valdyruus]]", "Vikings", "Grand Hall of Valdrheim", "Capital + 12"],
            ["[[neutral|Neutral]]", "—", "[[grimgarth|Grimgarth]], [[xibalba|Xibalba]]", "2"],
          ],
        },
        {
          type: "list",
          items: [
            "Length: one month (30 [[war-day|war days]]).",
            "Starting treasury: 75,000 [[gold|Gold]] per kingdom.",
            "Every territory starts at [[town-hall|Town Hall]].",
            "Kingdom bonus: [[kogahara|Kōgahara's]] Envoys travel at double speed.",
          ],
        },
        {
          type: "table",
          head: ["Resource sites on the map", "Sites"],
          rows: [
            ["[[goldmine|Goldmines]]", "26"],
            ["Stone / Forest ([[stone-lumber|Lumber]])", "17 / 13"],
            ["[[economic-goods|Economic goods]]: Fish 22, Cattle 10, Pelts 10, Iron 11, Furs 7, Salt 6, Whales 5, Herbs 4, Rice 3, Oil 2, Textiles 2, Grain 1, Sugar 1", "84"],
            ["[[luxury-goods|Luxury goods]]: Obsidian 4, Ivory 4, Ruby 3, Jade 3, Incense 3, Copper 2, Dyes 2, Pearls 2, Wine 2, Diamond 1, Emeralds 1, Silk 1", "28"],
          ],
        },
      ],
    },
    {
      id: "roles",
      title: "3. Roles and who may buy what",
      lead: "Leaders run the kingdom, owners run territories, members fight and spend their own Gold.",
      source: "Catalog C2",
      blocks: [
        {
          type: "table",
          head: ["Role", "Powers"],
          rows: [
            ["[[faction-leader|Faction leader]]", "Buys Store troops; spends [[ap|AP]]; match upgrades; names low-tier titles; pledges the capital to Blood of the Land; chooses who sits out for Blood of the Saint; resource discovery on any territory of the kingdom."],
            ["[[territory-owner|Territory owner]]", "Builds and upgrades on own land; sells own Stone and Lumber; sends Envoys; buys Black Market troops, goods, information, Diamond, Sabotage, obstacles; Banner, Roads, Wards on own territory."],
            ["[[member|Member]]", "Daily income; buys contracts, characters for self, bounties; gifts Gold to the kingdom; Gold offerings at shrines; Blood of the Land at 1,125 a day; Faith shop."],
            ["[[mercenary|Mercenary]]", "Hired per slot; claims bounties; Black Market goods and contracts (not information); Blood of the Land at 1,125 a day."],
            ["[[vaelith|Vaelith]]", "Black Market keeper; sets information prices; must accept Blood of the Sacrifice."],
            ["[[pope|Pope]]", "Sets the Faith value of Gold offerings (Vaelith can too)."],
          ],
        },
      ],
    },
    {
      id: "income",
      title: "4. Income and upkeep",
      lead: "Kingdoms earn from resource sites and trade; members earn 50 a day plus game pay.",
      source: "Catalog items N2, C3",
      blocks: [
        {
          type: "table",
          head: ["Source", "Amount"],
          rows: [
            ["Member, daily", "50 Gold"],
            ["Member, per war game played", "+100 Gold (or +200 for a win)"],
            ["New member, on joining", "575 Gold"],
            ["Stone / Lumber sold to the Store", "9 / 8 Gold a unit (Lumber 7.5 rounds to 8)"],
            ["Selling limit", "Each territory sells up to one day of that building's output a day; the Store never runs out"],
            ["[[offering|Offering]] of a sacred good", "One day's output → 100 Faith, once a day"],
          ],
        },
        { type: "p", text: "[[upkeep|Upkeep]] is paid per territory every war day, plus a wealth upkeep on large treasuries. Tests show upkeep takes roughly a quarter to a third of income (more for Kōgahara)." },
        { type: "callout", tone: "missing", text: "Upkeep amounts per tier, the wealth-upkeep rate, [[harvest|Harvest]] and [[tax|Tax]]." },
      ],
    },
    {
      id: "store",
      title: "5. The Store (Gold)",
      lead: `Server shop prices, by tier (${TIERS}). Items marked Trade count toward the Trade victory.`,
      source: "Catalog, decisions 33–138",
      blocks: [
        {
          type: "table",
          head: ["Item", `Price (${TIERS})`, "Who can buy", "Trade"],
          rows: [
            ["[[stone-lumber|Stone and Lumber]]", "Buy: Lumber 15, Stone 18 a unit. Sell back: Lumber 8, Stone 9", "Leaders and owners buy; only a territory's holder sells its own", "No"],
            ["[[build|Buildings and upgrades]]", "Section 3.14 of the Register (e.g. Church 4,000 Gold, 300 Stone, 300 Lumber)", "Owners on their own land; leaders", "No"],
            ["Cancel a build", "50% of what was paid comes back", "Whoever paid", "No"],
            ["[[troops|Troops]], per 100", "1,000 / 2,500 / 5,000", "Leaders only", "No"],
            ["[[mercenary|Mercenary]] hire, per slot", "4,000 / 10,000 / 20,000 × [[reputation|Reputation]] (up to ×2)", "Leaders and owners; capitals from the start, others from Castle", "Yes"],
            ["[[match-upgrade|Match upgrade]], per step", "2,000 / 4,000 / 8,000 / 16,000 / 32,000 up the ladder, ×2.5 / ×5; downgrades half", "Leader", "Yes"],
            ["[[characters|Wu Lin / Outlander character]]", "Rent 1,500 / 3,750 / 7,500 a war day; buy 15,000 / 37,500 / 75,000", "Anyone for themselves; leaders and owners for a named player", "Yes"],
            ["[[bounty|Bounty]]", "Set by the poster; the Store keeps 10%", "Anyone posts; anyone claims", "Yes"],
            ["Send an [[envoy|Envoy]]", "500 / 1,500 / 3,000", "Leaders and owners, no AP; a leader's 1 AP doubles the load", "No"],
            ["[[insurance|Envoy insurance]]", "20% of cargo value; refunds half of what raids take", "Sender", "Yes"],
            ["[[banner|Banner]]", "5,000 / 12,500 / 25,000; free after a capture or transfer", "Owners, once per war per territory", "Yes"],
            ["[[road|Road]] (by road tier)", "3,000 + 200 Stone / 9,000 + 600 / 20,000 + 1,500", "Owners, own land", "Yes"],
            ["[[ward|Ward]]", "15% of the guarded build's Gold cost; blocks Sabotage 24 h", "Owner of the territory with the build", "Yes"],
            ["[[faction-swap|Faction swap]]", "600", "Any member", "No"],
            ["[[resource-discovery|Resource discovery]] (paid to Grape)", "Economic 15,000; Luxury 45,000", "Owners for their land; leaders for any of the kingdom's", "No"],
          ],
        },
      ],
    },
    {
      id: "buildings",
      title: "6. Territories, tiers and buildings",
      lead: "Territories climb Town Hall → Castle → Fortress; several builds can run at once, each taking time.",
      source: "Decisions 54–75, sections 3.13–3.15",
      blocks: [
        {
          type: "list",
          items: [
            "[[tier|Tier]] price multipliers: Castle ×2.5, Fortress ×5. An owner pays by their own territory's tier; a buyer without territory pays by the tier of the territory fought over.",
            "Parallel builds: a territory can run several builds at once (decision 72).",
            "Cancelling refunds 50%.",
            "Known costs: [[church|Church]] 4,000 Gold + 300 Stone + 300 Lumber; [[armory|Armory]] 75,000 Gold; [[monastery|Monastery]] 90,000 Gold.",
            "A [[barracks|Barracks]] is required before a kingdom can ambush.",
            "Tier-three timing (tests): a kingdom that saves for it finishes the Armory in the last third of the month and the Monastery a couple of days later.",
          ],
        },
        { type: "callout", tone: "missing", text: "The full building list and costs (section 3.14), build times (section 3.15), what each building produces, and the Fortress's extra action." },
      ],
    },
    {
      id: "military",
      title: "7. Troops, AP and Attacks",
      lead: "An Attack spends troops and AP on a neighbouring enemy territory and is settled by one war game.",
      source: "Rules through decision 169",
      blocks: [
        {
          type: "list",
          items: [
            "Targets: neighbouring enemy territories, by land or sea link.",
            "One [[war-game|war game]] per [[attack|Attack]]; wins stack and build [[momentum]].",
            "[[aegis|Aegis]] on the target: the next Attack needs one extra win.",
            "[[hachiman-toll|Hachiman's Toll]] on the launching territory: +50% troop cost.",
            "Vikings can [[raid]] by sea from Town Hall.",
            "Captured territory: the Banner is free for the new owner.",
          ],
        },
        { type: "callout", tone: "missing", text: "AP per day, troop cost per Attack, wins needed per capture, the momentum bonus, and what happens to the defender's stored troops." },
      ],
    },
    {
      id: "envoys",
      title: "8. Envoys, ambushes and raids",
      lead: "Envoys move troops and goods over time; enemies with a Barracks can ambush them and take the cargo.",
      source: "Rules through decision 75; catalog",
      blocks: [
        {
          type: "table",
          head: ["Rule", "Value"],
          rows: [
            ["Fee", "500 / 1,500 / 3,000 Gold by tier; no AP"],
            ["Double load", "A leader spends 1 AP"],
            ["Speed", "Kōgahara ×2"],
            ["[[insurance|Insurance]]", "20% of cargo value; refunds half of what raids take"],
            ["[[smuggling|Smuggling]]", "10% of cargo value; no [[grimgarth-alert|Grimgarth alert]]"],
            ["[[ambush|Ambush]]", "Needs a Barracks; one war game; the winner takes the cargo"],
            ["Void Spout", "No Envoy can pass the territory for 12 h"],
            ["Bestial Summon", "Envoys crossing take 50% longer for 48 h"],
            ["[[loki-shroud|Loki's Shroud]]", "Envoys passing set off no Grimgarth alert for 24 h"],
          ],
        },
        { type: "callout", tone: "missing", text: "Travel times, the cargo limit, the full [[raid]] rules, and who receives the Grimgarth alert." },
      ],
    },
    {
      id: "black-market",
      title: "9. The Black Market",
      lead: "Vaelith trades goods at hourly stock-based prices and sells secrets, troops and dirty tricks.",
      source: "Catalog; decisions 36, 60",
      blocks: [
        {
          type: "table",
          head: ["Item", "Price", "Who can buy", "Trade"],
          rows: [
            ["Economic and Luxury goods", "Hourly, following stock; Vaelith charges 50% more than he pays; always 75%–150% of base", "Leaders, owners, Mercenaries", "No"],
            ["Information", "Vaelith's call, in Gold or information", "Leaders and owners", "Yes"],
            ["[[diamond|Diamond]]", "75,000; one in stock; restocks 3 days after a sale", "Leaders and owners", "No (required on its own)"],
            ["[[offering|Offering]]", "That day's sacred good output for 100 Faith", "A territory that produces it, once a day", "No"],
            ["[[smuggling|Smuggling]]", "10% of cargo value", "The Envoy's sender", "Yes"],
            ["[[sabotage|Sabotage]]", "25% of the target build's Gold cost; delays 12 h; once a day per building per kingdom", "Leaders and owners", "Yes"],
            ["[[troops|Troops]], per 100", "2,000 / 5,000 / 10,000 (twice the Store)", "Any territory owner", "No"],
            ["Blood of the Land", "See section 11", "Leaders, owners, Mercenaries, members", "Yes"],
          ],
        },
      ],
    },
    {
      id: "contracts",
      title: "10. Contracts",
      lead: "Eight contracts each bend one war game; all are Trade win services and anyone with Gold can buy them.",
      source: "Catalog; decision 124",
      blocks: [
        {
          type: "table",
          head: ["Contract", "Effect", "Works in", "Town Hall price"],
          rows: [
            ["Barred", "The target kingdom can't play one named hero", "Any mode", "500 / 1,750 / 3,000 by hero tier"],
            ["Shadow", "No two players on the same hero", "Brawl (2v2) and up", "11,250"],
            ["Mirage", "No three on the same hero", "4v4 only", "6,250"],
            ["Squad", "Not all four on the same hero", "4v4 only", "3,750"],
            ["Moral", "Play a hero of the kingdom you're fighting", "Any mode", "1,500 / 1,750 / 2,000 by hero tier"],
            ["Ethical", "Play a Wu Lin or Outlander hero", "Any mode", "1,000 / 1,250 / 1,500 by hero tier"],
            ["Enslaved", "Play a hero of a kingdom you're not fighting", "Any mode", "1,000; 1,500 for high-tier players"],
            ["[[forced-service|Forced Service]]", "Draft a member without territory, or a Mercenary, onto your side", "Any mode", "4,000; 10,000 for high-tier players"],
          ],
        },
        {
          type: "list",
          items: [
            "Prices ×2.5 at a Castle, ×5 at a Fortress (owner's own tier, or the contested territory's for buyers without one).",
            "Contracts cover everyone the target kingdom fields, hired Mercenaries included.",
            "Staff post the [[hero-tier|hero tier list]] each war; high-tier = staff-given role or a chosen champion.",
            "A contract a mode change makes useless is refunded. Bans beat picks; a banned pick is refunded.",
            "Lobby order: bans → hero contracts → map (Blood of the Land) → Forced Service (decision 124).",
          ],
        },
      ],
    },
    {
      id: "pacts",
      title: "11. Blood pacts",
      lead: "Three pacts with Vaelith trade something precious for a rare power; all are Trade win services.",
      source: "Catalog, as of decision 138",
      blocks: [
        {
          type: "table",
          head: ["Pact", "Pledge", "Plus", "Effect", "Limits"],
          rows: [
            ["Blood of the Land", "One territory's Gold for each day pledged, after upkeep (owners: their territory; leaders: their capital; members and Mercenaries: 1,125 a day)", "—", "Choose the map, one game per day pledged, up to 3", "Used within the pledged days"],
            ["Blood of the Sacrifice", "3,000 troops", "A willing member sits out one whole war day", "One tier-2 build or upgrade finishes instantly", "Tier-2 buildings only; once per building; Vaelith must accept"],
            ["Blood of the Saint", "5,000 Faith", "A high-tier player of the leader's choosing sits out 2 days, consent or not", "A 24 h holy truce on one territory, or one automatic win in any war game except the Domination duel", "Once per war per kingdom; never on the capital"],
          ],
        },
      ],
    },
    {
      id: "obstacles",
      title: "12. Territory obstacles",
      lead: "Seven magical obstacles, bought by leaders and owners, priced by the tier of the territory they land on.",
      source: "Catalog",
      blocks: [
        {
          type: "table",
          head: ["Obstacle", "Effect", "Placed on", "Lasts", `Price (${TIERS})`],
          rows: [
            ["Void Spout", "No Envoy can pass through, land or sea", "Any territory", "12 h", "3,000 / 7,500 / 15,000"],
            ["Bestial Summon", "Envoys crossing take 50% longer. In its first 24 h the owner can slay it for 1,000 / 2,500 / 5,000 troops", "Any territory", "48 h", "3,000 / 7,500 / 15,000"],
            ["Plague", "The territory's output is halved", "Enemy land only", "24 h", "10,000 / 25,000 / 50,000"],
            ["[[hachiman-toll|Hachiman's Toll]]", "Attacks launched from it cost 50% more troops", "Enemy land only", "24 h", "4,000 / 10,000 / 20,000"],
            ["[[loki-shroud|Loki's Shroud]]", "Envoys passing don't set off the Grimgarth alert", "Any territory", "24 h", "2,000 / 5,000 / 10,000"],
            ["[[aegis|Aegis]]", "The next Attack on it needs one extra win", "Your own land only", "24 h", "5,000 / 12,500 / 25,000"],
            ["God's Wrath", "Burns 25% of the troops stored there", "Enemy land only", "Instant", "8,000 / 20,000 / 40,000"],
          ],
        },
        {
          type: "list",
          items: [
            "One of each kind on a territory at a time; the same kind can't hit the same territory for 24 h after it ends.",
            "The victim sees the obstacle but not who placed it, unless they buy that from Vaelith.",
            "Every obstacle is a Trade win service.",
          ],
        },
      ],
    },
    {
      id: "faith",
      title: "13. Faith and the Faith shop",
      lead: "Faith comes from sites, offerings and shrines; spending it slows the Faith victory.",
      source: "Catalog",
      blocks: [
        {
          type: "table",
          head: ["Item", "Faith", "Effect"],
          rows: [
            ["Low-tier title", "500", "Cosmetic role; name set by each kingdom's leader"],
            ["High-tier title", "5,000", "Cosmetic role; one holder per kingdom at a time"],
            ["Role colour", "500", "Custom name colour for the rest of the war"],
            ["Relic: Sanctuary", "2,000", "One Faith site can't be [[proselytize|Proselytized]] for 24 h"],
            ["Relic: Absolution", "1,000", "Wipes one day of one territory's upkeep"],
          ],
        },
        { type: "p", text: "[[sacred-good|Sacred goods]]: Incense, Wine, Ivory. Spending Faith counts against the Faith victory and the 500 Faith each holder must keep. Nothing in the Faith shop is a Trade win service." },
        { type: "callout", tone: "missing", text: "Faith per site per day, Proselytize rules, how the Pope is chosen, and how [[fame|Fame]] is earned." },
      ],
    },
    {
      id: "victory",
      title: "14. Victory",
      lead: "Four races run at once; the first to finish wins, otherwise most land on day 30.",
      source: "Final rules, 5 Nov (decision 169)",
      blocks: [
        {
          type: "table",
          head: ["Victory", "Target"],
          rows: [
            ["[[faith-win|Faith]]", "25,000 Faith"],
            ["[[fame-win|Fame]]", "21,000 Fame"],
            ["[[trade-win|Trade]]", "425,000 of Black Market sales, Trade win services included"],
            ["[[domination|Domination]]", "Conquest, with a Domination duel"],
            ["Day 30 fallback", "Most territory"],
          ],
        },
        { type: "p", text: "Each kingdom's own victory type costs it half. In 400 simulated wars with everyone playing balanced, wins split close to evenly three ways (about 34 / 34 / 32); rushing lost for whoever did it." },
        { type: "callout", tone: "missing", text: "Which victory belongs to which kingdom, and what triggers Domination and how long it must be held." },
      ],
    },
    {
      id: "open",
      title: "15. Not in this book yet",
      lead: "These rules exist in the Hardset Register but weren't in the sources this book was built from.",
      blocks: [
        {
          type: "list",
          items: [
            "Building list, costs and build times (sections 3.13–3.15).",
            "Upkeep per tier and the wealth-upkeep rate.",
            "AP per day; troop cost per Attack; wins per capture; momentum bonus; stored troops on capture.",
            "Envoy travel times and cargo limit; raid rules; Grimgarth alert.",
            "Harvest and Tax.",
            "Faith per site; Proselytize; the Pope; Fame sources.",
            "Domination; each kingdom's own victory type.",
            "Reputation; what the Diamond is required for; the Fortress's extra action.",
          ],
        },
        { type: "callout", tone: "tip", text: "Send the Register (or paste the missing sections) and these fill in." },
      ],
    },
  ],
};
