"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Dumbbell, Flame, RefreshCcw, Trophy } from "lucide-react";

const tasks = [
  { id: "pushups", label: "Push-ups", points: 10 },
  { id: "squats", label: "Squats", points: 10 },
  { id: "plank", label: "Plank", points: 15 },
  { id: "pullups", label: "Pull-up practice", points: 20 },
  { id: "stretch", label: "Stretching", points: 10 },
  { id: "walk", label: "10 minute walk", points: 10 },
  { id: "noquit", label: "Did not quit today", points: 25 }
];

const ranks = [
  { name: "Wood", min: 0, emoji: "🪵" },
  { name: "Bronze", min: 100, emoji: "🥉" },
  { name: "Silver", min: 250, emoji: "🥈" },
  { name: "Gold", min: 500, emoji: "🥇" },
  { name: "Platinum", min: 850, emoji: "💠" },
  { name: "Diamond", min: 1200, emoji: "💎" },
  { name: "Emerald", min: 1700, emoji: "🟢" },
  { name: "Master", min: 2500, emoji: "🏆" }
];

export default function Page() {
  const [checked, setChecked] = useState({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("rank-tracker");
    if (saved) {
      const data = JSON.parse(saved);
      setTotalPoints(data.totalPoints || 0);
      setSessions(data.sessions || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "rank-tracker",
      JSON.stringify({ totalPoints, sessions })
    );
  }, [totalPoints, sessions]);

  const todayPoints = useMemo(() => {
    return tasks.reduce((sum, task) => {
      return checked[task.id] ? sum + task.points : sum;
    }, 0);
  }, [checked]);

  const currentRank = [...ranks].reverse().find((rank) => totalPoints >= rank.min);

  const nextRank = ranks.find((rank) => rank.min > totalPoints);

  function toggleTask(id) {
    setChecked((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  }

  function saveWorkout() {
    if (todayPoints === 0) return;

    const newSession = {
      date: new Date().toLocaleDateString(),
      points: todayPoints,
      completed: tasks.filter((task) => checked[task.id]).map((task) => task.label),
      notes
    };

    setSessions([newSession, ...sessions]);
    setTotalPoints(totalPoints + todayPoints);
    setChecked({});
    setNotes("");
  }

  function resetAll() {
    setChecked({});
    setTotalPoints(0);
    setSessions([]);
    setNotes("");
    localStorage.removeItem("rank-tracker");
  }

  return (
    <main className="min-h-screen bg-[#020403] text-white">
      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-8 rounded-3xl border border-green-500/30 bg-gradient-to-br from-black to-green-950/40 p-6 shadow-2xl shadow-green-950/30">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-green-400">
                Calisthenics Rank System
              </p>
              <h1 className="text-4xl font-black md:text-6xl">
                Stop quitting. Start ranking up.
              </h1>
              <p className="mt-3 max-w-2xl text-zinc-300">
                Complete the daily actions, earn points, and climb from Wood to Master.
              </p>
            </div>

            <div className="rounded-3xl border border-green-400/40 bg-black p-5 text-center">
              <div className="text-5xl">{currentRank?.emoji}</div>
              <p className="mt-2 text-sm text-zinc-400">Current Rank</p>
              <h2 className="text-3xl font-black text-green-400">
                {currentRank?.name}
              </h2>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="mb-3 flex items-center gap-2 text-green-400">
              <Trophy />
              <h2 className="text-xl font-black">Total Points</h2>
            </div>
            <p className="text-5xl font-black">{totalPoints}</p>
            <p className="mt-2 text-zinc-400">
              {nextRank
                ? `${nextRank.min - totalPoints} points until ${nextRank.name}`
                : "Max rank reached."}
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="mb-3 flex items-center gap-2 text-green-400">
              <Flame />
              <h2 className="text-xl font-black">Today</h2>
            </div>
            <p className="text-5xl font-black">{todayPoints}</p>
            <p className="mt-2 text-zinc-400">points ready to save</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="mb-3 flex items-center gap-2 text-green-400">
              <Dumbbell />
              <h2 className="text-xl font-black">Sessions</h2>
            </div>
            <p className="text-5xl font-black">{sessions.length}</p>
            <p className="mt-2 text-zinc-400">workouts logged</p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="mb-4 text-2xl font-black">Daily Checklist</h2>

            <div className="space-y-3">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                    checked[task.id]
                      ? "border-green-400 bg-green-500/10"
                      : "border-zinc-800 bg-black hover:border-green-500/60"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <CheckCircle2
                      className={
                        checked[task.id] ? "text-green-400" : "text-zinc-600"
                      }
                    />
                    <span className="font-bold">{task.label}</span>
                  </span>
                  <span className="text-green-400">+{task.points}</span>
                </button>
              ))}
            </div>

            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Workout notes..."
              className="mt-4 h-28 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white outline-none focus:border-green-400"
            />

            <div className="mt-4 flex gap-3">
              <button
                onClick={saveWorkout}
                className="flex-1 rounded-2xl bg-green-500 px-5 py-3 font-black text-black hover:bg-green-400"
              >
                Save Workout
              </button>

              <button
                onClick={resetAll}
                className="rounded-2xl border border-zinc-700 px-5 py-3 text-zinc-300 hover:border-red-500 hover:text-red-400"
              >
                <RefreshCcw />
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="mb-4 text-2xl font-black">Rank Tiers</h2>

            <div className="space-y-3">
              {ranks.map((rank) => (
                <div
                  key={rank.name}
                  className={`flex items-center justify-between rounded-2xl border p-4 ${
                    currentRank?.name === rank.name
                      ? "border-green-400 bg-green-500/10"
                      : "border-zinc-800 bg-black"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{rank.emoji}</span>
                    <span className="font-black">{rank.name}</span>
                  </div>
                  <span className="text-zinc-400">{rank.min}+ pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
          <h2 className="mb-4 text-2xl font-black">Workout History</h2>

          {sessions.length === 0 ? (
            <p className="text-zinc-400">No workouts saved yet.</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-zinc-800 bg-black p-4"
                >
                  <div className="flex justify-between gap-3">
                    <p className="font-black">{session.date}</p>
                    <p className="text-green-400">+{session.points} pts</p>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">
                    {session.completed.join(", ")}
                  </p>
                  {session.notes && (
                    <p className="mt-2 text-sm text-zinc-300">{session.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
