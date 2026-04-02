export interface WeightedPreference {
  name: string;
  weight: number;
}

export interface Brewfile {
  drink_type: WeightedPreference[];
  roast_profile: number; // 0 (light) to 1 (dark)
  flavor_palette: WeightedPreference[];
  intensity: number; // 0 (mild) to 1 (strong)
  milk_extras: WeightedPreference[];
  bean_origin: WeightedPreference[];
  brew_method: WeightedPreference[];
  cafe_vibe: WeightedPreference[];
  ritual_pattern: WeightedPreference[];
  adventurousness: number; // 0 (creature of habit) to 1 (always exploring)
}

export interface QuizAnswers {
  drinkTypes: string[];
  cafeVibes: string[];
  roastProfile: number;
  flavorTags: string[];
  intensity: number;
  ritualPatterns: string[];
  adventurousness: number;
  beanOrigins: string[];
}

// Drink type → inferred milk/extras and brew method
export const DRINK_METADATA: Record<string, { milk: string[]; brewMethod: string }> = {
  espresso: { milk: ["black"], brewMethod: "espresso_machine" },
  "flat white": { milk: ["regular milk"], brewMethod: "espresso_machine" },
  latte: { milk: ["regular milk"], brewMethod: "espresso_machine" },
  cappuccino: { milk: ["regular milk"], brewMethod: "espresso_machine" },
  "long black": { milk: ["black"], brewMethod: "espresso_machine" },
  "pour over": { milk: ["black"], brewMethod: "pour_over" },
  "cold brew": { milk: ["black"], brewMethod: "cold_brew" },
  "iced latte": { milk: ["regular milk"], brewMethod: "espresso_machine" },
};
