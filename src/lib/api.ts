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

type ApiResponse<T> = {
  data: T;
};

export const api = {
  get: async <T = unknown>(endpoint: string): Promise<ApiResponse<T>> => {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json() as Promise<ApiResponse<T>>;
  },
  post: async <T = unknown>(endpoint: string, data: unknown): Promise<ApiResponse<T>> => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to post");
    return res.json() as Promise<ApiResponse<T>>;
  },
};
