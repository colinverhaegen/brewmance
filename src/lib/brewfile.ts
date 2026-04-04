import { Brewfile, QuizAnswers, WeightedPreference, DRINK_METADATA } from "@/types/brewfile";

function toWeighted(items: string[], weight = 1.0): WeightedPreference[] {
  return items.map((name) => ({ name, weight }));
}

/**
 * Generate an initial Brewfile from quiz answers.
 * Quiz answers are the baseline — future logs will shift weights.
 */
export function generateBrewfile(answers: QuizAnswers): Brewfile {
  // Drink types
  const drinkType = toWeighted(answers.drinkTypes);

  // Infer milk & extras from drink selections
  const milkSet = new Set<string>();
  const brewMethodSet = new Set<string>();
  for (const drink of answers.drinkTypes) {
    const meta = DRINK_METADATA[drink.toLowerCase()];
    if (meta) {
      meta.milk.forEach((m) => milkSet.add(m));
      brewMethodSet.add(meta.brewMethod);
    }
  }
  const milkExtras = toWeighted(Array.from(milkSet));
  const brewMethod = toWeighted(Array.from(brewMethodSet));

  // Flavor palette
  const flavorPalette = toWeighted(answers.flavorTags);

  // Bean origins (optional — user may have skipped)
  const beanOrigin = toWeighted(answers.beanOrigins);

  // Cafe vibe
  const cafeVibe = toWeighted(answers.cafeVibes);

  // Ritual pattern
  const ritualPattern = toWeighted(answers.ritualPatterns);

  return {
    drink_type: drinkType,
    roast_profile: answers.roastProfile,
    flavor_palette: flavorPalette,
    intensity: answers.intensity,
    milk_extras: milkExtras,
    bean_origin: beanOrigin,
    brew_method: brewMethod,
    cafe_vibe: cafeVibe,
    ritual_pattern: ritualPattern,
    adventurousness: answers.adventurousness,
  };
}

/**
 * Merge new items into a weighted array.
 * Positive boost = you like it, negative boost = you don't.
 * Used for non-taste dimensions (drink type, vibe, brew method) where
 * ordering something is always a positive signal.
 */
function mergeWeighted(
  existing: WeightedPreference[],
  newItems: string[],
  boost: number = 0.15
): WeightedPreference[] {
  const map = new Map<string, number>();
  for (const item of existing) {
    map.set(item.name, item.weight);
  }
  for (const name of newItems) {
    map.set(name, (map.get(name) || 0) + boost);
  }
  const result: WeightedPreference[] = [];
  map.forEach((weight, name) => {
    const isNew = newItems.includes(name);
    const adjusted = isNew ? Math.min(weight, 1.0) : weight * 0.98;
    if (adjusted > 0.01) {
      result.push({ name, weight: Math.round(adjusted * 100) / 100 });
    }
  });
  return result.sort((a, b) => b.weight - a.weight);
}

/**
 * Update flavor preferences based on what the user tasted AND how they rated it.
 *
 * Rating 5: strong positive (+boost * 1.5) — you love these flavors
 * Rating 4: positive (+boost) — you like these
 * Rating 3: neutral, very small positive (+boost * 0.2) — tried it, meh
 * Rating 2: negative (-boost * 0.5) — didn't enjoy these
 * Rating 1: strong negative (-boost) — actively dislike these
 *
 * This means the Brewfile flavor radar shows what you LIKE, not what you order.
 */
function mergeFlavorsByPreference(
  existing: WeightedPreference[],
  taggedFlavors: string[],
  rating: number,
  baseBoost: number = 0.15
): WeightedPreference[] {
  // Convert rating (1-5) to a sentiment multiplier
  const sentiment =
    rating >= 5 ? 1.5 :
    rating >= 4 ? 1.0 :
    rating >= 3 ? 0.2 :
    rating >= 2 ? -0.5 :
    -1.0;

  const boost = baseBoost * sentiment;

  const map = new Map<string, number>();
  for (const item of existing) {
    map.set(item.name, item.weight);
  }
  for (const name of taggedFlavors) {
    const current = map.get(name) || 0;
    map.set(name, current + boost);
  }
  // Slight decay for flavors NOT in this log (taste evolves)
  const result: WeightedPreference[] = [];
  map.forEach((weight, name) => {
    const wasTagged = taggedFlavors.includes(name);
    let adjusted = wasTagged ? weight : weight * 0.98;
    // Clamp between 0 and 1
    adjusted = Math.max(0, Math.min(1.0, adjusted));
    adjusted = Math.round(adjusted * 100) / 100;
    if (adjusted > 0.01) {
      result.push({ name, weight: adjusted });
    }
  });
  return result.sort((a, b) => b.weight - a.weight);
}

/**
 * Nudge a spectrum value (0-1) toward a target based on log data.
 */
function nudgeSpectrum(current: number, target: number, strength: number = 0.1): number {
  return Math.round((current + (target - current) * strength) * 100) / 100;
}

export interface CafeLogInput {
  drinkType: string | null;
  drinkName: string;
  rating: number;
  flavorTags: string[];
  cafeVibes: string[];
  cafeSpecialty: string[];
  loggedAt?: Date; // timestamp to infer ritual
}

/**
 * Infer which ritual pattern(s) this log represents based on time + day.
 */
