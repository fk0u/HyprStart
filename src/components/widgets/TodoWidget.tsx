"use client";

import React, { useState } from "react";
import { useHyprStore } from "@/hooks/useHyprStore";
import { Plus, Trash2, CheckSquare, Square, CheckCircle } from "lucide-react";

export const TodoWidget: React.FC = () => {
  const { state, addTodo, toggleTodo, deleteTodo } = useHyprStore();
  const { todoList } = state;
  const [newTodo, setNewTodo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    addTodo(newTodo.trim());
    setNewTodo("");
  };

  const total = todoList.length;
  const completed = todoList.filter((t) => t.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex flex-col h-full font-mono text-xs justify-between gap-3 select-none">
      {/* Form Input Header */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Append workspace target..."
          className="flex-1 bg-black/40 border border-card-border/60 rounded px-2.5 py-1.5 text-foreground placeholder:text-text-muted/60 focus:outline-none focus:border-accent text-[11px]"
        />
        <button
          type="submit"
          className="flex items-center justify-center p-1.5 bg-accent/10 border border-accent/30 rounded text-accent hover:bg-accent/20 hover:border-accent transition-all cursor-pointer"
        >
          <Plus size={14} />
        </button>
      </form>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 min-h-0 select-text">
        {todoList.length > 0 ? (
          todoList.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center justify-between p-2 rounded border border-card-border/20 transition-all ${
                todo.completed ? "bg-black/20 opacity-60" : "bg-black/40"
              }`}
            >
              <div
                onClick={() => toggleTodo(todo.id)}
                className="flex items-center gap-2 flex-1 cursor-pointer select-none"
              >
                {todo.completed ? (
                  <CheckSquare size={13} className="text-accent shrink-0" />
                ) : (
                  <Square size={13} className="text-text-muted shrink-0" />
                )}
                <span className={`text-[11px] truncate ${todo.completed ? "line-through text-text-muted" : "text-foreground"}`}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="p-1 rounded text-text-muted hover:text-rose-400 hover:bg-rose-950/20 transition-all cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-text-muted/50 py-8 gap-2">
            <CheckCircle size={20} className="opacity-30" />
            <span className="text-[10px]">ALL TARGETS RESOLVED</span>
          </div>
        )}
      </div>

      {/* Progress Footer */}
      <div className="border-t border-card-border/20 pt-2.5 flex flex-col gap-1.5 shrink-0">
        <div className="flex justify-between items-center text-[10px] text-text-muted font-bold">
          <span>PROGRESS</span>
          <span className="text-accent">{percent}%</span>
        </div>
        <div className="w-full h-1.5 bg-black/60 rounded overflow-hidden border border-card-border/20 relative">
          <div
            className="h-full bg-accent transition-all duration-500 shadow-[0_0_8px_var(--accent)]"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
