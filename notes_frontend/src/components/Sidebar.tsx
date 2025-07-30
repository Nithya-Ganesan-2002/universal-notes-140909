"use client";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { fetchFolders, fetchTags } from "../lib/api";
import type { Folder, Tag } from "../types/types";

export default function Sidebar({
  activeFolder,
  activeTag,
  onSelectFolder,
  onSelectTag,
}: {
  activeFolder?: string;
  activeTag?: string;
  onSelectFolder: (folder: Folder | null) => void;
  onSelectTag: (tag: Tag | null) => void;
}) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetchFolders().then(setFolders).catch(() => {});
    fetchTags().then(setTags).catch(() => {});
  }, []);

  return (
    <aside className="flex flex-col w-full sm:w-60 min-h-screen bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700 px-4 py-6 gap-6">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-xl text-primary">Notes</span>
        <button
          onClick={toggleTheme}
          className="bg-neutral-200 dark:bg-neutral-700 rounded-full px-2 py-1 text-xs"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
      <div>
        <div className="text-sm font-bold mb-2">Folders</div>
        <ul>
          <li>
            <button
              className={`w-full text-left px-2 py-1 rounded ${
                !activeFolder ? "bg-primary/10 text-primary" : ""
              }`}
              onClick={() => onSelectFolder(null)}
            >
              All Notes
            </button>
          </li>
          {folders.map((folder) => (
            <li key={folder.id}>
              <button
                onClick={() => onSelectFolder(folder)}
                className={`w-full text-left px-2 py-1 rounded ${
                  activeFolder === folder.id ? "bg-primary/10 text-primary" : ""
                }`}
              >
                {folder.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="text-sm font-bold mb-2">Tags</div>
        <ul className="flex-wrap flex gap-1">
          {tags.map((tag) => (
            <li key={tag.id}>
              <button
                onClick={() => onSelectTag(tag)}
                className={`px-2 py-1 rounded-full border text-xs ${
                  activeTag === tag.id
                    ? "bg-accent text-white"
                    : "border-neutral-400"
                }`}
              >
                #{tag.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
