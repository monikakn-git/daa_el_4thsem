import { io, Socket } from "socket.io-client";

const API_PORT = process.env.NEXT_PUBLIC_API_PORT || "5000";
const API_URL = typeof window !== "undefined"
  ? `${window.location.protocol}//${window.location.hostname}:${API_PORT}`
  : `http://localhost:${API_PORT}`;

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket && typeof window !== "undefined") {
    socket = io(API_URL);
  }
  return socket;
};

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  },
  post: async (endpoint: string, data: any) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to post");
    return res.json();
  },
};
