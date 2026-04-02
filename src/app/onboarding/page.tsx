"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { generateBrewfile } from "@/lib/brewfile";
import type { QuizAnswers } from "@/types/brewfile";
import QuizLayout from "@/components/ui/QuizLayout";
import StepDrinkType from "@/components/onboarding/StepDrinkType";
import StepCafeVibe from "@/components/onboarding/StepCafeVibe";
import StepRoastProfile from "@/components/onboarding/StepRoastProfile";
import StepFlavorPalette from "@/components/onboarding/StepFlavorPalette";
import StepIntensity from "@/components/onboarding/StepIntensity";
import StepRitualPattern from "@/components/onboarding/StepRitualPattern";
import StepAdventurousness from "@/components/onboarding/StepAdventurousness";
import StepBeanOrigin from "@/components/onboarding/StepBeanOrigin";

const TOTAL_STEPS = 8;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [saving, setSaving] = useState(false);
  const [complete, setComplete] = useState(false);

  // Quiz state
  const [drinkTypes, setDrinkTypes] = useState<string[]>([]);
  const [cafeVibes, setCafeVibes] = useState<string[]>([]);
  const [roastProfile, setRoastProfile] = useState(0.5);
  const [flavorTags, setFlavorTags] = useState<string[]>([]);
  const [intensity, setIntensity] = useState(0.5);
  const [ritualPatterns, setRitualPatterns] = useState<string[]>([]);
  const [adventurousness, setAdventurousness] = useState(0.5);
  const [beanOrigins, setBeanOrigins] = useState<string[]>([]);

  const canContinue = [
    drinkTypes.length >= 1,      // Step 0
    cafeVibes.length >= 1,       // Step 1
    true,                        // Step 2 (slider always valid)
    flavorTags.length >= 3,      // Step 3
    true,                        // Step 4 (slider always valid)
    ritualPatterns.length >= 1,  // Step 5
    true,                        // Step 6 (slider always valid)
    true,                        // Step 7 (optional)
  ][step];

  async function goNext() {
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep(step + 1);
    } else {
      await saveBrewfile();
    }
  }

  function goBack() {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    } else {
      router.back();
    }
  }

  async function saveBrewfile() {
    setSaving(true);

    const answers: QuizAnswers = {
      drinkTypes,
      cafeVibes,
      roastProfile,
      flavorTags,
      intensity,
      ritualPatterns,
      adventurousness,
      beanOrigins: beanOrigins.filter((o) => o !== "Surprise me"),
    };

    const brewfile = generateBrewfile(answers);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth");
      return;
    }

    // Upsert user profile
    await supabase.from("users").upsert({
      id: user.id,
      email: user.email!,
      onboarding_completed: true,
    });

    // Upsert brewfile
    await supabase.from("brewfiles").upsert({
      user_id: user.id,
      ...brewfile,
      total_logs: 0,
      last_updated: new Date().toISOString(),
    });

    setSaving(false);
    setComplete(true);
  }

  // Completion screen
  if (complete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-soft-white px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="text-7xl mb-6"
          >
            ✨
          </motion.div>
          <h1 className="font-playfair text-[32px] font-bold text-espresso mb-3">
            Your Brewfile is ready!
          </h1>
          <p className="text-latte text-[15px] max-w-[280px] leading-relaxed mb-4">
            We&apos;ve mapped your coffee DNA. Let&apos;s see what kind of coffee lover you are.
          </p>
          <motion.button
            onClick={() => router.push("/brewfile")}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full max-w-[280px] bg-blush text-white py-4 rounded-3xl text-[17px] font-semibold shadow-lg shadow-blush/20 hover:bg-accent-rose transition-colors mb-6"
          >
            See My Brewfile
          </motion.button>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-latte/50 text-[13px] max-w-[280px] leading-relaxed italic"
          >
            P.S. This is just the start. Your Brewfile is ever-evolving as you engage in more brewmance.
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Saving screen
  if (saving) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-soft-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-5xl mb-4"
        >
          ☕
        </motion.div>
        <p className="text-latte font-medium">Brewing your profile...</p>
      </div>
    );
  }

  const STEPS = [
    {
      title: "How do you take\nyour coffee?",
      subtitle: "Tell us your go-to orders",
      content: <StepDrinkType selected={drinkTypes} onSelect={setDrinkTypes} />,
    },
    {
      title: "Pick your vibe",
      subtitle: "What's your ideal cafe like?",
      content: <StepCafeVibe selected={cafeVibes} onSelect={setCafeVibes} />,
    },
    {
      title: "Light or dark?",
      subtitle: "Where do you fall on the roast spectrum?",
      content: <StepRoastProfile value={roastProfile} onChange={setRoastProfile} />,
    },
    {
      title: "What flavors\ndo you love?",
      subtitle: "Your taste, your rules",
      content: <StepFlavorPalette selected={flavorTags} onSelect={setFlavorTags} />,
    },
    {
      title: "How strong do\nyou like it?",
      subtitle: "From gentle sip to full throttle",
      content: <StepIntensity value={intensity} onChange={setIntensity} />,
    },
    {
      title: "When's your\ncoffee moment?",
      subtitle: "Everyone has a ritual",
      content: <StepRitualPattern selected={ritualPatterns} onSelect={setRitualPatterns} />,
    },
    {
      title: "Are you\nadventurous?",
      subtitle: "How far should we push your palate?",
      content: <StepAdventurousness value={adventurousness} onChange={setAdventurousness} />,
    },
    {
      title: "Any favorite\norigins?",
      subtitle: "Where your beans come from matters",
      content: <StepBeanOrigin selected={beanOrigins} onSelect={setBeanOrigins} />,
    },
  ];

  const currentStep = STEPS[step];

  return (
    <QuizLayout
      step={step}
      totalSteps={TOTAL_STEPS}
      title={currentStep.title}
      subtitle={currentStep.subtitle}
      canContinue={canContinue}
      onContinue={goNext}
      onBack={goBack}
      continueLabel={step === TOTAL_STEPS - 1 ? "Build My Brewfile" : "Continue"}
      showSkip={step === TOTAL_STEPS - 1}
      onSkip={goNext}
      direction={direction}
    >
      {currentStep.content}
    </QuizLayout>
  );
}
