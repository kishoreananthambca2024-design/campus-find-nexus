import type { Item } from "./campusfind";

/**
 * CampusFind smart matching — a simple, transparent rule-based algorithm.
 * No external AI is used.
 *
 *   Category match ....... 40 points
 *   Item name similarity . up to 35 points (shared meaningful words)
 *   Location similarity .. up to 25 points
 *
 * A pair is reported as a possible match when it scores 50 or higher.
 */

export const MATCH_THRESHOLD = 50;

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "my",
  "of",
  "and",
  "with",
  "in",
  "on",
  "for",
  "item",
  "new",
  "old",
]);

function words(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function overlapRatio(a: string, b: string): number {
  const left = words(a);
  const right = words(b);
  if (left.length === 0 || right.length === 0) return 0;

  const shared = left.filter((word) =>
    right.some((other) => other === word || other.startsWith(word) || word.startsWith(other)),
  ).length;

  return shared / Math.min(left.length, right.length);
}

function locationScore(a: string, b: string): number {
  const left = a.trim().toLowerCase();
  const right = b.trim().toLowerCase();
  if (!left || !right) return 0;
  if (left === right) return 25;
  if (left.includes(right) || right.includes(left)) return 20;
  const ratio = overlapRatio(a, b);
  return Math.round(ratio * 18);
}

export type MatchLabel = "Strong Match" | "Possible Match" | "Low Match";

export type Match = {
  id: string;
  lost: Item;
  found: Item;
  score: number;
  label: MatchLabel;
  reasons: string[];
};

export function scorePair(lost: Item, found: Item): Match | null {
  const reasons: string[] = [];
  let score = 0;

  const sameCategory = lost.category === found.category;
  if (sameCategory) {
    score += 40;
    reasons.push(`Same category — ${lost.category}`);
  }

  const nameRatio = overlapRatio(lost.item_name, found.item_name);
  if (nameRatio > 0) {
    score += Math.round(nameRatio * 35);
    reasons.push(nameRatio >= 0.99 ? "Identical item name" : "Similar item name");
  }

  const place = locationScore(lost.location, found.location);
  if (place > 0) {
    score += place;
    reasons.push(
      place >= 25 ? `Same location — ${lost.location}` : `Similar location — ${found.location}`,
    );
  }

  score = Math.min(100, score);
  if (score < MATCH_THRESHOLD) return null;

  const label: MatchLabel =
    score >= 80 ? "Strong Match" : score >= 65 ? "Possible Match" : "Low Match";

  return { id: `${lost.id}:${found.id}`, lost, found, score, label, reasons };
}

export function findMatches(items: Item[]): Match[] {
  const open = items.filter((item) => item.status !== "RETURNED");
  const lostItems = open.filter((item) => item.type === "LOST");
  const foundItems = open.filter((item) => item.type === "FOUND");

  const matches: Match[] = [];
  for (const lost of lostItems) {
    for (const found of foundItems) {
      const match = scorePair(lost, found);
      if (match) matches.push(match);
    }
  }

  return matches.sort((a, b) => b.score - a.score);
}

export function matchesForItem(item: Item, items: Item[]): Match[] {
  return findMatches(items).filter(
    (match) => match.lost.id === item.id || match.found.id === item.id,
  );
}
