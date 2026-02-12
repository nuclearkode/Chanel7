import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
    createFormulaSchema,
    apiError,
    apiSuccess,
} from "@/lib/validations";

// GET /api/formulas — List all formulas
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
        const status = searchParams.get("status");
        const search = searchParams.get("search");

        const where: Record<string, unknown> = {};
        if (status) where.status = status;
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
            ];
        }

        const [formulas, total] = await Promise.all([
            prisma.formula.findMany({
                where,
                include: {
                    ingredients: {
                        include: {
                            ingredient: {
                                select: { slug: true, name: true, note: true },
                            },
                        },
                    },
                    _count: { select: { revisions: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { updatedAt: "desc" },
            }),
            prisma.formula.count({ where }),
        ]);

        return apiSuccess({
            formulas,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        if (error instanceof Error) return apiError(error.message);
        return apiError("Internal server error", 500);
    }
}

// POST /api/formulas — Create a new formula
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = createFormulaSchema.parse(body);

        // Resolve ingredient slugs to IDs
        const slugs = data.ingredients.map((i) => i.slug);
        const dbIngredients = await prisma.ingredient.findMany({
            where: { slug: { in: slugs } },
            select: { id: true, slug: true },
        });

        const slugToId = new Map(dbIngredients.map((i) => [i.slug, i.id]));

        // Validate all slugs resolved
        const missing = slugs.filter((s) => !slugToId.has(s));
        if (missing.length > 0) {
            return apiError(`Unknown ingredients: ${missing.join(", ")}`, 400);
        }

        const formula = await prisma.formula.create({
            data: {
                name: data.name,
                description: data.description,
                profile: data.profile,
                gender: data.gender,
                perfumeType: data.perfumeType,
                concentration: data.concentration,
                dilutant: data.dilutant,
                dilutantQty: data.dilutantQty,
                notes: data.notes,
                ingredients: {
                    create: data.ingredients.map((ing) => ({
                        ingredientId: slugToId.get(ing.slug)!,
                        quantity: ing.quantity,
                        concentration: ing.concentration,
                        dilutant: ing.dilutant,
                        excludeFromCalc: ing.excludeFromCalc,
                        notes: ing.notes,
                    })),
                },
                revisions: {
                    create: {
                        revision: 1,
                        data: JSON.stringify({ ingredients: data.ingredients }),
                        method: "Initial creation",
                    },
                },
            },
            include: {
                ingredients: {
                    include: {
                        ingredient: {
                            select: { slug: true, name: true, note: true },
                        },
                    },
                },
            },
        });

        return apiSuccess(formula, 201);
    } catch (error) {
        if (error instanceof Error) return apiError(error.message);
        return apiError("Internal server error", 500);
    }
}
