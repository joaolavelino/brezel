import { describe, expect, it } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("lowercase the term", () => {
    expect(slugify("Haus")).toBe("haus");
  });
  it("trims leading and trailing spaces", () => {
    expect(slugify("  laufen  ")).toBe("laufen");
  });
  it("exchanges spaces into dashes", () => {
    expect(slugify("zum Beispiel")).toBe("zum-beispiel");
  });
  it("collapses multiple spaces into a single dash", () => {
    expect(slugify("zum  Beispiel")).toBe("zum-beispiel");
  });
  it("DOES NOT preserve umlauts ", () => {
    expect(slugify("schön")).toBe("schon");
    expect(slugify("über")).toBe("uber");
    expect(slugify("möchten")).toBe("mochten");
  });
  it("DOES NOT preserve eszett", () => {
    expect(slugify("Straße")).toBe("strasse");
  });
  it("handles an empty string", () => {
    expect(slugify("")).toBe("");
  });
});
