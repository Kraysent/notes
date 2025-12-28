export interface Position {
  line: number;
  column: number;
  offset: number;
}

export class NodeInfo {
  startPos: Position;
  endPos: Position;

  constructor(startPos: Position, endPos: Position) {
    this.startPos = startPos;
    this.endPos = endPos;
  }
}

// this function needs to return a flat kv map of values since 
// they are encoded as custom fields in the DOM directly which does 
// not support nested objects and converts them into [Object object]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function gatherPosition(node: any) {
    return {
      [`data-startline`]: node.position.start.line,
      [`data-startcolumn`]: node.position.start.column,
      [`data-startoffset`]: node.position.start.offset,
      [`data-endline`]: node.position.end.line,
      [`data-endcolumn`]: node.position.end.column,
      [`data-endoffset`]: node.position.end.offset,
    };
  }
  