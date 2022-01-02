import { useCallback, useState } from 'react'
import { produce } from 'immer'
import { randomTetromino, TETROMINOS } from '../tetrominos'
import { Player, Shape, TCell } from '../typings'
import { STAGE_WIDTH, willCollide } from '../helpers'

export const usePlayer = () => {
  const [player, setPlayer] = useState<Player>({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false
  })

  const rotate = (matrix: Shape, dir: number) => {
    // rows become cols (transpose)
    const rotatedTetro = matrix.map((_, index) => matrix.map(col => col[index]))
    // reverse each row
    if (dir > 0) return rotatedTetro.map(row => row.reverse())
    return rotatedTetro.reverse()
  }

  const rotatePlayer = (stage: TCell[][], dir: number) => {
    const clonedPlayer: Player = JSON.parse(JSON.stringify(player)) // Player serializable, ok to clone with JSON
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir) // rotate clone

    // when a rotation will collide, we try to rotate after an offset
    // if it still collides, increase the offset and try again
    // if the offset becomes greater then the size of the matrix, rotation is not possible: rotate back and reset pos
    const pos = clonedPlayer.pos.x // remember pos
    let offset = 1
    while(willCollide(clonedPlayer, stage, {x: 0, y: 0})) {
      clonedPlayer.pos.x += offset
      offset = -(offset + (offset > 0 ? 1 : -1))
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -dir) // rotate back
        clonedPlayer.pos.x = pos // reset original pos
        return
      }
    }

    setPlayer(clonedPlayer)
  }
  
  const updatePlayerPos = ({ x, y, collided }: { x: number; y: number; collided: boolean }) => {
    setPlayer(produce(player, playerCopy => {
      playerCopy.pos.x = player.pos.x + x
      playerCopy.pos.y = player.pos.y + y
      playerCopy.collided = collided
    }))
  }

  const resetPlayer = useCallback(() => {
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: randomTetromino().shape,
      collided: false
    })
  }, [])

  return [player, updatePlayerPos, resetPlayer, rotatePlayer] as const
}
