import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getInvoiceById, portalProject } from "../../../../lib/portal-data";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json(
      {
        message:
          "Invoice preview ready. Add STRIPE_SECRET_KEY and owner auth before sending real Stripe invoices.",
      },
      { status: 200 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    amountDueCents?: unknown;
    invoiceId?: unknown;
    payPeriodId?: unknown;
  } | null;
  const invoiceId = body?.invoiceId;
  const payPeriodId = body?.payPeriodId;
  const amountDueCents = body?.amountDueCents;

  if (typeof invoiceId !== "string" || typeof payPeriodId !== "string") {
    return NextResponse.json({ error: "Missing invoice or pay period id." }, { status: 400 });
  }

  if (typeof amountDueCents !== "number" || !Number.isInteger(amountDueCents) || amountDueCents <= 0) {
    return NextResponse.json({ error: "Invalid invoice amount." }, { status: 400 });
  }

  const invoice = getInvoiceById(invoiceId);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const metadata = {
    clientId: portalProject.client.id,
    invoiceId: invoice.id,
    invoiceNumber: invoice.number,
    payPeriodId,
    projectId: portalProject.id,
  };

  // Production version must require owner auth before creating Stripe invoices.
  const customerId =
    portalProject.client.stripeCustomerId ||
    (
      await stripe.customers.create({
        email: portalProject.client.email,
        name: portalProject.client.name,
        metadata: { clientId: portalProject.client.id },
      })
    ).id;

  await stripe.invoiceItems.create({
    amount: amountDueCents,
    currency: "usd",
    customer: customerId,
    description: `${invoice.title}: ${portalProject.projectName}`,
    metadata,
  });

  const stripeInvoice = await stripe.invoices.create({
    auto_advance: false,
    collection_method: "send_invoice",
    customer: customerId,
    days_until_due: 3,
    description: `${portalProject.projectName} / ${invoice.number}`,
    metadata,
  });

  const finalized = await stripe.invoices.finalizeInvoice(stripeInvoice.id);
  const sent = await stripe.invoices.sendInvoice(finalized.id);

  return NextResponse.json({
    hostedInvoiceUrl: sent.hosted_invoice_url,
    stripeInvoiceId: sent.id,
  });
}
