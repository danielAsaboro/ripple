// src/utils/username.ts

const adjectives = [
  "Swift",
  "Bright",
  "Cosmic",
  "Solar",
  "Lunar",
  "Noble",
  "Brave",
  "Mystic",
  "Crystal",
  "Golden",
  "Silver",
  "Stellar",
  "Radiant",
  "Royal",
  "Sacred",
  "Ancient",
  "Eternal",
  "Quantum",
  "Digital",
  "Cyber",
  "Majestic",
  "Arcane",
  "Primal",
  "Infinite",
  "Frozen",
  "Blazing",
  "Velvet",
  "Cobalt",
  "Crimson",
  "Emerald",
  "Sapphire",
  "Obsidian",
  "Shimmering",
  "Ethereal",
  "Galactic",
  "Solaris",
  "Zephyr",
  "Spectral",
  "Daring",
];

const nouns = [
  "Phoenix",
  "Dragon",
  "Eagle",
  "Tiger",
  "Lion",
  "Wolf",
  "Falcon",
  "Panther",
  "Dolphin",
  "Raven",
  "Guardian",
  "Warrior",
  "Knight",
  "Hunter",
  "Ranger",
  "Pioneer",
  "Explorer",
  "Seeker",
  "Voyager",
  "Scholar",
  "Oracle",
  "Sphinx",
  "Griffin",
  "Basilisk",
  "Cobra",
  "Jaguar",
  "Hawk",
  "Turtle",
  "Otter",
  "Shadow",
  "Sentinel",
  "Warden",
  "Shaman",
  "Sage",
  "Adventurer",
  "Champion",
  "Visionary",
  "Strider",
  "Navigator",
  "Alchemist",
];

export const generateRandomUsername = (): string => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  return `${adjective}${noun}${number}`;
};

export const generateUsernameSuggestions = (count: number = 5): string[] => {
  const suggestions: string[] = [];
  for (let i = 0; i < count; i++) {
    suggestions.push(generateRandomUsername());
  }
  return suggestions;
};
