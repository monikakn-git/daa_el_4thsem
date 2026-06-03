"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { api } from "@/lib/api";
import { RefreshCw, Database } from "lucide-react";

type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
};

export default function AdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Contact[]>("/contacts");
      setContacts(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load contact submissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<Contact[]>("/contacts");
        if (active) {
          setContacts(res.data || []);
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setError("Unable to load contact submissions.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Admin <span className="text-gradient">Contacts</span></h1>
            <p className="text-gray-400 max-w-2xl">View stored contact submissions and verify that the backend persists messages to SQLite.</p>
          </div>
          <button onClick={fetchContacts} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-brand-neon hover:text-brand-neon">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </motion.div>

        <div className="grid gap-6">
          <GlassCard>
            <div className="flex items-center gap-4 mb-6">
              <Database className="w-6 h-6 text-brand-neon" />
              <div>
                <div className="text-sm uppercase tracking-widest text-gray-400">Persistence Status</div>
                <div className="text-lg font-semibold text-white">{contacts.length} stored messages</div>
              </div>
            </div>
            {loading && <div className="text-gray-400">Loading contacts...</div>}
            {error && <div className="text-red-400">{error}</div>}
            {!loading && !error && contacts.length === 0 && (
              <div className="text-gray-400">No contact submissions are stored yet.</div>
            )}
          </GlassCard>

          <GlassCard>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-sm text-gray-400 uppercase tracking-[0.2em]">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="bg-white/5 border border-white/10 rounded-3xl">
                      <td className="px-4 py-4 align-top text-white font-medium">{contact.name}</td>
                      <td className="px-4 py-4 align-top text-gray-300">{contact.email}</td>
                      <td className="px-4 py-4 align-top text-gray-300">{contact.subject}</td>
                      <td className="px-4 py-4 align-top text-gray-300 max-w-xl break-words">{contact.message}</td>
                      <td className="px-4 py-4 align-top text-gray-400 text-sm">{new Date(contact.receivedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
