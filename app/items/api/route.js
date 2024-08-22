import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(request) {
  const { user } = await getSession();
  const params = new URL(request.url).searchParams;
  const searchString = params.get("search");

  const items = await prisma.item.findMany({
    where: {
      user: {
        email: user.email,
      },

      OR: [
        {
          name: {
            contains: searchString,
            mode: "insensitive",
          },
        },
        { description: { contains: searchString, mode: "insensitive" } },
        { purchasedAt: { contains: searchString, mode: "insensitive" } },
      ],
    },
    include: {
      location: true,
      categories: {
        orderBy: {
          name: "asc",
        },
      },
      container: true,
      images: true,
    },
  });

  const categories = await prisma.category.findMany({
    where: {
      user: {
        email: user.email,
      },
    },
    select: {
      _count: {
        select: {
          items: true,
        },
      },
      name: true,
      createdAt: true,
      id: true,
      color: true,
    },
  });

  return Response.json({ items, categories });
}
