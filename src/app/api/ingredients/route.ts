import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
    ingredientQuerySchema,
    parseSearchParams,
    apiError,
    apiSuccess,
} from "@/lib/validations";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = parseSearchParams(ingredientQuerySchema, searchParams);

        const where: Record<string, unknown> = {};

        if (query.search) {
            where.OR = [
                { name: { contains: query.search } },
                { scent: { contains: query.search } },
                { cas: { contains: query.search } },
                { slug: { contains: query.search } },
            ];
        }

        if (query.note) {
            where.note = query.note;
        }

        if (query.solvent !== undefined) {
            where.isSolvent = query.solvent === "true";
        }

        if (query.ifra !== undefined) {
            where.ifraRestricted = query.ifra === "true";
        }

        const [ingredients, total] = await Promise.all([
            prisma.ingredient.findMany({
                where,
                include: { tags: { select: { tag: true } } },
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: { name: "asc" },
            }),
            prisma.ingredient.count({ where }),
        ]);

        const formatted = ingredients.map((ing) => ({
            ...ing,
            tags: ing.tags.map((t) => t.tag),
        }));

        return apiSuccess({
            ingredients: formatted,
            pagination: {
                page: query.page,
                limit: query.limit,
                total,
                pages: Math.ceil(total / query.limit),
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            return apiError(error.message);
        }
        return apiError("Internal server error", 500);
    }
}
