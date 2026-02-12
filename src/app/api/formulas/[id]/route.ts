import { prisma } from "@/lib/db";
import { updateFormulaSchema, apiError, apiSuccess } from "@/lib/validations";

// GET /api/formulas/[id] — Get a single formula
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Support UUID (fid) or numeric ID
        const isNumeric = /^\d+$/.test(id);
        const formula = await prisma.formula.findFirst({
            where: isNumeric ? { id: parseInt(id) } : { fid: id },
            include: {
                ingredients: {
                    include: {
                        ingredient: {
                            select: {
                                slug: true, name: true, note: true, scent: true,
                                isSolvent: true, ifraRestricted: true, impact: true,
                                longevity: true, maxInProduct: true,
                            },
                        },
                    },
                },
                revisions: {
                    orderBy: { revision: "desc" },
                    take: 5,
                },
            },
        });

        if (!formula) {
            return apiError("Formula not found", 404);
        }

        return apiSuccess(formula);
    } catch (error) {
        if (error instanceof Error) return apiError(error.message);
        return apiError("Internal server error", 500);
    }
}

// PUT /api/formulas/[id] — Update a formula
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const data = updateFormulaSchema.parse(body);

        const isNumeric = /^\d+$/.test(id);
        const existing = await prisma.formula.findFirst({
            where: isNumeric ? { id: parseInt(id) } : { fid: id },
        });

        if (!existing) {
            return apiError("Formula not found", 404);
        }

        // Build update data (only non-undefined fields)
        const updateData: Record<string, unknown> = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.profile !== undefined) updateData.profile = data.profile;
        if (data.gender !== undefined) updateData.gender = data.gender;
        if (data.perfumeType !== undefined) updateData.perfumeType = data.perfumeType;
        if (data.concentration !== undefined) updateData.concentration = data.concentration;
        if (data.dilutant !== undefined) updateData.dilutant = data.dilutant;
        if (data.dilutantQty !== undefined) updateData.dilutantQty = data.dilutantQty;
        if (data.status !== undefined) updateData.status = data.status;
        if (data.rating !== undefined) updateData.rating = data.rating;
        if (data.notes !== undefined) updateData.notes = data.notes;

        // If ingredients are provided, replace them
        if (data.ingredients) {
            const slugs = data.ingredients.map((i) => i.slug);
            const dbIngredients = await prisma.ingredient.findMany({
                where: { slug: { in: slugs } },
                select: { id: true, slug: true },
            });

            const slugToId = new Map(dbIngredients.map((i) => [i.slug, i.id]));
            const missing = slugs.filter((s) => !slugToId.has(s));
            if (missing.length > 0) {
                return apiError(`Unknown ingredients: ${missing.join(", ")}`, 400);
            }

            // Delete old ingredients and create new ones
            await prisma.formulaIngredient.deleteMany({
                where: { formulaId: existing.id },
            });

            updateData.ingredients = {
                create: data.ingredients.map((ing) => ({
                    ingredientId: slugToId.get(ing.slug)!,
                    quantity: ing.quantity,
                    concentration: ing.concentration ?? 100,
                    dilutant: ing.dilutant,
                    excludeFromCalc: ing.excludeFromCalc ?? false,
                    notes: ing.notes,
                })),
            };

            // Create revision snapshot
            const lastRevision = await prisma.formulaRevision.findFirst({
                where: { formulaId: existing.id },
                orderBy: { revision: "desc" },
            });

            await prisma.formulaRevision.create({
                data: {
                    formulaId: existing.id,
                    revision: (lastRevision?.revision ?? 0) + 1,
                    data: JSON.stringify({ ingredients: data.ingredients }),
                    method: "Updated ingredients",
                },
            });
        }

        const formula = await prisma.formula.update({
            where: { id: existing.id },
            data: updateData,
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

        return apiSuccess(formula);
    } catch (error) {
        if (error instanceof Error) return apiError(error.message);
        return apiError("Internal server error", 500);
    }
}

// DELETE /api/formulas/[id] — Delete a formula
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const isNumeric = /^\d+$/.test(id);
        const existing = await prisma.formula.findFirst({
            where: isNumeric ? { id: parseInt(id) } : { fid: id },
        });

        if (!existing) {
            return apiError("Formula not found", 404);
        }

        await prisma.formula.delete({ where: { id: existing.id } });

        return apiSuccess({ deleted: true });
    } catch (error) {
        if (error instanceof Error) return apiError(error.message);
        return apiError("Internal server error", 500);
    }
}
