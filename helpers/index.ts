import { Player, TCell } from '../typings'

export const STAGE_WIDTH = 12
export const STAGE_HEIGHT = 20

export const createStage = (): TCell[][] =>
  Array.from(
    Array(STAGE_HEIGHT),
    () => new Array(STAGE_WIDTH).fill([0, 'clear'])
  )

export const willCollide =
  (player: Player, stage: TCell[][], { x: moveX, y: moveY }: { x: number; y: number }): boolean => {
    for (let y = 0; y < player.tetromino.length; y++) {
      for (let x = 0; x < player.tetromino[y].length; x++) {
        // 1. check that we are on a tetromino cell
        if (player.tetromino[y][x] !== 0) {
          if (
            // 2. check that our move is inside the game area height (y) i.e. don't pass the bottom
            !stage[y + player.pos.y + moveY] ||
            // 3. check that our move is inside the game area width (x) i.e. don't pass the sides
            !stage[y + player.pos.y][x + player.pos.x + moveX] ||
            // 4. check that the cell we are moving to isn't set to be cleared
            stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
          ) return true
        }
      }
    }
    return false
  }
