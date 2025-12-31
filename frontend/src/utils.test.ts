import { describe, it, expect } from "vitest";
import {
  getStringSlice,
  StringSlice,
  toggleCheckbox,
  generateSlug,
} from "./utils";

describe("getStringSlice", () => {
  const note = "This is a test note with some content.";

  it("test", () => {
    const note = `Checks:
- [ ] one
- [x] two
`;

    const node = new StringSlice({ offset: 8 }, { offset: 17 });

    expect(getStringSlice(node, note)).toBe("- [ ] one");
  });

  describe("happy path", () => {
    it("extracts correct substring from the beginning", () => {
      const node = new StringSlice({ offset: 0 }, { offset: 4 });
      expect(getStringSlice(node, note)).toBe("This");
    });

    it("extracts correct substring from the middle", () => {
      const node = new StringSlice({ offset: 5 }, { offset: 7 });
      expect(getStringSlice(node, note)).toBe("is");
    });

    it("extracts correct substring from the end", () => {
      const node = new StringSlice({ offset: 30 }, { offset: 37 });
      expect(getStringSlice(node, note)).toBe("content");
    });

    it("extracts entire note when offsets span full length", () => {
      const node = new StringSlice({ offset: 0 }, { offset: note.length });
      expect(getStringSlice(node, note)).toBe(note);
    });

    it("extracts empty string when start and end offsets are equal", () => {
      const node = new StringSlice({ offset: 4 }, { offset: 4 });
      expect(getStringSlice(node, note)).toBe("");
    });

    it("handles multi-line content correctly", () => {
      const multiLineNote = "Line 1\nLine 2\nLine 3";
      const node = new StringSlice({ offset: 0 }, { offset: 13 });
      expect(getStringSlice(node, multiLineNote)).toBe("Line 1\nLine 2");
    });
  });

  describe("unhappy path", () => {
    it("throws error when startPos.offset is negative", () => {
      const node = new StringSlice({ offset: -1 }, { offset: 4 });
      expect(() => getStringSlice(node, note)).toThrow("cannot be negative");
    });

    it("throws error when endPos.offset is negative", () => {
      const node = new StringSlice({ offset: 0 }, { offset: -1 });
      expect(() => getStringSlice(node, note)).toThrow("cannot be negative");
    });

    it("throws error when startPos.offset is greater than note length", () => {
      const node = new StringSlice({ offset: 100 }, { offset: 104 });
      expect(() => getStringSlice(node, note)).toThrow("out of bounds");
    });

    it("throws error when endPos.offset is greater than note length", () => {
      const node = new StringSlice({ offset: 0 }, { offset: 100 });
      expect(() => getStringSlice(node, note)).toThrow("out of bounds");
    });

    it("throws error when startPos.offset is greater than endPos.offset", () => {
      const node = new StringSlice({ offset: 10 }, { offset: 5 });
      expect(() => getStringSlice(node, note)).toThrow(
        "cannot be greater than end offset",
      );
    });

    it("allows endPos.offset equal to note length (exclusive end)", () => {
      const node = new StringSlice({ offset: 0 }, { offset: note.length });
      expect(getStringSlice(node, note)).toBe(note);
    });

    it("throws error when endPos.offset exceeds note length", () => {
      const node = new StringSlice({ offset: 0 }, { offset: note.length + 1 });
      expect(() => getStringSlice(node, note)).toThrow("out of bounds");
    });
  });
});

describe("toggleCheckbox", () => {
  it("toggles unchecked checkbox to checked", () => {
    const content = "- [ ] checkbox 1";
    const result = toggleCheckbox(content);
    expect(result).toBe("- [x] checkbox 1");
  });

  it("toggles checked checkbox to unchecked", () => {
    const content = "- [x] checkbox 2";
    const result = toggleCheckbox(content);
    expect(result).toBe("- [ ] checkbox 2");
  });

  it("throws error when no checkbox pattern is found", () => {
    const content = "This is not a checkbox line";
    expect(() => toggleCheckbox(content)).toThrow(
      "No checkbox pattern found in the content",
    );
  });

  it("handles checkbox with indentation", () => {
    const content = "  - [ ] indented checkbox";
    const result = toggleCheckbox(content);
    expect(result).toBe("  - [x] indented checkbox");
  });
});

describe("generateSlug", () => {
  it("converts simple title to lowercase slug", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("converts title with special characters", () => {
    expect(generateSlug("Hello, World!")).toBe("hello-world");
  });

  it("handles multiple spaces", () => {
    expect(generateSlug("Hello    World")).toBe("hello-world");
  });

  it("removes leading and trailing spaces", () => {
    expect(generateSlug("  Hello World  ")).toBe("hello-world");
  });

  it("handles consecutive dashes", () => {
    expect(generateSlug("Hello---World")).toBe("hello-world");
  });

  it("removes leading and trailing dashes", () => {
    expect(generateSlug("-Hello World-")).toBe("hello-world");
  });

  it("handles Unicode characters with diacritics", () => {
    expect(generateSlug("Café")).toBe("cafe");
    expect(generateSlug("Résumé")).toBe("resume");
    expect(generateSlug("Naïve")).toBe("naive");
  });

  it("handles numbers", () => {
    expect(generateSlug("Note 123")).toBe("note-123");
    expect(generateSlug("2024 Review")).toBe("2024-review");
  });

  it("handles mixed case", () => {
    expect(generateSlug("My Note Title")).toBe("my-note-title");
    expect(generateSlug("MY NOTE TITLE")).toBe("my-note-title");
  });

  it("handles special symbols", () => {
    expect(generateSlug("Note @#$%^&*()")).toBe("note");
    expect(generateSlug("Hello-World!")).toBe("hello-world");
    expect(generateSlug("Test/Note")).toBe("testnote");
  });

  it("handles empty string", () => {
    expect(generateSlug("")).toBe("");
  });

  it("handles string with only special characters", () => {
    expect(generateSlug("!@#$%")).toBe("");
  });

  it("handles string with only spaces", () => {
    expect(generateSlug("   ")).toBe("");
  });

  it("handles title with parentheses", () => {
    expect(generateSlug("Note (Important)")).toBe("note-important");
  });

  it("handles title with brackets", () => {
    expect(generateSlug("Note [Draft]")).toBe("note-draft");
  });

  it("handles title with quotes", () => {
    expect(generateSlug('Note "Draft"')).toBe("note-draft");
  });

  it("handles title with colons and semicolons", () => {
    expect(generateSlug("Note: Important; Draft")).toBe("note-important-draft");
  });

  it("handles title with question marks and exclamation marks", () => {
    expect(generateSlug("What is this? Important!")).toBe(
      "what-is-this-important",
    );
  });
});
