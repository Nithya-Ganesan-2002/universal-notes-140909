"use client";

import { getCookie, setCookie, deleteCookie } from "cookies-next";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

// -- Types (simplified for reuse) --
export interface TokenResponse {
  access_token: string;
  token_type: string;
}
export interface Note {
  id: string;
  title: string;
  content: string;
  folder_id?: string | null;
  tags?: string[] | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}
export interface Folder {
  id: string;
  name: string;
}
export interface Tag {
  id: string;
  name: string;
}

// -- Helper: Auth token --

export function getAuthToken(): string | null {
  return getCookie("access_token") as string | null;
}
export function setAuthToken(token: string) {
  setCookie("access_token", token, { maxAge: 60 * 60 * 24 });
}
export function clearAuthToken() {
  deleteCookie("access_token");
}

// -- API Call Helpers --
async function request(endpoint: string, options: RequestInit = {}, requireAuth = false) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (requireAuth) {
    const token = getAuthToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    // Propagate error for handling in UI
    throw await res.json().catch((): {error: string, status: number} => ({error: res.statusText, status: res.status}));
  }
  if (res.status === 204) return null;
  return res.json();
}

// PUBLIC_INTERFACE
export async function login(email: string, password: string) {
  // Returns TokenResponse
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// PUBLIC_INTERFACE
export async function register(email: string, password: string) {
  // Returns TokenResponse
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// PUBLIC_INTERFACE
export async function fetchNotes(
  folder_id?: string, tag_id?: string, search?: string
): Promise<{ notes: Note[] }> {
  const params = new URLSearchParams();
  if (folder_id) params.append("folder_id", folder_id);
  if (tag_id) params.append("tag_id", tag_id);
  if (search) params.append("search", search);
  const q = params.toString() ? `?${params.toString()}` : "";
  return request(`/notes${q}`, {}, true);
}

// PUBLIC_INTERFACE
export async function fetchNote(id: string): Promise<Note> {
  return request(`/notes/${id}`, {}, true);
}

// PUBLIC_INTERFACE
export async function createNote(data: Partial<Note>) {
  return request("/notes", {
    method: "POST",
    body: JSON.stringify(data),
  }, true);
}

// PUBLIC_INTERFACE
export async function updateNote(id: string, data: Partial<Note>) {
  return request(`/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }, true);
}

// PUBLIC_INTERFACE
export async function deleteNote(id: string) {
  return request(`/notes/${id}`, {
    method: "DELETE",
  }, true);
}

// PUBLIC_INTERFACE
export async function fetchFolders(): Promise<Folder[]> {
  return request("/folders", {}, true);
}

// PUBLIC_INTERFACE
export async function fetchTags(): Promise<Tag[]> {
  return request("/tags", {}, true);
}
