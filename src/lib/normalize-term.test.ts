import { describe, it, expect } from "vitest";
import { normalizeTerm } from "@/lib/normalize-term";

describe("normalizeTerm", () => {
  it("lowercases the term", () => {
    expect(normalizeTerm("Haus")).toBe("haus");
  });

  it("trims leading and trailing spaces", () => {
    expect(normalizeTerm("  laufen  ")).toBe("laufen");
  });

  it("collapses multiple spaces into one", () => {
    expect(normalizeTerm("zum  Glück")).toBe("zum glück");
  });

  it("preserves umlauts", () => {
    expect(normalizeTerm("schön")).toBe("schön");
    expect(normalizeTerm("über")).toBe("über");
    expect(normalizeTerm("möchten")).toBe("möchten");
  });

  it("preserves eszett", () => {
    expect(normalizeTerm("Straße")).toBe("straße");
  });

  it("does not confuse schön and schon", () => {
    expect(normalizeTerm("schön")).not.toBe(normalizeTerm("schon"));
  });

  it("handles already normalized input", () => {
    expect(normalizeTerm("laufen")).toBe("laufen");
  });

  it("handles an empty string", () => {
    expect(normalizeTerm("")).toBe("");
  });
});
