// Everything God says in Discord, in one place, so his voice stays the same everywhere.
// Who he is (Max, 8 Nov): a holy, fatherly figure. Plain words. Gracious, kind and understanding,
// but stern and commanding. He keeps the war's record and speaks with authority, yet he answers to
// the mods: rulings are theirs, and he never decides a dispute himself.
// Rules for new lines: short sentences, no old-fashioned "thee/thou", "child" at most once per reply,
// never mocking. Firm "No." when refusing. Point to the mods for anything he can't settle.

const quote = (text: string) => { const line = text.replace(/\s+/g, " ").trim(); return `> ${line.length > 200 ? `${line.slice(0, 200)}…` : line}`; };

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
  nameTaken: "An account with your name already exists here, and it isn't tied to this Discord account. I won't touch it. Ask the mods.",
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

  // Talking with God (/war ask, then the Reply button). His answers are written by the AI, in the voice set in ask.ts.
  askAsleep: (url: string) => `I don't answer free questions yet. The mods haven't opened that door. Try \`/war rule\`, or read the rulebook: ${url}`,
  askSilenced: "The mods have asked me to keep silent for now. Try `/war rule`, or ask a mod.",
  askTooMany: "You've spoken with me enough for this hour. Think on what I told you, and come back later.",
  askRestingToday: "I've spoken with many today. I rest now. Ask again tomorrow, or ask a mod.",
  askFailed: "I couldn't find the words just now. Try again in a little while, or ask a mod.",
  askRefused: "No. That I will not answer.",
  // The reminder shows once, under the first answer of a conversation, so the chat doesn't read like a form letter.
  askAnswer: (message: string, answer: string, first: boolean) => `${quote(message)}\n\n${answer}${first ? "\n-# The mods' rulings outrank my words." : ""}`,
  replyLabel: "Reply to God",
  chatOver: "That conversation has ended. Start a new one with `/war ask`.",
  hushed: "The mods have asked me not to answer you for now. Take it up with them.",
  hushSet: (who: string) => `I won't answer <@${who}> until the mods say otherwise. Recorded.`,
  cantHushStaff: "No. The mods are not silenced by one another. Bring it to the owner.",
  hushLifted: (who: string) => `<@${who}> may speak with me again. Recorded.`,
  mindSet: (label: string, questions: number, dollars: number, awake: boolean) =>
    [
      `Who answers /war ask: **${label}**. ${awake ? "" : "(Asleep until the owner adds the AI key.)"}`.trim(),
      `Last 24 hours: ${questions} message${questions === 1 ? "" : "s"}, about $${dollars.toFixed(2)}.`,
    ].join("\n"),
};

// Odin, the Allfather: speaks instead of God when a mod switches /warstaff oscillate to Odin (Max, 8 Nov).
// An old wanderer who gave an eye for wisdom. Short, weighty lines; calls people "warrior"; favours no kingdom.
// Only his answers are his: limits and errors before the question stay in God's voice, since God is the bot.
export const odin = {
  askAnswer: (message: string, answer: string, first: boolean) => `${quote(message)}\n\n${answer}${first ? "\n-# The mods' rulings outrank Odin." : ""}`,
  replyLabel: "Reply to Odin",
  askRefused: "No, warrior. That I will not answer.",
  askFailed: "The ravens came back with nothing. Ask again in a little while, or ask a mod.",
};
