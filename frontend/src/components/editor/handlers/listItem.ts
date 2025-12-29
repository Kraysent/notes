// eslint-disable-next-line @typescript-eslint/no-explicit-any
function listItemLoose(node: any) {
  const spread = node.spread;

  return spread === null || spread === undefined
    ? node.children.length > 1
    : spread;
}

import { gatherPosition } from "../../../utils";

// source: https://github.com/syntax-tree/mdast-util-to-hast/blob/main/lib/handlers/list-item.js
// altered to add line position of the original element
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function listItem(state: any, node: any) {
  const results = state.all(node);
  const loose = listItemLoose(node);
  /** @type {Properties} */
  const properties = { ...gatherPosition(node) };
  /** @type {Array<ElementContent>} */
  const children = [];

  if (typeof node.checked === "boolean") {
    const head = results[0];
    /** @type {Element} */
    let paragraph;

    if (head && head.type === "element" && head.tagName === "p") {
      paragraph = head;
    } else {
      paragraph = {
        type: "element",
        tagName: "p",
        properties: {},
        children: [],
      };
      results.unshift(paragraph);
    }

    if (paragraph.children.length > 0) {
      paragraph.children.unshift({ type: "text", value: " " });
    }

    paragraph.children.unshift({
      type: "element",
      tagName: "input",
      properties: {
        type: "checkbox",
        checked: node.checked,
        disabled: true,
        ...gatherPosition(node),
      },
      children: [],
    });

    // According to github-markdown-css, this class hides bullet.
    // See: <https://github.com/sindresorhus/github-markdown-css>.
    (properties as { className?: string[] }).className = ["task-list-item"];
  }

  let index = -1;

  while (++index < results.length) {
    const child = results[index];

    // Add eols before nodes, except if this is a loose, first paragraph.
    if (
      loose ||
      index !== 0 ||
      child.type !== "element" ||
      child.tagName !== "p"
    ) {
      children.push({ type: "text", value: "\n" });
    }

    if (child.type === "element" && child.tagName === "p" && !loose) {
      children.push(...child.children);
    } else {
      children.push(child);
    }
  }

  const tail = results[results.length - 1];

  // Add a final eol.
  if (tail && (loose || tail.type !== "element" || tail.tagName !== "p")) {
    children.push({ type: "text", value: "\n" });
  }

  /** @type {Element} */
  const result = { type: "element", tagName: "li", properties, children };
  state.patch(node, result);
  return state.applyData(node, result);
}
