import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MarkdownView from "./MarkdownView";

describe("MarkdownView", () => {
  it("renders a single header in the result", () => {
    const markdown = "# Test Header";
    render(<MarkdownView note={markdown} />);

    const header = screen.getByText("Test Header");
    expect(header).toBeInTheDocument();
  });
});
