"use client";

import React, { useState, useEffect } from "react";
import { useHyprStore } from "@/hooks/useHyprStore";

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "What we think, we become.", author: "Buddha" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
];

export const ClockWidget: React.FC = () => {
  const { state, setUse24hFormat, setUserName, setFocusGoal } = useHyprStore();
  const { use24hFormat, userName, focusGoal } = state;
  const [time, setTime] = useState<Date | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [editingFocus, setEditingFocus] = useState(false);
  const [focusInput, setFocusInput] = useState(focusGoal);

  useEffect(() => {
    setTimeout(() => setTime(new Date()), 0);
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync inputs when store changes
  const [prevName, setPrevName] = useState(userName);
  if (userName !== prevName) { setNameInput(userName); setPrevName(userName); }
  const [prevFocus, setPrevFocus] = useState(focusGoal);
  if (focusGoal !== prevFocus) { setFocusInput(focusGoal); setPrevFocus(focusGoal); }

  if (!time) return null;

  const hoursVal = time.getHours();
  const ampm = hoursVal >= 12 ? "PM" : "AM";
  let displayHours = hoursVal;
  if (!use24hFormat) {
    displayHours = hoursVal % 12;
    if (displayHours === 0) displayHours = 12;
  }

  const hours = displayHours.toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");

  const getGreeting = () => {
    const name = userName ? `, ${userName}` : "";
    if (hoursVal < 6) return `Good Night${name}`;
    if (hoursVal < 12) return `Good Morning${name}`;
    if (hoursVal < 17) return `Good Afternoon${name}`;
    return `Good Evening${name}`;
  };

  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  // Daily quote based on day of year
  const dayOfYear = Math.floor((time.getTime() - new Date(time.getFullYear(), 0, 0).getTime()) / 86400000);
  const quote = QUOTES[dayOfYear % QUOTES.length];

  const handleNameSubmit = () => {
    setUserName(nameInput.trim());
    setEditingName(false);
  };

  const handleFocusSubmit = () => {
    setFocusGoal(focusInput.trim());
    setEditingFocus(false);
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Big time */}
      <div
        className="flex items-baseline cursor-pointer"
        onClick={() => setUse24hFormat(!use24hFormat)}
        title="Click to toggle format"
      >
        <span className="text-[6.5rem] md:text-[8.5rem] font-extralight leading-none tracking-tighter">
          {hours}:{minutes}
        </span>
        {!use24hFormat && (
          <span className="text-lg font-light text-foreground/40 ml-2 self-start mt-6">
            {ampm}
          </span>
        )}
      </div>

      {/* Greeting — click to edit name */}
      {editingName ? (
        <form
          onSubmit={(e) => { e.preventDefault(); handleNameSubmit(); }}
          className="mt-2"
        >
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter your name..."
            autoFocus
            onBlur={handleNameSubmit}
            className="bg-transparent text-center text-xl font-light text-foreground/70 outline-none border-b border-foreground/20 focus:border-foreground/40 pb-1 w-64"
          />
        </form>
      ) : (
        <button
          onClick={() => setEditingName(true)}
          className="text-xl md:text-2xl font-light text-foreground/70 mt-2 cursor-pointer hover:text-foreground/90 transition-colors"
        >
          {getGreeting()}
        </button>
      )}

      {/* Date */}
      <p className="text-sm text-foreground/35 mt-1">{dateStr}</p>

      {/* Daily focus goal */}
      <div className="mt-6 w-full max-w-sm">
        {editingFocus ? (
          <form
            onSubmit={(e) => { e.preventDefault(); handleFocusSubmit(); }}
          >
            <input
              type="text"
              value={focusInput}
              onChange={(e) => setFocusInput(e.target.value)}
              placeholder="What's your main focus today?"
              autoFocus
              onBlur={handleFocusSubmit}
              className="w-full bg-transparent text-center text-sm text-foreground/60 outline-none border-b border-foreground/15 focus:border-foreground/30 pb-1 placeholder:text-foreground/20"
            />
          </form>
        ) : focusGoal ? (
          <button
            onClick={() => setEditingFocus(true)}
            className="w-full text-center text-sm text-foreground/50 cursor-pointer hover:text-foreground/70 transition-colors italic"
          >
            🎯 {focusGoal}
          </button>
        ) : (
          <button
            onClick={() => setEditingFocus(true)}
            className="w-full text-center text-sm text-foreground/20 cursor-pointer hover:text-foreground/40 transition-colors"
          >
            Click to set your daily focus...
          </button>
        )}
      </div>

      {/* Daily quote */}
      <div className="mt-8 max-w-md text-center">
        <p className="text-[13px] text-foreground/25 italic leading-relaxed">
          &ldquo;{quote.text}&rdquo;
        </p>
        <p className="text-[11px] text-foreground/15 mt-1">— {quote.author}</p>
      </div>
    </div>
  );
};
