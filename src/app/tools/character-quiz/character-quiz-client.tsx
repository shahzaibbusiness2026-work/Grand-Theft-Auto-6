"use client";

import { useState, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CharId = "lucia" | "jason" | "brian" | "cal" | "boobie" | "raul";

interface CharacterInfo {
  name: string;
  image: string;
  tagline: string;
  description: string;
}

const CHARACTER_ORDER: CharId[] = ["lucia", "jason", "brian", "cal", "boobie", "raul"];

const CHARACTERS: Record<CharId, CharacterInfo> = {
  lucia: {
    name: "Lucia Caminos",
    image: "/img/char-lucia.jpg",
    tagline: "The Sharp Mastermind",
    description:
      "You\u2019re the sharp mastermind of the crew \u2014 fresh out and already ten moves ahead. You play the long game, and when you commit to a score, Leonida better watch out.",
  },
  jason: {
    name: "Jason Duval",
    image: "/img/char-jason.jpg",
    tagline: "The Loyal Enforcer",
    description:
      "Loyal to the bone and built for the thrill \u2014 you\u2019d ride into a storm for your people. When things get loud, you\u2019re the one everyone wants beside them.",
  },
  brian: {
    name: "Brian Heder",
    image: "/img/char-brian-heder.jpg",
    tagline: "The Veteran Operator",
    description:
      "The veteran operator: calm under pressure and always three exits deep. Nothing rattles you because you\u2019ve already planned for it \u2014 and a backup for the backup.",
  },
  cal: {
    name: "Cal Hampton",
    image: "/img/char-cal.jpg",
    tagline: "The Wildcard",
    description:
      "Laid-back, conspiracy-curious, and funnier than anyone gives you credit for. Under the comic relief beats a sharper mind than the crew suspects.",
  },
  boobie: {
    name: "Boobie Ike",
    image: "/img/char-boobie-ike.jpg",
    tagline: "The Vice City Legend",
    description:
      "A Vice City legend and born businessman \u2014 larger than life in every room you enter. You don\u2019t chase the spotlight; the spotlight follows you.",
  },
  raul: {
    name: "Raul Bautista",
    image: "/img/char-raul-bautista.jpg",
    tagline: "The Seasoned Professional",
    description:
      "The seasoned professional every crew needs \u2014 precise, experienced, and generous with hard-won wisdom. You rob banks like an art form and mentor like a mission.",
  },
};

interface QuizOption {
  label: string;
  char: CharId;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    question: "It\u2019s Friday night in Leonida. Where are you?",
    options: [
      { label: "Partying at a beachfront club on Ocean Drive", char: "boobie" },
      { label: "Fishing off the Keys, waiting for sunrise", char: "cal" },
      { label: "Mapping out the crew\u2019s next big score", char: "lucia" },
      { label: "Running a job for the boss, no questions asked", char: "jason" },
    ],
  },
  {
    question: "Your crew needs a getaway driver. Why are you the pick?",
    options: [
      { label: "I\u2019ve memorized every back road in Vice City", char: "jason" },
      { label: "I stay ice-cold when the sirens start wailing", char: "brian" },
      { label: "Nobody plans an exit route like I do", char: "lucia" },
      { label: "I drive like the cops are just a rumor", char: "boobie" },
    ],
  },
  {
    question: "The feds are knocking. What\u2019s your move?",
    options: [
      { label: "Lawyer up and let the system do its thing", char: "brian" },
      { label: "Deny everything with a perfectly straight face", char: "boobie" },
      { label: "Already gone \u2014 backup identity in the glovebox", char: "raul" },
      { label: "Call my person. They owe me one", char: "lucia" },
    ],
  },
  {
    question: "Pick your dream ride:",
    options: [
      { label: "Armored muscle car with blacked-out windows", char: "jason" },
      { label: "Something fast, flashy, and expensive", char: "boobie" },
      { label: "A beat-up truck that never breaks down", char: "cal" },
      { label: "Quiet sedan \u2014 never draw attention", char: "raul" },
    ],
  },
  {
    question: "Your boss hands you a job you didn\u2019t sign up for. You\u2026",
    options: [
      { label: "Negotiate a bigger cut before touching it", char: "lucia" },
      { label: "Get it done \u2014 loyalty over comfort", char: "jason" },
      { label: "Study it overnight and find the cleanest angle", char: "brian" },
      { label: "Wonder out loud if the whole thing is a setup", char: "cal" },
    ],
  },
  {
    question: "What\u2019s your perfect Vice City weekend?",
    options: [
      { label: "Yacht party, bottle service, velvet rope", char: "boobie" },
      { label: "Swamp airboat tour, hunting for \u201Cthe truth\u201D", char: "cal" },
      { label: "Private range time, then counting cash", char: "raul" },
      { label: "Sitting on a debt I\u2019m owed \u2014 and collecting", char: "brian" },
    ],
  },
  {
    question: "The crew argues over the plan. You\u2026",
    options: [
      { label: "Take charge and settle it \u2014 my plan wins", char: "lucia" },
      { label: "Take the rookies under my wing and show them how it\u2019s done", char: "raul" },
      { label: "Lay out the numbers until everyone agrees", char: "brian" },
      { label: "Defuse it with a joke nobody quite gets", char: "cal" },
    ],
  },
  {
    question: "Your legend on the street is\u2026",
    options: [
      { label: "The mastermind who never gets caught", char: "lucia" },
      { label: "The one who always rides for their people", char: "jason" },
      { label: "The legend of the Malib\u00FA scene", char: "boobie" },
      { label: "The ghost \u2014 in and out, no trace", char: "raul" },
    ],
  },
];

