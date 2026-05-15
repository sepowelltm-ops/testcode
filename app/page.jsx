"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Flame, RotateCcw, Trophy, Zap } from "lucide-react";

const RANKS = [
  { name: "Wood", min: 0, badge: "🪵", note: "Showing up is the win." },
  { name: "Bronze", min: 20, badge: "🥉", note: "You are building the habit." },
  { name: "Silver", min: 40, badge: "🥈", note: "Your base is getting stronger." },
  { name: "Gold", min: 60, badge: "🥇", note: "Solid work. Keep stacking days." },
  { name: "Platinum", min: 75, badge: "💿", note: "You are getting serious." },
  { name: "Diamond", min: 88, badge: "💎", note: "High-level consistency." },
  { name: "Emerald", min: 96, badge: "🟢", note: "Elite discipline." },
  { name: "Master", min: 100, badge: "👑", note: "Perfect session." },
];

const WORKOUT_TASKS = [
  {
    id: "warmup",
    title: "Warm up",
    detail: "5 minutes of jumping jacks, arm circles, wrist prep, and light squats.",
    points: 10,
  },
  {
    id: "pushups",
    title: "Push-ups",
    detail: "3 sets. Stop 1-2 reps before failure. Use knees if needed.",
    points: 15,
  },
  {
    id: "rows",
    title: "Rows or pull-up progression",
    detail: "3 sets of rows, negatives, dead hangs, or assisted pull-ups.",
    points: 15,
  },
  {
    id: "squats",
    title: "Squats",
    detail: "3 sets of bodyweight squats with clean form.",
    points: 12,
  },
  {
    id: "core",
    title: "Core work",
    detail: "Plank, hollow hold, or dead bug for 3 rounds.",
    points: 12,
  },
  {
    id: "mobility",
    title: "Mobility cooldown",
    detail: "Stretch shoulders, hips, hamstrings, and wrists for 5 minutes.",
    points: 10,
  },
  {
    id: "form",
    title: "Good form check",
    detail: "No ego reps. Control the movement and full range when possible.",
    points: 14,
  },
  {
    id: "log",
    title: "Log the session",
    detail: "Write what you did and one thing to improve next time.",
    points: 12,
  },
];

