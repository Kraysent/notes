import { describe, it, expect } from "vitest";
import { getOriginalCode, NodeInfo } from "./utils";

describe("getOriginalCode", () => {
  const note = "This is a test note with some content.";

  describe("with consistent info", () => {
    it("extracts correct substring from the beginning", () => {
      const node = new NodeInfo(
        { line: 1, column: 1, offset: 0 },
        { line: 1, column: 4, offset: 4 },
      );
      expect(getOriginalCode(node, note)).toBe("This");
    });

    it("extracts correct substring from the middle", () => {
      const node = new NodeInfo(
        { line: 1, column: 6, offset: 5 },
        { line: 1, column: 7, offset: 7 },
      );
      expect(getOriginalCode(node, note)).toBe("is");
    });

    it("extracts correct substring from the end", () => {
      const node = new NodeInfo(
        { line: 1, column: 31, offset: 30 },
        { line: 1, column: 37, offset: 37 },
      );
      expect(getOriginalCode(node, note)).toBe("content");
    });

    it("extracts entire note when offsets span full length", () => {
      const node = new NodeInfo(
        { line: 1, column: 1, offset: 0 },
        { line: 1, column: 40, offset: note.length },
      );
      expect(getOriginalCode(node, note)).toBe(note);
    });

    it("extracts empty string when start and end offsets are equal", () => {
      const node = new NodeInfo(
        { line: 1, column: 5, offset: 4 },
        { line: 1, column: 5, offset: 4 },
      );
      expect(getOriginalCode(node, note)).toBe("");
    });

    it("handles multi-line content correctly", () => {
      const multiLineNote = "Line 1\nLine 2\nLine 3";
      const node = new NodeInfo(
        { line: 1, column: 1, offset: 0 },
        { line: 2, column: 7, offset: 13 },
      );
      expect(getOriginalCode(node, multiLineNote)).toBe("Line 1\nLine 2");
    });
  });

  describe("with out of bounds info", () => {
    it("throws error when startPos.offset is negative", () => {
      const node = new NodeInfo(
        { line: 1, column: 1, offset: -1 },
        { line: 1, column: 4, offset: 4 },
      );
      expect(() => getOriginalCode(node, note)).toThrow("cannot be negative");
    });

    it("throws error when endPos.offset is negative", () => {
      const node = new NodeInfo(
        { line: 1, column: 1, offset: 0 },
        { line: 1, column: 4, offset: -1 },
      );
      expect(() => getOriginalCode(node, note)).toThrow("cannot be negative");
    });

    it("throws error when startPos.offset is greater than note length", () => {
      const node = new NodeInfo(
        { line: 1, column: 1, offset: 100 },
        { line: 1, column: 4, offset: 104 },
      );
      expect(() => getOriginalCode(node, note)).toThrow("out of bounds");
    });

    it("throws error when endPos.offset is greater than note length", () => {
      const node = new NodeInfo(
        { line: 1, column: 1, offset: 0 },
        { line: 1, column: 4, offset: 100 },
      );
      expect(() => getOriginalCode(node, note)).toThrow("out of bounds");
    });

    it("throws error when startPos.offset is greater than endPos.offset", () => {
      const node = new NodeInfo(
        { line: 1, column: 10, offset: 10 },
        { line: 1, column: 5, offset: 5 },
      );
      expect(() => getOriginalCode(node, note)).toThrow(
        "cannot be greater than end offset",
      );
    });

    it("allows endPos.offset equal to note length (exclusive end)", () => {
      const node = new NodeInfo(
        { line: 1, column: 1, offset: 0 },
        { line: 1, column: 40, offset: note.length },
      );
      expect(getOriginalCode(node, note)).toBe(note);
    });

    it("throws error when endPos.offset exceeds note length", () => {
      const node = new NodeInfo(
        { line: 1, column: 1, offset: 0 },
        { line: 1, column: 41, offset: note.length + 1 },
      );
      expect(() => getOriginalCode(node, note)).toThrow("out of bounds");
    });
  });
});
