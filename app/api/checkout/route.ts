import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { tiers } from "@/lib/tiers";

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session?.isWhitelisted) {
    return NextResponse.json({ error: "Whitelist verification is required." }, { status: 403 });
  }

  const { tierSlug } = (await request.json()) as { tierSlug?: string };
  const tier = tiers.find((entry) => entry.slug === tierSlug);

  if (!tier) {
    return NextResponse.json({ error: "Tier not found." }, { status: 404 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const discordInvite = process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/2uRphk42HU";

  if (!stripeKey || !siteUrl) {
    return NextResponse.json({
      error: `Stripe is not configured yet. Use Discord for manual fulfillment: ${discordInvite}`
    });
  }

  const stripe = new Stripe(stripeKey);
  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${siteUrl}/?checkout=success`,
    cancel_url: `${siteUrl}/?checkout=cancelled`,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: tier.name,
            description: tier.features.join(" | ")
          },
          unit_amount: tier.price * 100
        },
        quantity: 1
      }
    ],
    metadata: {
      tierSlug: tier.slug,
      discordId: session.discordId,
      username: session.username
    }
  });

  return NextResponse.json({ url: checkout.url });
}
