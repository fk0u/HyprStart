"use client";

import React, { useState } from "react";
import { useHyprStore } from "@/hooks/useHyprStore";
import { Plus, Trash2, Check, Circle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const TodoWidget: React.FC = () => {
  const { state, addTodo, toggleTodo, deleteTodo } = useHyprStore();
  const { todoList } = state;
  const [newTodo, setNewTodo] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    addTodo(newTodo.trim());
    setNewTodo("");
  };

  const pending = todoList.filter((t) => !t.completed).length;

  return (
    <div className="select-none">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground/80 transition-colors cursor-pointer"
      >
        <Check size={14} />
        <span>{pending > 0 ? `${pending} task${pending > 1 ? "s" : ""}` : "All done"}</span>
      </button>

      {/* Expandable panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 8, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 mb-2 w-72 bg-card-bg/90 backdrop-blur-xl border border-card-border rounded-xl p-3 shadow-2xl overflow-hidden"
          >
            {/* Add form */}
            <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a task..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-white/20 placeholder:text-foreground/25"
              />
              <button
                type="submit"
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Plus size={14} className="text-foreground/60" />
              </button>
            </form>

            {/* Task list */}
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
              <AnimatePresence initial={false}>
                {todoList.map((todo) => (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    className="flex items-center gap-2 group py-1"
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="cursor-pointer shrink-0"
                    >
                      {todo.completed ? (
                        <Check size={14} className="text-accent/60" />
                      ) : (
                        <Circle size={14} className="text-foreground/25" />
                      )}
                    </button>
                    <span
                      className={`flex-1 text-xs truncate ${
                        todo.completed
                          ? "line-through text-foreground/25"
                          : "text-foreground/70"
                      }`}
                    >
                      {todo.text}
                    </span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-0.5"
                    >
                      <Trash2 size={12} className="text-foreground/30 hover:text-red-400" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {todoList.length === 0 && (
                <p className="text-[11px] text-foreground/25 text-center py-3">
                  No tasks yet
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