export function CharacterQuizClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(CharId | null)[]>(() => Array(QUESTIONS.length).fill(null));
  const [finished, setFinished] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo<CharId | null>(() => {
    if (!finished) return null;
    const scores: Record<CharId, number> = {
      lucia: 0,
      jason: 0,
      brian: 0,
      cal: 0,
      boobie: 0,
      raul: 0,
    };
    answers.forEach((a) => {
      if (a) scores[a] += 1;
    });
    // Tiebreak: first in CHARACTER_ORDER wins
    let winner: CharId = CHARACTER_ORDER[0];
    CHARACTER_ORDER.forEach((id) => {
      if (scores[id] > scores[winner]) winner = id;
    });
    return winner;
  }, [finished, answers]);

  const handleAnswer = (char: CharId) => {
    const next = [...answers];
    next[step] = char;
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  const handleBack = () => {
    if (finished) {
      setFinished(false);
      setStep(QUESTIONS.length - 1);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleRetake = () => {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setStep(0);
    setFinished(false);
    setCopied(false);
  };

  const handleCopyResult = () => {
    if (!result) return;
    const char = CHARACTERS[result];
    const text = `I got ${char.name} (${char.tagline}) on the GTA 6 Character Quiz! ${char.description} Take the quiz and find your match.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const answeredCount = answers.filter((a) => a !== null).length;
  const progressPct = finished ? 100 : Math.round((step / QUESTIONS.length) * 100);

  // ---------- RESULT SCREEN ----------
  if (finished && result) {
    const char = CHARACTERS[result];
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border shadow-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-gold-light mb-4">
            <PartyPopper className="h-3 w-3" /> Your Result
          </div>
          <div className="mx-auto w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-gold/40 shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-foreground mt-4">
            {char.name}
          </h2>
          <p className="text-sm font-bold uppercase tracking-widest text-gold-light mt-1">{char.tagline}</p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-4 max-w-lg mx-auto">
            {char.description}
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-6">
            <Button onClick={handleRetake} className="min-h-[44px] bg-muted/50 hover:bg-muted/60 text-foreground text-xs font-bold">
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Retake quiz
            </Button>
            <Button onClick={handleCopyResult} className="min-h-[44px] bg-muted/50 hover:bg-muted/60 text-foreground text-xs font-bold">
              {copied ? (
                <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 mr-1.5" />
              )}
              {copied ? "Result copied!" : "Copy my result"}
            </Button>
          </div>
        </div>

        {/* All characters strip */}
        <div className="card-surface p-6 rounded-3xl border border-border mt-6">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold-light" /> The Full Cast
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CHARACTER_ORDER.map((id) => (
              <div
                key={id}
                className={cn(
                  "rounded-2xl border p-3 text-center",
                  id === result
                    ? "border-gold/40 bg-gold/10"
                    : "border-border bg-muted/60"
                )}
              >
                <span className="text-sm font-bold text-foreground">{CHARACTERS[id].name}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">{CHARACTERS[id].tagline}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---------- QUESTION SCREEN ----------
  const q = QUESTIONS[step];
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="card-surface p-4 sm:p-5 rounded-2xl border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Question {step + 1} of {QUESTIONS.length}
          </span>
          <span className="text-xs font-mono font-bold text-gold-light">{answeredCount}/{QUESTIONS.length} answered</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/80 border border-border">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-gold transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border shadow-xl">
        <h2 className="font-display text-xl sm:text-2xl font-black text-foreground leading-snug">
          {q.question}
        </h2>
        <div className="mt-6 space-y-3">
          {q.options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleAnswer(opt.char)}
              className={cn(
                "w-full min-h-[44px] rounded-2xl border border-border bg-muted/60 p-4 text-left text-sm font-semibold text-foreground",
                "hover:border-violet-500/50 hover:bg-violet-500/10 active:scale-[0.99] transition-all"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Back */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className={cn(
              "min-h-[44px] inline-flex items-center gap-1.5 px-3 text-xs font-bold rounded-xl transition-colors",
              step === 0
                ? "text-muted-foreground/40 cursor-not-allowed"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            Tap an answer to continue <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
