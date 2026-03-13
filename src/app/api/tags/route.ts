import { Prisma } from "@/generated/prisma/client";
import { ApiError } from "@/lib/errors/api-errors";
import { getSessionUser } from "@/lib/get-session-user";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { NextRequest } from "next/server";
import z from "zod";

//list all the tags
export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();

  try {
    const tags = await prisma.tag.findMany({
      where: {
        userId: user.id,
      },
      orderBy: { slug: "asc" },
    });
    return Response.json({ data: tags });
  } catch (error) {
    console.error("GET /tags error:", error);
    return ApiError.internal();
  }
}

const CreateTagSchema = z.object({
  name: z.string().min(1).trim(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
});

export async function POST(request: NextRequest) {
  //1 - check user
  const user = await getSessionUser();
  if (!user) return ApiError.unauthorized();

  //2 - Check payload format
  const body = await request.json();
  const parsed = CreateTagSchema.safeParse(body);
  if (!parsed.success) return ApiError.badRequest();
  const data = parsed.data;

  //3 - Normalize term
  const slug = slugify(data.name);

  //4 - Create the entry
  try {
    const tag = await prisma.tag.create({
      data: {
        userId: user.id,
        name: data.name,
        color: data.color,
        slug: slug,
      },
    });

    return Response.json({ data: tag });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return ApiError.badRequest("tag-already-exists");
    }
    console.error("POST /tags error:", error);
    return ApiError.internal();
  }
}
