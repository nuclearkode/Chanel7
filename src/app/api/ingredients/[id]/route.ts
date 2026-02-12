import { prisma } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/validations";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Support both numeric ID and slug lookup
        const isNumeric = /^\d+$/.test(id);
        const ingredient = await prisma.ingredient.findFirst({
            where: isNumeric ? { id: parseInt(id) } : { slug: id },
            include: { tags: { select: { tag: true } } },
        });

        if (!ingredient) {
            return apiError("Ingredient not found", 404);
        }

        return apiSuccess({
            ...ingredient,
            tags: ingredient.tags.map((t) => t.tag),
        });
    } catch (error) {
        if (error instanceof Error) {
            return apiError(error.message);
        }
        return apiError("Internal server error", 500);
    }
}