function getRank(score) {
  return [...RANKS].reverse().find((rank) => score >= rank.min) || RANKS[0];
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function Home() {
  const [checked, setChecked] = useState({});
  const [history, setHistory] = useState([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("grind-rank-tracker");
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      setChecked(data.checked || {});
      setHistory(data.history || []);
      setNotes(data.notes || "");
    } catch {
      localStorage.removeItem("grind-rank-tracker");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "grind-rank-tracker",
      JSON.stringify({ checked, history, notes })
    );
  }, [checked, history, notes]);

  const score = useMemo(() => {
    return WORKOUT_TASKS.reduce((total, task) => total + (checked[task.id] ? task.points : 0), 0);
  }, [checked]);

  const rank = getRank(score);
  const completedCount = WORKOUT_TASKS.filter((task) => checked[task.id]).length;
  const progressWidth = Math.min(score, 100);

  const streak = useMemo(() => {
    if (history.length === 0) return 0;
    const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));
    let count = 0;
    let cursor = new Date();

    for (const item of sorted) {
      const key = cursor.toISOString().slice(0, 10);
      if (item.date === key) {
        count += 1;
        cursor.setDate(cursor.getDate() - 1);
      }
    }

    return count;
  }, [history]);

  function toggleTask(id) {
    setChecked((current) => ({ ...current, [id]: !current[id] }));
  }

  function saveSession() {
    const entry = {
      date: todayKey(),
      score,
      rank: rank.name,
      completed: completedCount,
      total: WORKOUT_TASKS.length,
      notes,
    };

    setHistory((current) => [entry, ...current.filter((item) => item.date !== entry.date)].slice(0, 14));
  }

  function resetToday() {
    setChecked({});
    setNotes("");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#020403] text-green-50">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.2),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_30%)]" />

      <section className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 rounded-[2rem] border border-green-400/20 bg-black/50 p-6 shadow-glow backdrop-blur sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 text-sm text-green-300">
                <Zap size={16} /> Calisthenics Rank System
              </p>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
                Grind Rank Tracker
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-green-100/70 sm:text-lg">
                Check off the right stuff, earn points, and climb from Wood to Master. Built for simple starter workouts, consistency, and clean progress tracking.
              </p>
            </div>

            <div className="rounded-3xl border border-green-400/20 bg-green-400/10 p-5 text-center min-w-[210px]">
              <div className="text-5xl">{rank.badge}</div>
              <p className="mt-2 text-sm uppercase tracking-[0.3em] text-green-300">Current Rank</p>
              <h2 className="text-4xl font-black text-white">{rank.name}</h2>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="rounded-[2rem] border border-green-400/20 bg-zinc-950/80 p-5 shadow-glow sm:p-6"
          >
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Today's Checklist</h2>
                <p className="text-green-100/60">Complete tasks honestly. The app tracks what you did right.</p>
              </div>
              <button
                onClick={resetToday}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-green-400/20 px-4 py-2 text-sm text-green-200 hover:bg-green-400/10"
              >
                <RotateCcw size={16} /> Reset
              </button>
            </div>

            <div className="space-y-3">
              {WORKOUT_TASKS.map((task) => {
                const active = Boolean(checked[task.id]);
                return (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`w-full rounded-3xl border p-4 text-left transition ${
                      active
                        ? "border-green-400/60 bg-green-400/15"
                        : "border-green-400/10 bg-black/30 hover:border-green-400/30"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="pt-1 text-green-300">
                        {active ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-bold text-white">{task.title}</h3>
                          <span className="rounded-full bg-green-400/10 px-3 py-1 text-sm font-semibold text-green-300">
                            +{task.points}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-green-100/60">{task.detail}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.45 }}
              className="rounded-[2rem] border border-green-400/20 bg-zinc-950/80 p-6 shadow-glow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-green-300">Score</p>
                  <h2 className="text-5xl font-black text-white">{score}</h2>
                </div>
                <Trophy className="text-green-300" size={44} />
              </div>

              <div className="mt-5 h-4 overflow-hidden rounded-full bg-green-950">
                <div
                  className="h-full rounded-full bg-green-400 transition-all duration-500"
                  style={{ width: `${progressWidth}%` }}
                />
              </div>

              <p className="mt-4 text-green-100/70">{rank.note}</p>
              <p className="mt-1 text-sm text-green-100/50">
                {completedCount}/{WORKOUT_TASKS.length} tasks complete
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.45 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="rounded-3xl border border-green-400/20 bg-black/40 p-5">
                <Flame className="mb-3 text-green-300" />
                <p className="text-3xl font-black text-white">{streak}</p>
                <p className="text-sm text-green-100/60">Day streak</p>
              </div>
              <div className="rounded-3xl border border-green-400/20 bg-black/40 p-5">
                <CheckCircle2 className="mb-3 text-green-300" />
                <p className="text-3xl font-black text-white">{history.length}</p>
                <p className="text-sm text-green-100/60">Sessions saved</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.45 }}
              className="rounded-[2rem] border border-green-400/20 bg-zinc-950/80 p-6"
            >
              <h2 className="mb-3 text-xl font-bold text-white">Session Notes</h2>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Example: Push-ups felt easier. Next time add 2 reps."
                className="min-h-28 w-full resize-none rounded-3xl border border-green-400/20 bg-black/50 p-4 text-green-50 outline-none placeholder:text-green-100/30 focus:border-green-400/60"
              />
              <button
                onClick={saveSession}
                className="mt-4 w-full rounded-2xl bg-green-400 px-5 py-3 font-black text-black transition hover:bg-green-300"
              >
                Save Today's Rank
              </button>
            </motion.div>
          </div>
        </div>

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-green-400/20 bg-zinc-950/80 p-6">
            <h2 className="mb-4 text-xl font-bold text-white">Rank Tiers</h2>
            <div className="space-y-2">
              {RANKS.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-2xl bg-black/30 px-4 py-3">
                  <span className="font-semibold text-white">{item.badge} {item.name}</span>
                  <span className="text-sm text-green-300">{item.min}+ pts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-green-400/20 bg-zinc-950/80 p-6">
            <h2 className="mb-4 text-xl font-bold text-white">Recent Sessions</h2>
            {history.length === 0 ? (
              <p className="rounded-3xl bg-black/30 p-5 text-green-100/60">
                No saved sessions yet. Finish today's checklist and save your rank.
              </p>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div key={item.date} className="rounded-3xl border border-green-400/10 bg-black/30 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-white">{item.date}</p>
                        <p className="text-sm text-green-100/50">{item.completed}/{item.total} tasks completed</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-green-300">{item.rank}</p>
                        <p className="text-sm text-green-100/50">{item.score} pts</p>
                      </div>
                    </div>
                    {item.notes ? <p className="mt-3 text-sm text-green-100/60">{item.notes}</p> : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
