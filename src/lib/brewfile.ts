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
 * Merge a new weighted item into an existing weighted array.
 * Increases weight if exists, adds if new.
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
  // Normalize: cap at 1.0, decay others slightly
  const result: WeightedPreference[] = [];
  map.forEach((weight, name) => {
    const isNew = newItems.includes(name);
    const adjusted = isNew ? Math.min(weight, 1.0) : weight * 0.98; // slight decay for non-logged
    if (adjusted > 0.01) {
      result.push({ name, weight: Math.round(adjusted * 100) / 100 });
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
}

export interface HomeBrewLogInput {
  brewMethod: string;
  beanOrigin: string | null;
  rating: number;
  flavorTags: string[];
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

  // Flavor palette — boosted by rating (high rating = stronger signal)
  const ratingBoost = log.rating >= 4 ? logWeight * 1.5 : logWeight * 0.5;
  const flavor_palette = mergeWeighted(brewfile.flavor_palette, log.flavorTags, ratingBoost);

  // Cafe vibe
  const cafe_vibe = mergeWeighted(brewfile.cafe_vibe, log.cafeVibes, logWeight);

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

  return {
    ...brewfile,
    drink_type,
    flavor_palette,
    cafe_vibe,
    brew_method,
    milk_extras,
    intensity,
    adventurousness,
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
  const ratingBoost = log.rating >= 4 ? logWeight * 1.5 : logWeight * 0.5;

  const flavor_palette = mergeWeighted(brewfile.flavor_palette, log.flavorTags, ratingBoost);

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

  return {
    ...brewfile,
    flavor_palette,
    brew_method,
    bean_origin,
    adventurousness,
  };
}
