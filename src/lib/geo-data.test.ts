
import { describe, it, expect } from "bun:test";
import { getIngredientOrigin } from "./geo-data";

describe("Geo Data Utility", () => {
  it("should return correct origin for known ingredients", () => {
    const roseOrigin = getIngredientOrigin("Rose Absolute");
    expect(roseOrigin).not.toBeNull();
    expect(roseOrigin?.country).toBe("Bulgaria");

    const jasmineOrigin = getIngredientOrigin("Jasmine Sambac");
    expect(jasmineOrigin).not.toBeNull();
    expect(jasmineOrigin?.country).toBe("India");
  });

  it("should return null for unknown ingredients", () => {
    const unknownOrigin = getIngredientOrigin("Unobtainium");
    expect(unknownOrigin).toBeNull();
  });

  it("should handle case insensitivity", () => {
    const vanillaOrigin = getIngredientOrigin("vanilla bean");
    expect(vanillaOrigin).not.toBeNull();
    expect(vanillaOrigin?.country).toBe("Madagascar");
  });
});
