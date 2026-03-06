// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { EntryForm } from "@/generated/prisma/client";

// const DEV_USER_ID = "dev-user-id";

// /**
//  * Basic normalization for search.
//  * We can improve this later if needed.
//  */
// function normalizeTerm(term: string) {
//   return term
//     .trim()
//     .toLowerCase()
//     .normalize("NFD")
//     .replace(/\p{Diacritic}/gu, "");
// }

// export async function GET() {
//   try {
//     const entries = await prisma.entry.findMany({
//       where: {
//         userId: DEV_USER_ID,
//         deletedAt: null,
//       },
//       orderBy: {
//         updatedAt: "desc",
//       },
//       include: {
//         primaryDefinition: true,
//         _count: {
//           select: {
//             definitions: true,
//             entryTags: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json(entries);
//   } catch (error) {
//     console.error("Failed to fetch entries:", error);

//     return NextResponse.json(
//       { error: "Failed to fetch entries." },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     const rawTerm =
//       typeof body.term === "string" ? body.term.trim() : "";

//     const notes =
//       typeof body.notes === "string" && body.notes.trim().length > 0
//         ? body.notes.trim()
//         : null;

//     const form =
//       typeof body.form === "string" &&
//       Object.values(EntryForm).includes(body.form as EntryForm)
//         ? (body.form as EntryForm)
//         : EntryForm.not_sure;

//     if (!rawTerm) {
//       return NextResponse.json(
//         { error: "Term is required." },
//         { status: 400 }
//       );
//     }

//     const entry = await prisma.entry.create({
//       data: {
//         userId: DEV_USER_ID,
//         term: rawTerm,
//         termNormalized: normalizeTerm(rawTerm),
//         form,
//         notes,
//       },
//     });

//     return NextResponse.json(entry, { status: 201 });
//   } catch (error) {
//     console.error("Failed to create entry:", error);

//     return NextResponse.json(
//       { error: "Failed to create entry." },
//       { status: 500 }
//     );
//   }
// }