function inferRitualFromTimestamp(date: Date): string[] {
  const hour = date.getHours();
  const day = date.getDay(); // 0=Sun, 6=Sat
  const isWeekend = day === 0 || day === 6;
  const rituals: string[] = [];

  if (hour >= 5 && hour < 10) rituals.push("Morning Ritual");
  else if (hour >= 12 && hour < 16) rituals.push("Afternoon Pick-me-up");
  else if (hour >= 18) rituals.push("Post-meal");

  if (isWeekend) rituals.push("Weekend Explorer");

  // Fallback if no time match
  if (rituals.length === 0) rituals.push("Social Occasion");

  return rituals;
}

export interface HomeBrewLogInput {
  brewMethod: string;
  beanOrigin: string | null;
  rating: number;
  flavorTags: string[];
  loggedAt?: Date;
}

/**
 * Update a Brewfile based on a cafe visit log.
 */
export function updateBrewfileFromCafeLog(
  brewfile: Brewfile,
  log: CafeLogInput,
  totalLogs: number
): Brewfile {
  const logWeight = Math.max(0.05, 0.2 - totalLogs * 0.005); // decreasing impact per log

  // Drink type
  const drinkTypes = log.drinkType ? [log.drinkType] : [];
  const drink_type = mergeWeighted(brewfile.drink_type, drinkTypes.map(d =>
    d.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
  ), logWeight);

  // Flavor palette — driven by PREFERENCE, not just frequency
  // High rating = you like these flavors, low rating = you don't
  const flavor_palette = mergeFlavorsByPreference(
    brewfile.flavor_palette, log.flavorTags, log.rating, logWeight
  );

  // Cafe vibe — preference-based like flavors, normalized to lowercase
  const normalizedVibes = log.cafeVibes.map((v) => v.toLowerCase());
  const cafe_vibe = mergeFlavorsByPreference(
    brewfile.cafe_vibe.map((v) => ({ ...v, name: v.name.toLowerCase() })),
    normalizedVibes, log.rating, logWeight
  );

  // Brew method from drink type
  const meta = log.drinkType ? DRINK_METADATA[log.drinkType.toLowerCase()] : null;
  const brew_method = meta
    ? mergeWeighted(brewfile.brew_method, [meta.brewMethod], logWeight)
    : brewfile.brew_method;

  // Milk extras
  const milk_extras = meta
    ? mergeWeighted(brewfile.milk_extras, meta.milk, logWeight)
    : brewfile.milk_extras;

  // Intensity: dark drinks nudge up, light drinks nudge down
  const darkDrinks = ["espresso", "long-black", "double-espresso"];
  const lightDrinks = ["pour-over", "filter", "cold-brew"];
  let intensityTarget = brewfile.intensity;
  if (log.drinkType && darkDrinks.includes(log.drinkType.toLowerCase())) intensityTarget = 0.8;
  else if (log.drinkType && lightDrinks.includes(log.drinkType.toLowerCase())) intensityTarget = 0.3;
  const intensity = nudgeSpectrum(brewfile.intensity, intensityTarget, logWeight);

  // Adventurousness: diverse logging = more adventurous
  const uniqueDrinks = new Set(drink_type.map(d => d.name)).size;
  const adventureTarget = uniqueDrinks > 3 ? 0.7 : uniqueDrinks > 2 ? 0.5 : 0.3;
  const adventurousness = nudgeSpectrum(brewfile.adventurousness, adventureTarget, logWeight * 0.5);

  // Ritual pattern — inferred from log timestamp
  const logTime = log.loggedAt || new Date();
  const inferredRituals = inferRitualFromTimestamp(logTime);
  const ritual_pattern = mergeWeighted(brewfile.ritual_pattern, inferredRituals, logWeight);

  return {
    ...brewfile,
    drink_type,
    flavor_palette,
    cafe_vibe,
    brew_method,
    milk_extras,
    intensity,
    adventurousness,
    ritual_pattern,
  };
}

/**
 * Update a Brewfile based on a home brew log.
 */
export function updateBrewfileFromHomeBrewLog(
  brewfile: Brewfile,
  log: HomeBrewLogInput,
  totalLogs: number
): Brewfile {
  const logWeight = Math.max(0.05, 0.2 - totalLogs * 0.005);

  // Flavor palette — driven by PREFERENCE, not just frequency
  const flavor_palette = mergeFlavorsByPreference(
    brewfile.flavor_palette, log.flavorTags, log.rating, logWeight
  );

  const brewMethodMap: Record<string, string> = {
    "espresso-machine": "espresso_machine",
    "pour-over": "pour_over",
    "aeropress": "aeropress",
    "french-press": "french_press",
    "cold-brew": "cold_brew",
    "moka-pot": "moka_pot",
    "v60": "pour_over",
    "chemex": "pour_over",
  };
  const methodKey = brewMethodMap[log.brewMethod] || log.brewMethod;
  const brew_method = mergeWeighted(brewfile.brew_method, [methodKey], logWeight);

  const bean_origin = log.beanOrigin
    ? mergeWeighted(brewfile.bean_origin, [log.beanOrigin], logWeight)
    : brewfile.bean_origin;

  // Home brewers tend to be more adventurous
  const adventurousness = nudgeSpectrum(brewfile.adventurousness, 0.65, logWeight * 0.3);

  // Ritual — inferred from timestamp
  const logTime = log.loggedAt || new Date();
  const inferredRituals = inferRitualFromTimestamp(logTime);
  const ritual_pattern = mergeWeighted(brewfile.ritual_pattern, inferredRituals, logWeight);

  return {
    ...brewfile,
    flavor_palette,
    brew_method,
    bean_origin,
    adventurousness,
    ritual_pattern,
  };
}
