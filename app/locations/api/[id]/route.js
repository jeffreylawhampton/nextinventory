import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { redirect } from "next/dist/server/api-utils";

export async function GET(request, { params: { id } }) {
  id = parseInt(id);
  const { user } = await getSession();
  id = parseInt(id);

  const location = await prisma.location.findFirst({
    where: {
      id,
      user: {
        email: user.email,
      },
    },
    include: {
      items: true,
      containers: true,
    },
  });
  return Response.json({ location });
}

export async function DELETE(req) {
  const { user } = await getSession();
  const body = await req.json();
  let { id } = body;
  id = parseInt(id);

  try {
    await prisma.location.delete({
      where: {
        id,
        user: {
          email: user.email,
        },
      },
    });
  } catch (e) {
    throw new Error(e);
  }
  return NextResponse.json({ success: true }, { status: 200 });
}