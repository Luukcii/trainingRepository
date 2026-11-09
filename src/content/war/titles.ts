// Staff positions in the Faction War (Max, 9 Nov). A title is what people SEE; the role (player / mod / tech)
// is what they can DO. Public titles are shown to everyone on /war/staff; secret ones only to logged-in players,
// and logged-out visitors aren't told they exist.
export const staffTitles = [
  { key: "owner", label: "Owner", public: true },
  { key: "hr", label: "Head Human Resources", public: true },
  { key: "chief-server-technician", label: "Chief Server Technician", public: true },
  { key: "pope", label: "Pope", public: true },
  { key: "tech", label: "Tech", public: false },
  { key: "faction-leader", label: "Faction Leader", public: false },
  { key: "second-in-command", label: "Second in Command", public: false },
  { key: "territory-owner", label: "Territory Owner", public: false },
] as const;

export type StaffTitleKey = (typeof staffTitles)[number]["key"];
export const staffTitleKeys = staffTitles.map((t) => t.key) as [StaffTitleKey, ...StaffTitleKey[]];

export function findTitle(key: string | null | undefined) {
  return staffTitles.find((t) => t.key === key);
}

// The two voices of the war in Discord. Not accounts: they're shown on the staff page as themselves.
export const gods = [
  { name: "God", about: "Answers quick questions in Discord, announces the mods' rulings, and keeps the war's record." },
  { name: "Odin", about: "Answers the hard questions, when the mods call on him." },
];
