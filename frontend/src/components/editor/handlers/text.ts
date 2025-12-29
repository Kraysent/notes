import { gatherPosition } from "../../../utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function text(state: any, node: any) {
  const result = {
    type: "element",
    tagName: "span",
    properties: { ...gatherPosition(node) },
    children: [{ type: "text", value: node.value }],
  };
  state.patch(node, result);
  return state.applyData(node, result);
}
