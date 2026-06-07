"use client";

import { useMemo, useState } from "react";
import type { ForumThread } from "@/lib/forum-store";

const categories = ["General RP", "Support", "Business", "Faction Talk", "Vehicles", "Suggestions"];

export function ForumClient({
  initialThreads,
  defaultAuthor
}: {
  initialThreads: ForumThread[];
  defaultAuthor: string;
}) {
  const [threads, setThreads] = useState(initialThreads);
  const [form, setForm] = useState({
    title: "",
    category: categories[0],
    message: "",
    author: defaultAuthor
  });
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const groupedCounts = useMemo(() => {
    return categories.map((category) => ({
      category,
      count: threads.filter((thread) => thread.category === category).length
    }));
  }, [threads]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/forums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const payload = (await response.json()) as { error?: string; thread?: ForumThread };
      if (!response.ok || !payload.thread) {
        setStatus(payload.error || "Could not create the thread.");
        return;
      }

      setThreads((current) => [payload.thread!, ...current]);
      setForm({
        title: "",
        category: categories[0],
        message: "",
        author: defaultAuthor
      });
      setStatus("Thread created.");
    } catch {
      setStatus("Network error while creating the thread.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="forum-layout">
      <section className="forum-panel">
        <div className="section-heading">
          <span className="section-kicker">Community Board</span>
          <h2>Post about Sinland-RP</h2>
          <p>Keep threads focused on the server, its factions, support, vehicles, stories, and suggestions.</p>
        </div>

        <form className="forum-form" onSubmit={handleSubmit}>
          <label>
            <span>Thread title</span>
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              maxLength={80}
              required
            />
          </label>

          <label>
            <span>Category</span>
            <select
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Display name</span>
            <input
              value={form.author}
              onChange={(event) => setForm((current) => ({ ...current, author: event.target.value }))}
              maxLength={32}
              required
            />
          </label>

          <label>
            <span>Message</span>
            <textarea
              value={form.message}
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
              rows={6}
              maxLength={700}
              required
            />
          </label>

          <div className="forum-form-footer">
            <button className="button" disabled={loading} type="submit">
              {loading ? "Posting..." : "Create Thread"}
            </button>
            <span className="status-copy">{status}</span>
          </div>
        </form>
      </section>

      <aside className="forum-sidebar">
        <div className="mini-card">
          <h3>Board Split</h3>
          <div className="stat-stack">
            {groupedCounts.map((item) => (
              <div className="stat-row" key={item.category}>
                <span>{item.category}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <section className="thread-list">
        {threads.map((thread) => (
          <article className="thread-card" key={thread.id}>
            <div className="thread-top">
              <span className="pill">{thread.category}</span>
              <span className="muted-copy">{new Date(thread.createdAt).toLocaleString()}</span>
            </div>
            <h3>{thread.title}</h3>
            <p>{thread.message}</p>
            <div className="thread-author">Posted by {thread.author}</div>
          </article>
        ))}
        {threads.length === 0 ? (
          <article className="thread-card">
            <h3>No threads yet</h3>
            <p>Start the first server discussion and set the tone for the board.</p>
          </article>
        ) : null}
      </section>
    </div>
  );
}
