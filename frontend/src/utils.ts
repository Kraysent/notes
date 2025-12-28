export interface Position {
    line: number
    column: number
    offset: number
}

export class NodeInfo {
    startPos: Position;
    endPos: Position;

    constructor(startPos: Position, endPos: Position) {
        this.startPos = startPos;
        this.endPos = endPos;
    }
}
