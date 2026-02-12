import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ifraCheckSchema, apiError, apiSuccess } from "@/lib/validations";

// POST /api/ifra/check — Check IFRA compliance
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = ifraCheckSchema.parse(body);

        // Resolve slugs to full ingredient records
        const slugs = data.ingredients.map((i) => i.slug);
        const dbIngredients = await prisma.ingredient.findMany({
            where: { slug: { in: slugs } },
        });

        const slugMap = new Map(dbIngredients.map((i) => [i.slug, i]));

        // Calculate total weight
        let totalWeight = data.dilutantQuantity;
        for (const ing of data.ingredients) {
            totalWeight += ing.quantity;
        }

        if (totalWeight === 0) {
            return apiSuccess({ compliant: true, violations: [], totalWeight: 0 });
        }

        // Check each ingredient against IFRA limit for the specified category
        const violations: {
            slug: string;
            name: string;
            cas: string | null;
            percentUsed: number;
            percentAllowed: number;
            category: string;
        }[] = [];

        for (const ing of data.ingredients) {
            const material = slugMap.get(ing.slug);
            if (!material || !material.ifraRestricted) continue;

            // Get the IFRA limit from the category field
            const catField = data.categoryId as keyof typeof material;
            const limit = material[catField] as number | undefined;
            if (limit === undefined || limit >= 100) continue;

            // Calculate percentage in finished product
            const conc = (ing.concentration ?? 100) / 100;
            const pureQty = ing.quantity * conc;
            const percentInProduct = (pureQty / totalWeight) * 100;

            if (percentInProduct > limit) {
                violations.push({
                    slug: ing.slug,
                    name: material.name,
                    cas: material.cas,
                    percentUsed: Math.round(percentInProduct * 10000) / 10000,
                    percentAllowed: limit,
                    category: data.categoryId,
                });
            }
        }

        return apiSuccess({
            compliant: violations.length === 0,
            violations,
            totalWeight,
            category: data.categoryId,
            ingredientCount: data.ingredients.length,
        });
    } catch (error) {
        if (error instanceof Error) return apiError(error.message);
        return apiError("Internal server error", 500);
    }
}
