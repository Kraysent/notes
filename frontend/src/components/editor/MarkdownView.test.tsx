import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MarkdownView from "./MarkdownView";

describe("MarkdownView", () => {
  it("renders simple text", () => {
    const markdown = "# Test Header";
    const setNote = vi.fn();
    render(<MarkdownView note={markdown} setNote={setNote} />);

    const header = screen.getByText("Test Header");
    expect(header).toBeInTheDocument();
    expect(setNote).not.toHaveBeenCalled();
  });

  it("renders checkboxes", () => {
    const note = `- [ ] First task
- [ ] Second task`;
    const setNote = vi.fn();
    render(<MarkdownView note={note} setNote={setNote} />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);
  });

  it("checkbox is checked when clicked", async () => {
    const user = userEvent.setup();
    const note = `# My Tasks

- [ ] First task
- [ ] Second task
- [ ] Third task`;
    const setNote = vi.fn();
    render(<MarkdownView note={note} setNote={setNote} />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThan(0);

    const firstCheckbox = checkboxes[1];
    expect(firstCheckbox).not.toBeChecked();

    await user.click(firstCheckbox);

    expect(setNote).toHaveBeenCalledTimes(1);
    const updatedNote = setNote.mock.calls[0][0];
    const expected = `# My Tasks

- [ ] First task
- [x] Second task
- [ ] Third task`;
    expect(updatedNote).toEqual(expected);
  });
});
