"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import NotesList from "../../components/NotesList";
import NoteEditor from "../../components/NoteEditor";
import type { Note, Folder, Tag } from "../../types/types";

export default function NotesAppPage() {
  const { isAuth, user, logout } = useAuth();
  const router = useRouter();

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [search, setSearch] = useState("");

  if (!isAuth) {
    router.push("/auth");
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        activeFolder={selectedFolder?.id}
        activeTag={selectedTag?.id}
        onSelectFolder={f => {
          setSelectedFolder(f);
          setSelectedTag(null);
        }}
        onSelectTag={t => {
          setSelectedTag(t);
          setSelectedFolder(null);
        }}
      />
      <main className="flex-1 flex flex-col items-center py-8 px-4 gap-6 bg-white dark:bg-neutral-900">
        <div className="flex w-full justify-between max-w-xl">
          <form
            onSubmit={e => {
              e.preventDefault();
            }}
            className="flex-1"
          >
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Search notes..."
            />
          </form>
          <div className="flex items-center ml-4 gap-3">
            <span className="text-xs text-neutral-400">{user}</span>
            <button
              className="underline text-xs text-accent"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-screen-xl">
          <section className="sm:min-w-[250px] flex-1">
            <button
              className="mb-2 bg-secondary text-white px-3 py-1 rounded w-full font-semibold"
              onClick={() => setSelectedNote(null)}
            >
              + New Note
            </button>
            <NotesList
              folderId={selectedFolder?.id}
              tagId={selectedTag?.id}
              search={search}
              onSelect={n => setSelectedNote(n)}
              activeNoteId={selectedNote?.id}
            />
          </section>
          <section className="flex-1">
            <NoteEditor
              note={selectedNote}
              onSaved={note => setSelectedNote(note)}
              onDeleted={() => setSelectedNote(null)}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
