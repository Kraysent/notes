import { describe, it, expect } from "vitest";
import { getStringSlice, StringSlice, toggleCheckbox } from "./utils";

describe("getOriginalCode", () => {
  const note = "This is a test note with some content.";

  describe("with consistent info", () => {
    it("extracts correct substring from the beginning", () => {
      const node = new StringSlice(
        { line: 1, column: 1, offset: 0 },
        { line: 1, column: 4, offset: 4 }
      );
      expect(getStringSlice(node, note)).toBe("This");
    });

    it("extracts correct substring from the middle", () => {
      const node = new StringSlice(
        { line: 1, column: 6, offset: 5 },
        { line: 1, column: 7, offset: 7 }
      );
      expect(getStringSlice(node, note)).toBe("is");
    });

    it("extracts correct substring from the end", () => {
      const node = new StringSlice(
        { line: 1, column: 31, offset: 30 },
        { line: 1, column: 37, offset: 37 }
      );
      expect(getStringSlice(node, note)).toBe("content");
    });

    it("extracts entire note when offsets span full length", () => {
      const node = new StringSlice(
        { line: 1, column: 1, offset: 0 },
        { line: 1, column: 40, offset: note.length }
      );
      expect(getStringSlice(node, note)).toBe(note);
    });

    it("extracts empty string when start and end offsets are equal", () => {
      const node = new StringSlice(
        { line: 1, column: 5, offset: 4 },
        { line: 1, column: 5, offset: 4 }
      );
      expect(getStringSlice(node, note)).toBe("");
    });

    it("handles multi-line content correctly", () => {
      const multiLineNote = "Line 1\nLine 2\nLine 3";
      const node = new StringSlice(
        { line: 1, column: 1, offset: 0 },
        { line: 2, column: 7, offset: 13 }
      );
      expect(getStringSlice(node, multiLineNote)).toBe("Line 1\nLine 2");
    });
  });

  describe("with out of bounds info", () => {
    it("throws error when startPos.offset is negative", () => {
      const node = new StringSlice(
        { line: 1, column: 1, offset: -1 },
        { line: 1, column: 4, offset: 4 }
      );
      expect(() => getStringSlice(node, note)).toThrow("cannot be negative");
    });

    it("throws error when endPos.offset is negative", () => {
      const node = new StringSlice(
        { line: 1, column: 1, offset: 0 },
        { line: 1, column: 4, offset: -1 }
      );
      expect(() => getStringSlice(node, note)).toThrow("cannot be negative");
    });

    it("throws error when startPos.offset is greater than note length", () => {
      const node = new StringSlice(
        { line: 1, column: 1, offset: 100 },
        { line: 1, column: 4, offset: 104 }
      );
      expect(() => getStringSlice(node, note)).toThrow("out of bounds");
    });

    it("throws error when endPos.offset is greater than note length", () => {
      const node = new StringSlice(
        { line: 1, column: 1, offset: 0 },
        { line: 1, column: 4, offset: 100 }
      );
      expect(() => getStringSlice(node, note)).toThrow("out of bounds");
    });

    it("throws error when startPos.offset is greater than endPos.offset", () => {
      const node = new StringSlice(
        { line: 1, column: 10, offset: 10 },
        { line: 1, column: 5, offset: 5 }
      );
      expect(() => getStringSlice(node, note)).toThrow(
        "cannot be greater than end offset"
      );
    });

    it("allows endPos.offset equal to note length (exclusive end)", () => {
      const node = new StringSlice(
        { line: 1, column: 1, offset: 0 },
        { line: 1, column: 40, offset: note.length }
      );
      expect(getStringSlice(node, note)).toBe(note);
    });

    it("throws error when endPos.offset exceeds note length", () => {
      const node = new StringSlice(
        { line: 1, column: 1, offset: 0 },
        { line: 1, column: 41, offset: note.length + 1 }
      );
      expect(() => getStringSlice(node, note)).toThrow("out of bounds");
    });
  });
});

describe("toggleCheckbox", () => {
  it("toggles unchecked checkbox to checked", () => {
    const markdown = "Test note text\n- [ ] checkbox 1\n- [x] checkbox 2";
    const slice = new StringSlice(
      { line: 2, column: 1, offset: 15 },
      { line: 2, column: 17, offset: 31 }
    );
    const result = toggleCheckbox(slice, markdown);
    expect(result).toBe("Test note text\n- [x] checkbox 1\n- [x] checkbox 2");
  });

  it("toggles checked checkbox to unchecked", () => {
    const markdown = "Test note text\n- [ ] checkbox 1\n- [x] checkbox 2";
    const slice = new StringSlice(
      { line: 3, column: 1, offset: 32 },
      { line: 3, column: 17, offset: 48 }
    );
    const result = toggleCheckbox(slice, markdown);
    expect(result).toBe("Test note text\n- [ ] checkbox 1\n- [ ] checkbox 2");
  });

  it("handles checkbox at the beginning of the note", () => {
    const markdown = "- [ ] first checkbox\nSome text";
    const slice = new StringSlice(
      { line: 1, column: 1, offset: 0 },
      { line: 1, column: 20, offset: 19 }
    );
    const result = toggleCheckbox(slice, markdown);
    expect(result).toBe("- [x] first checkbox\nSome text");
  });

  it("handles checkbox at the end of the note", () => {
    const markdown = "Some text\n- [x] last checkbox";
    const slice = new StringSlice(
      { line: 2, column: 1, offset: 10 },
      { line: 2, column: 20, offset: 29 }
    );
    const result = toggleCheckbox(slice, markdown);
    expect(result).toBe("Some text\n- [ ] last checkbox");
  });

  it("handles multiple checkboxes and only toggles the one in the slice", () => {
    const markdown = "- [ ] first\n- [x] second\n- [ ] third";
    const slice = new StringSlice(
      { line: 2, column: 1, offset: 12 },
      { line: 2, column: 14, offset: 24 }
    );
    const result = toggleCheckbox(slice, markdown);
    expect(result).toBe("- [ ] first\n- [ ] second\n- [ ] third");
  });

  it("throws error when no checkbox pattern is found", () => {
    const markdown = "This is not a checkbox line";
    const slice = new StringSlice(
      { line: 1, column: 1, offset: 0 },
      { line: 1, column: 28, offset: 27 }
    );
    expect(() => toggleCheckbox(slice, markdown)).toThrow(
      "No checkbox pattern found in the slice"
    );
  });

  it("handles checkbox with indentation", () => {
    const markdown = "  - [ ] indented checkbox";
    const slice = new StringSlice(
      { line: 1, column: 1, offset: 0 },
      { line: 1, column: 26, offset: 25 }
    );
    const result = toggleCheckbox(slice, markdown);
    expect(result).toBe("  - [x] indented checkbox");
  });
});
