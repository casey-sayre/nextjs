// src/types/JournalEntry.ts

export type JournalEntry = {
  id: string;
  timestamp: string; // YYYY-MM-DDTHH:mm:ss.sssZ
  author: string;
  content: string;
  slug: string;
};