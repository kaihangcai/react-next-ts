import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { username, password, alias } = await request.json();

  const errors: Record<string, string> = {};
  if (!username?.trim()) errors.username = "Invalid username";
  if (!password?.trim()) errors.password = "Invalid password";
  if (!alias?.trim()) errors.alias = "Invalid alias";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { message: "User signup failed due to validation errors.", errors },
      { status: 422 }
    );
  }

  const existingByUsername = await prisma.user.findUnique({ where: { username } });
  if (existingByUsername) {
    return NextResponse.json(
      { message: "User signup failed due to validation errors.", errors: { username: "Username already exists" } },
      { status: 422 }
    );
  }

  const existingByAlias = await prisma.user.findFirst({ where: { alias } });
  if (existingByAlias) {
    return NextResponse.json(
      { message: "User signup failed due to validation errors.", errors: { alias: "Alias is already in use" } },
      { status: 422 }
    );
  }

  const hashedPw = await hash(password, 12);
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPw,
      alias,
      scores: { create: {} },
    },
  });

  return NextResponse.json(
    { message: "Successfully signed up!", id: user.id, alias: user.alias },
    { status: 201 }
  );
}
