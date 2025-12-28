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

export interface Position {
  line: number;
  column: number;
  offset: number;
}

export class StringSlice {
  startPos: Position;
  endPos: Position;

  constructor(startPos: Position, endPos: Position) {
    this.startPos = startPos;
    this.endPos = endPos;
  }
}

export function getStringSlice(slice: StringSlice, str: string): string {
  if (slice.startPos.offset < 0 || slice.endPos.offset < 0) {
    throw new Error(
      `Node position offsets cannot be negative (start: ${slice.startPos.offset}, end: ${slice.endPos.offset})`,
    );
  }

  if (slice.startPos.offset > slice.endPos.offset) {
    throw new Error(
      `Start offset (${slice.startPos.offset}) cannot be greater than end offset (${slice.endPos.offset})`,
    );
  }

  if (slice.startPos.offset >= str.length) {
    throw new Error(
      `Node position start offset (${slice.startPos.offset}) is out of bounds for the note (note length: ${str.length})`,
    );
  }

  if (slice.endPos.offset > str.length) {
    throw new Error(
      `Node position end offset (${slice.endPos.offset}) is out of bounds for the note (note length: ${str.length})`,
    );
  }

  return str.slice(slice.startPos.offset, slice.endPos.offset);
}
