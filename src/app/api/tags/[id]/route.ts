import { ApiError } from "@/lib/errors/api-errors";
import { getSessionUser } from "@/lib/get-session-user";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { NextRequest } from "next/server";
import z from "zod";
import { Prisma } from "@/generated/prisma/client";

const EditTagSchema = z.object({
  name: z.string().min(1).trim().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .nullable()
    .optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  //1 - Check user
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();

  //2- Get and validate the ID from the url
  const { id: tagId } = await params;
  if (!z.cuid().safeParse(tagId).success) {
    return ApiError.badRequest("invalid-url");
  }

  //3- Get and validate the payload
  const body = await request.json();
  const parsed = EditTagSchema.safeParse(body);
  if (!parsed.success) {
    console.log(parsed.error);
    return ApiError.badRequest();
  }
  const data = parsed.data;

  //4- Edit the tag
  try {
    const tag = await prisma.tag.update({
      where: {
        id: tagId,
        userId: user.id,
      },
      data: {
        name: data.name,
        slug: data.name ? slugify(data.name) : undefined,
        color: data.color,
      },
    });

    return Response.json({ data: tag });
  } catch (error) {
    //duplication error
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return ApiError.badRequest("tag-name-exists");
    }
    //not found on the prisma operation
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return ApiError.notFound();
    }
    console.error("PATCH /tags error:", error);
    return ApiError.internal();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  //1 - Check user
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();

  //2- Get and validate the ID from the url
  const { id: tagId } = await params;
  if (!z.cuid().safeParse(tagId).success) {
    return ApiError.badRequest("invalid-url");
  }

  try {
    const tag = await prisma.tag.delete({
      where: {
        id: tagId,
        userId: user.id,
      },
    });

    return Response.json({ data: { name: tag.name } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return ApiError.notFound();
    }
    console.error("DELETE /tags error:", error);
    return ApiError.internal();
  }
}
