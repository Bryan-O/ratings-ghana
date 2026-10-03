import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { csvCell, describeUserAgent } from "@/lib/user-agent";

// Admin-only CSV download of all feedback (opens in Excel / Google Sheets).
export async function GET() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") return new Response("Not found", { status: 404 });

  const rows = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  const header = ["Sent at (UTC)", "Status", "Type", "Message", "Page", "From name", "From email", "Device", "Screen", "Resolved at (UTC)"];
  const lines = rows.map((f) =>
    [
      f.createdAt.toISOString(),
      f.status,
      f.type,
      f.message,
      f.path,
      f.user?.name ?? "",
      f.user?.email ?? f.email ?? "",
      describeUserAgent(f.userAgent),
      f.viewport ?? "",
      f.resolvedAt?.toISOString() ?? "",
    ]
      .map(csvCell)
      .join(","),
  );
  const body = "﻿" + [header.map(csvCell).join(","), ...lines].join("\r\n"); // BOM so Excel reads UTF-8
  const date = new Date().toISOString().slice(0, 10);
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ratingsghana-feedback-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
