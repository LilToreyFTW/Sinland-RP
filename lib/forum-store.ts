import fs from "node:fs";
import path from "node:path";

export type ForumThread = {
  id: string;
  title: string;
  category: string;
  author: string;
  message: string;
  createdAt: string;
};

const forumFile = path.join(process.cwd(), "data", "forum-posts.json");

function ensureForumFile() {
  const dir = path.dirname(forumFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(forumFile)) {
    fs.writeFileSync(forumFile, "[]\n", "utf8");
  }
}

export function getForumThreads() {
  ensureForumFile();

  try {
    const raw = fs.readFileSync(forumFile, "utf8");
    const parsed = JSON.parse(raw) as ForumThread[];
    return parsed.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  } catch {
    return [];
  }
}

export function createForumThread(input: Omit<ForumThread, "id" | "createdAt">) {
  const threads = getForumThreads();
  const nextThread: ForumThread = {
    id: `${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...input
  };

  threads.unshift(nextThread);
  fs.writeFileSync(forumFile, `${JSON.stringify(threads, null, 2)}\n`, "utf8");

  return nextThread;
}
