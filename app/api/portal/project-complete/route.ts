import { NextResponse } from "next/server";
import { formatCurrency, formatDate, getInvoiceById, portalProject } from "../../../../lib/portal-data";

export const runtime = "nodejs";

function getBaseUrl(request: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL ?? request.headers.get("origin") ?? new URL(request.url).origin;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { projectId?: unknown } | null;
  const projectId = body?.projectId;

  if (typeof projectId !== "string") {
    return NextResponse.json({ message: "Missing project id." }, { status: 400 });
  }

  const project = portalProject.projects.find((candidate) => candidate.id === projectId);

  if (!project) {
    return NextResponse.json({ message: "Project not found." }, { status: 404 });
  }

  const invoice = getInvoiceById(project.invoiceId);

  if (!invoice) {
    return NextResponse.json({ message: "Invoice not found." }, { status: 404 });
  }

  const baseUrl = getBaseUrl(request);
  const invoiceAmountCents = project.totalHours * portalProject.agreement.hourlyRateCents;
  const to = portalProject.client.email;
  const subject = `${project.name} is complete`;
  const text = [
    `Hi ${portalProject.client.contact},`,
    "",
    `${project.name} is complete. The invoice is now available to pay in your client portal.`,
    "",
    `Project: ${project.name}`,
    `Delivery: ${formatDate(project.deliveryDate)}`,
    `Invoice: ${invoice.number}`,
    `Amount: ${formatCurrency(invoiceAmountCents)}`,
    "",
    `Open the portal: ${baseUrl}/portal`,
  ].join("\n");
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.55;color:#141210;">
      <p>Hi ${escapeHtml(portalProject.client.contact)},</p>
      <p><strong>${escapeHtml(project.name)}</strong> is complete. The invoice is now available to pay in your client portal.</p>
      <p>
        Project: ${escapeHtml(project.name)}<br />
        Delivery: ${escapeHtml(formatDate(project.deliveryDate))}<br />
        Invoice: ${escapeHtml(invoice.number)}<br />
        Amount: ${escapeHtml(formatCurrency(invoiceAmountCents))}
      </p>
      <p><a href="${escapeHtml(`${baseUrl}/portal`)}">Open the client portal</a></p>
    </div>
  `;

  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.PORTAL_FROM_EMAIL ?? "Alden Huschle <portal@aldenhuschle.com>";

  if (!resendApiKey) {
    console.info("Project completion email preview", { to, subject, text });

    return NextResponse.json({
      emailSent: false,
      message: "Project marked complete. Add RESEND_API_KEY to send the completion email.",
      preview: { to, subject },
    });
  }

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      html,
      subject,
      text,
      to,
    }),
  });

  if (!emailResponse.ok) {
    const errorText = await emailResponse.text().catch(() => "");
    return NextResponse.json(
      { message: errorText || "Could not send completion email." },
      { status: 502 },
    );
  }

  return NextResponse.json({ emailSent: true, message: "Completion email sent.", preview: { to, subject } });
}
