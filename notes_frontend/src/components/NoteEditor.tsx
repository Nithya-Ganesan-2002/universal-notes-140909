"use client";

import { useState, useEffect } from "react";
import { createNote, updateNote, deleteNote } from "../lib/api";
import type { Note } from "../types/types";

interface NoteEditorProps {
  note?: Note | null;
  onSaved?: (note: Note) => void;
  onDeleted?: (id: string) => void;
}

export default function NoteEditor({
  note,
  onSaved,
  onDeleted,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [note]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (note?.id) {
        const updated = await updateNote(note.id, { title, content });
        if (onSaved) onSaved(updated);
      } else {
        const newNote = await createNote({ title, content });
        if (onSaved) onSaved(newNote);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!note?.id) return;
    if (!window.confirm("Delete this note?")) return;
    await deleteNote(note.id);
    if (onDeleted) onDeleted(note.id);
  };

  return (
    <div className="flex flex-col gap-3 max-w-xl w-full">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Note title"
        className="text-lg font-semibold px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent"
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Type your note..."
        className="resize-vertical px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 min-h-[10em] bg-transparent"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="bg-primary text-white rounded px-4 py-1 font-semibold"
          disabled={saving}
        >
          {note?.id ? "Save" : "Create"}
        </button>
        {note?.id && (
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white rounded px-4 py-1 font-semibold"
            disabled={saving}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
