import { NextResponse } from "next/server";
import { createForumThread, getForumThreads } from "@/lib/forum-store";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  return NextResponse.json({ threads: getForumThreads() });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Record<string, unknown>;
  const title = clean(payload.title);
  const category = clean(payload.category);
  const author = clean(payload.author) || "Sinland Guest";
  const message = clean(payload.message);

  if (!title || !category || !message) {
    return NextResponse.json({ error: "Title, category, and message are required." }, { status: 400 });
  }

  if (title.length > 80 || author.length > 32 || message.length > 700) {
    return NextResponse.json({ error: "One of the fields is too long." }, { status: 400 });
  }

  const thread = createForumThread({ title, category, author, message });
  return NextResponse.json({ thread });
}
