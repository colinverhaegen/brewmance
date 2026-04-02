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
