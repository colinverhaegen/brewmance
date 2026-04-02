import type { Brewfile, WeightedPreference } from "@/types/brewfile";

export interface CafeRow {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  neighborhood: string;
  latitude: number | null;
  longitude: number | null;
  google_rating: number | null;
  photos: string[];
  vibe_tags: string[];
  drink_types: string[];
  specialty_flags: string[];
  hours: Record<string, string> | null;
  website: string | null;
  instagram: string | null;
  total_checkins: number;
  avg_rating: number;
}

export interface ScoredCafe extends CafeRow {
  matchScore: number;
  matchPercent: number;
}

function prefNames(prefs: WeightedPreference[]): string[] {
  return prefs.map((p) => p.name.toLowerCase());
}

/**
 * Score a cafe against a user's Brewfile.
 * Returns 0-1 score.
 */
function scoreCafe(cafe: CafeRow, brewfile: Brewfile): number {
  let score = 0;
  let maxScore = 0;

  // Vibe match (weight: 25%)
  const vibePrefs = prefNames(brewfile.cafe_vibe);
  if (vibePrefs.length > 0 && cafe.vibe_tags.length > 0) {
    const vibeMatches = cafe.vibe_tags.filter((v) =>
      vibePrefs.includes(v.toLowerCase())
    ).length;
    score += (vibeMatches / Math.max(vibePrefs.length, 1)) * 25;
  }
  maxScore += 25;

  // Drink type match (weight: 25%)
  const drinkPrefs = prefNames(brewfile.drink_type);
  if (drinkPrefs.length > 0 && cafe.drink_types.length > 0) {
    const drinkMatches = cafe.drink_types.filter((d) =>
      drinkPrefs.some((p) => d.toLowerCase().includes(p) || p.includes(d.toLowerCase()))
    ).length;
    score += (drinkMatches / Math.max(drinkPrefs.length, 1)) * 25;
  }
  maxScore += 25;

  // Specialty match (weight: 15%)
  const methodPrefs = prefNames(brewfile.brew_method);
  if (cafe.specialty_flags.length > 0) {
    const specialtyMatches = cafe.specialty_flags.filter((f) => {
      const fl = f.toLowerCase();
      // Match third-wave, pour-over, single-origin etc. to brew method prefs
      if (fl.includes("pour-over") && methodPrefs.includes("pour_over")) return true;
      if (fl.includes("house-roasted") && brewfile.roast_profile > 0.5) return true;
      if (fl.includes("single-origin") && brewfile.adventurousness > 0.5) return true;
      if (fl.includes("third-wave")) return true; // bonus for everyone
      return false;
    }).length;
    score += (specialtyMatches / Math.max(cafe.specialty_flags.length, 1)) * 15;
  }
  maxScore += 15;

  // Rating bonus (weight: 10%)
  if (cafe.google_rating) {
    score += (cafe.google_rating / 5) * 10;
  }
  maxScore += 10;

  // Adventurousness factor (weight: 15%)
  // High adventurousness → boost diverse/unusual cafes
  // Low adventurousness → boost popular/high-rated cafes
  const adv = brewfile.adventurousness;
  if (adv > 0.6) {
    // Adventurous: boost cafes with more specialty flags and hidden-gem vibe
    const hasHiddenGem = cafe.vibe_tags.some((v) => v.toLowerCase() === "hidden-gem");
    const specialtyCount = cafe.specialty_flags.length;
    score += ((hasHiddenGem ? 0.5 : 0) + Math.min(specialtyCount / 4, 0.5)) * 15;
  } else {
    // Conservative: boost high-rated, high-checkin cafes
    const popularity = Math.min((cafe.total_checkins || 0) / 50, 1);
    const rating = (cafe.google_rating || 4) / 5;
    score += ((popularity * 0.4) + (rating * 0.6)) * 15;
  }
  maxScore += 15;

  // Intensity/roast alignment (weight: 10%)
  const hasDarkRoast = cafe.drink_types.some((d) =>
    ["espresso", "long-black"].includes(d.toLowerCase())
  );
  const hasLightDrinks = cafe.drink_types.some((d) =>
    ["pour-over", "filter"].includes(d.toLowerCase())
  );
  if (brewfile.intensity > 0.6 && hasDarkRoast) score += 10;
  else if (brewfile.intensity < 0.4 && hasLightDrinks) score += 10;
  else score += 5; // partial match
  maxScore += 10;

  return maxScore > 0 ? score / maxScore : 0;
}

/**
 * Score and rank cafes against a user's Brewfile.
 */
export function rankCafes(cafes: CafeRow[], brewfile: Brewfile | null): ScoredCafe[] {
  if (!brewfile) {
    // No brewfile — rank by rating
    return cafes.map((c) => ({
      ...c,
      matchScore: (c.google_rating || 4) / 5,
      matchPercent: Math.round(((c.google_rating || 4) / 5) * 100),
    })).sort((a, b) => b.matchScore - a.matchScore);
  }

  return cafes
    .map((cafe) => {
      const matchScore = scoreCafe(cafe, brewfile);
      return {
        ...cafe,
        matchScore,
        matchPercent: Math.round(matchScore * 100),
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
