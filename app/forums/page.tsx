import { ForumClient } from "@/components/ForumClient";
import { SiteChrome } from "@/components/SiteChrome";
import { getForumThreads } from "@/lib/forum-store";
import { getSession } from "@/lib/session";

export default async function ForumsPage() {
  const session = await getSession();
  const threads = getForumThreads();

  return (
    <SiteChrome session={session}>
      <section className="section-band">
        <ForumClient initialThreads={threads} defaultAuthor={session?.username || "Sinland Guest"} />
      </section>
    </SiteChrome>
  );
}
