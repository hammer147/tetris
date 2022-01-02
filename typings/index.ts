export type Shape = ('I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z' | 0)[][]

export type Color = string

export interface Tetromino {
  shape: Shape
  color: Color
}
export interface Tetrominos {
  readonly 0: Tetromino
  readonly I: Tetromino
  readonly J: Tetromino
  readonly L: Tetromino
  readonly O: Tetromino
  readonly S: Tetromino
  readonly T: Tetromino
  readonly Z: Tetromino
  readonly [index: number]: Tetromino
  readonly [index: string]: Tetromino
}

// T prefix to avoid name coll with Cell
export type TCell = [0 | 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z', 'clear' | 'merged']

export interface Player {
  pos: {
    x: number
    y: number
  }
  tetromino: Shape
  collided: boolean
}
