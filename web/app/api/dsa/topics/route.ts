import { prisma } from "@/lib/prisma";

export async function GET() {
  const topics = await prisma.dsaTopic.findMany({
    orderBy: { id: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return Response.json(topics);
}
