// Everything God says in Discord, in one place, so his voice stays the same everywhere.
// Who he is (Max, 8 Nov): a holy, fatherly figure. Plain words. Gracious, kind and understanding,
// but stern and commanding. He keeps the war's record and speaks with authority, yet he answers to
// the mods: rulings are theirs, and he never decides a dispute himself.
// Rules for new lines: short sentences, no old-fashioned "thee/thou", "child" at most once per reply,
// never mocking. Firm "No." when refusing. Point to the mods for anything he can't settle.

export const god = {
  // Access
  wrongServer: "I answer only in the HAFW server.",
  unknown: "I don't know that command, child. Type `/war` and choose from the list.",
  staffOnly: "No. Only the mods may change the record. If something is wrong, bring it to them.",
  failed: "Something went wrong as I wrote that down. Part of it may be recorded. A mod should check `/warstaff log`.",
  badInput: (what: string) => `"${what}" doesn't look right. Look again, and try once more.`,
  unknownPlace: (name: string) => `I know no territory called "${name}". Check the map, child.`,

  // Joining
  cantReadAccount: "I can't see your Discord account from here. Run the command again inside the server.",
  welcome: (name: string, username: string, password: string, url: string) =>
    [
      `Welcome, ${name}. I have made your account.`,
      ``,
      `Name: **${username}**`,
      `Password: \`${password}\``,
      ``,
      `Go to ${url} and enter them. You may choose your own password there.`,
      `Keep it to yourself. Whoever holds it speaks in your name. Only you can see this message.`,
    ].join("\n"),
  alreadyJoined: (username: string, url: string) =>
    `You already have an account, child. Log in at ${url} as **${username}**.\nLost your password? Type \`/war password\` and I'll give you a new one.`,
  newPassword: (username: string, password: string, url: string) =>
    [
      `Here is your new password, **${username}**:`,
      `\`${password}\``,
      ``,
      `The old one no longer works, and every device logged in as you has been sent out.`,
      `Enter it at ${url}, and choose your own there if you like. Only you can see this message.`,
    ].join("\n"),
  noAccount: "You have no war account yet. Type `/war join` and I'll make one.",

  // Kingdom secrets (fog of war)
  notLinked: (url: string) => `A kingdom's affairs are for its own people. Type \`/war join\`, then swear to a faction at ${url}.`,
  secretNumbers: "Those numbers are not yours to see. Vaelith may sell you what he knows.",
  nothingMoving: "Nothing of yours is on the move.",
  notSetUp: "The war hasn't begun. The mods will start it when the time is right.",
  nothingRecorded: "Nothing is written yet.",
  noRule: (term: string, url: string) => `I have no rule called "${term}". The rulebook is here: ${url}`,
  exampleNote: " (example numbers: the war hasn't begun)",

  // Mods' commands: God announces what the mods decided, and says it's recorded
  warBegins: "⚔️ **The war begins.** Day 1. Every kingdom holds 75,000 Gold and its home territories at Town Hall. Fight with honour. I am watching.",
  alreadyBegun: "The war has already begun. Setup runs only once, so a war in progress can never be wiped.",
  setupFirst: "The war hasn't begun. Run `/warstaff setup` first.",
  newDay: (day: number) => `📅 **Day ${day}** of the war begins. Use it well.`,
  ruling: (text: string, mod: string) => `📜 **Ruling of the mods**, by <@${mod}>:\n> ${text}\n\nSo it is written. This stands until the mods say otherwise.`,
  notInWar: "That kingdom isn't in the war.",
  pickStat: "Pick which number to change.",
  neutralLocked: "Neutral ground isn't yours to change.",
  tellMeWhat: "Tell me what to change: kingdom, tier or troops.",
  which: (thing: string) => `Which ${thing}?`,
  samePlace: "From and to are the same place.",
  pickOutcome: "Pick an outcome.",
  noMovement: (id: string) => `There's no movement with the code \`${id}\`.`,
  recorded: "Recorded.",
};
