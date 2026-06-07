import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getInvoiceById, portalProject } from "../../../../lib/portal-data";

export const runtime = "nodejs";

function getBaseUrl(request: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL ?? request.headers.get("origin") ?? new URL(request.url).origin;
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY to the environment." },
      { status: 501 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    invoiceId?: unknown;
    paymentPreference?: unknown;
  } | null;
  const invoiceId = body?.invoiceId;
  const paymentPreference = body?.paymentPreference === "apple_pay" ? "apple_pay" : "stripe";

  if (typeof invoiceId !== "string") {
    return NextResponse.json({ error: "Missing invoice id." }, { status: 400 });
  }

  const invoice = getInvoiceById(invoiceId);

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  if (invoice.status !== "approval" && invoice.status !== "due") {
    return NextResponse.json({ error: "This invoice is not payable." }, { status: 400 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const baseUrl = getBaseUrl(request);
  const metadata = {
    clientId: portalProject.client.id,
    invoiceId: invoice.id,
    invoiceNumber: invoice.number,
    paymentPreference,
    portalAction: invoice.status === "approval" ? "approve_and_pay" : "pay",
    projectId: portalProject.id,
  };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    client_reference_id: invoice.id,
    customer_email: portalProject.client.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: invoice.amountDueCents,
          product_data: {
            name: invoice.title,
            description: `${portalProject.projectName} / ${invoice.number}`,
          },
        },
      },
    ],
    metadata,
    payment_intent_data: { metadata },
    success_url: `${baseUrl}/portal?checkout=success&invoice=${invoice.id}`,
    cancel_url: `${baseUrl}/portal?checkout=canceled&invoice=${invoice.id}`,
  });

  return NextResponse.json({ url: session.url });
}
