import { gatherPosition } from "../../../utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function heading(state: any, node: any) {
  const result = {
    type: "element",
    tagName: "h" + node.depth,
    properties: { ...gatherPosition(node) },
    children: state.all(node),
  };
  state.patch(node, result);
  return state.applyData(node, result);
}
