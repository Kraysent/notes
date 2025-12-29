import { gatherPosition } from "../../../utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function link(state: any, node: any) {
  const result = {
    type: "element",
    tagName: "a",
    properties: { ...gatherPosition(node) },
    children: state.all(node),
  };
  state.patch(node, result);
  return state.applyData(node, result);
}
