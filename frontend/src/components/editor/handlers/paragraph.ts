import { gatherPosition } from "../../../utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function paragraph(state: any, node: any) {
  const result = {
    type: "element",
    tagName: "p",
    properties: { ...gatherPosition(node) },
    children: state.all(node),
  };
  state.patch(node, result);
  return state.applyData(node, result);
}
