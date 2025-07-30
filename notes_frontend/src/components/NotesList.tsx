"use client";
import { useEffect, useState } from "react";
import { fetchNotes } from "../lib/api";
import type { Note } from "../types/types";

export default function NotesList({
  folderId,
  tagId,
  search,
  onSelect,
  activeNoteId,
}: {
  folderId?: string | null;
  tagId?: string | null;
  search: string;
  onSelect: (note: Note) => void;
  activeNoteId?: string | null;
}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetchNotes(folderId ?? undefined, tagId ?? undefined, search)
      .then((res) => setNotes(res.notes))
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  }, [folderId, tagId, search]);

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-2">
        {folderId || tagId ? "Filtered Notes" : "All Notes"}
      </h2>
      {loading ? (
        <div className="text-neutral-400">Loading...</div>
      ) : (
        <ul className="flex flex-col gap-2">
          {notes.map((note) => (
            <li key={note.id}>
              <button
                onClick={() => onSelect(note)}
                className={`flex flex-col w-full items-start px-2 py-1 rounded ${
                  activeNoteId === note.id
                    ? "bg-secondary/10 text-secondary"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                <span className="font-semibold">{note.title}</span>
                <span className="text-xs text-neutral-500 truncate">
                  {note.content.slice(0, 60)}
                </span>
              </button>
            </li>
          ))}
          {notes.length === 0 && (
            <li className="text-neutral-400">No notes to display.</li>
          )}
        </ul>
      )}
    </div>
  );
}
