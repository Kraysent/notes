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

// this function needs to return a flat kv set since
// they are encoded as custom fields in the DOM directly which does
// not support nested objects and converts them into [Object object]
//
// thanks a lot to https://dev.to/wangpin34/how-to-retain-position-of-markdown-element-in-remarkjs-k8m
// for the explaintation on how and why to do this
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

export function getOriginalCode(node: NodeInfo, note: string): string {
  if (node.startPos.offset < 0 || node.endPos.offset < 0) {
    throw new Error(
      `Node position offsets cannot be negative (start: ${node.startPos.offset}, end: ${node.endPos.offset})`,
    );
  }

  if (node.startPos.offset > node.endPos.offset) {
    throw new Error(
      `Start offset (${node.startPos.offset}) cannot be greater than end offset (${node.endPos.offset})`,
    );
  }

  if (node.startPos.offset >= note.length) {
    throw new Error(
      `Node position start offset (${node.startPos.offset}) is out of bounds for the note (note length: ${note.length})`,
    );
  }

  if (node.endPos.offset > note.length) {
    throw new Error(
      `Node position end offset (${node.endPos.offset}) is out of bounds for the note (note length: ${note.length})`,
    );
  }

  return note.slice(node.startPos.offset, node.endPos.offset);
}
