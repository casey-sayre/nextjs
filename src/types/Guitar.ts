export type Guitar = {
  id: string; // UUID
  slug: string;
  name: string;
  description: string;
  strings: {
    size: string; // "8", "9", "10"
    lastChanged: string; // YYYY-MM-DD
  };
};