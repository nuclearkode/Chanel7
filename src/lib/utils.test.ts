import { expect, test, describe } from "bun:test"
import { cn } from "./utils"

describe("cn utility", () => {
  test("concatenates class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  test("handles conditional classes", () => {
    expect(cn("foo", true && "bar", false && "baz")).toBe("foo bar")
  })

  test("handles objects with multiple classes", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz")
  })

  test("handles arrays of classes", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz")
  })

  test("merges tailwind classes correctly", () => {
    expect(cn("px-2 py-2", "px-4")).toBe("py-2 px-4")
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
  })

  test("handles complex nested structures", () => {
    expect(
      cn("base", ["arr1", ["arr2"]], { obj1: true, obj2: false }, "final")
    ).toBe("base arr1 arr2 obj1 final")
  })

  test("handles empty inputs, null, and undefined", () => {
    expect(cn()).toBe("")
    expect(cn(undefined, null, false, "")).toBe("")
  })
})
