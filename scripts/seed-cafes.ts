import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env.local") });

// Use service role key to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface CafeDrink {
  name: string;
  drink_type: string;
  flavor_tags: string[];
}

interface CafeData {
  name: string;
  address: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  google_rating: number;
  vibe_tags: string[];
  drink_types: string[];
  specialty_flags: string[];
  website: string | null;
  instagram: string | null;
  drinks: CafeDrink[];
}

async function main() {
  console.log("🫘 Brewmance Cafe Seeder\n");

  // Load cafe data
  const raw = readFileSync(join(__dirname, "..", "supabase", "seed-cafes.json"), "utf-8");
  const cafes: CafeData[] = JSON.parse(raw);
  console.log(`Loaded ${cafes.length} cafes from seed file\n`);

  // Track stats
  const stats: Record<string, { cafes: number; drinks: number }> = {};

  for (const cafe of cafes) {
    // Insert cafe
    const { data: inserted, error: cafeErr } = await supabase
      .from("cafes")
      .insert({
        name: cafe.name,
        address: cafe.address,
        neighborhood: cafe.neighborhood,
        latitude: cafe.latitude,
        longitude: cafe.longitude,
        google_rating: cafe.google_rating,
        vibe_tags: cafe.vibe_tags,
        drink_types: cafe.drink_types,
        specialty_flags: cafe.specialty_flags,
        website: cafe.website,
        instagram: cafe.instagram,
        photos: [],
        hours: null,
        claimed: false,
        total_checkins: 0,
        avg_rating: 0,
      })
      .select("id")
      .single();

    if (cafeErr) {
      console.error(`  ✗ ${cafe.name}: ${cafeErr.message}`);
      continue;
    }

    const cafeId = inserted.id;

    // Insert drinks
    let drinksInserted = 0;
    for (const drink of cafe.drinks) {
      const { error: drinkErr } = await supabase.from("cafe_drinks").insert({
        cafe_id: cafeId,
        name: drink.name,
        drink_type: drink.drink_type,
        flavor_tags: drink.flavor_tags,
        description: null,
        price: null,
      });

      if (drinkErr) {
        console.error(`    ✗ drink "${drink.name}": ${drinkErr.message}`);
      } else {
        drinksInserted++;
      }
    }

    console.log(`  ✓ ${cafe.name} (${cafe.neighborhood}) — ${drinksInserted} drinks`);

    // Track stats
    if (!stats[cafe.neighborhood]) {
      stats[cafe.neighborhood] = { cafes: 0, drinks: 0 };
    }
    stats[cafe.neighborhood].cafes++;
    stats[cafe.neighborhood].drinks += drinksInserted;
  }

  // Summary
  console.log("\n═══════════════════════════════════════");
  console.log("📊 Seeding Summary\n");

  let totalCafes = 0;
  let totalDrinks = 0;
  for (const [hood, s] of Object.entries(stats)) {
    console.log(`  ${hood}: ${s.cafes} cafes, ${s.drinks} drinks`);
    totalCafes += s.cafes;
    totalDrinks += s.drinks;
  }

  console.log(`\n  TOTAL: ${totalCafes} cafes, ${totalDrinks} drinks`);
  console.log("═══════════════════════════════════════\n");
}

main().catch(console.error);
