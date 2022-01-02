import { Dispatch, useEffect, useState } from 'react'
import { createStage } from '../helpers'
import { Player, TCell } from '../typings'

export const useStage =
  (player: Player, resetPlayer: () => void): [TCell[][], Dispatch<React.SetStateAction<TCell[][]>>, number] => {
    const [stage, setStage] = useState(createStage())
    const [rowsCleared, setRowsCleared] = useState(0)

    useEffect(() => {
      setRowsCleared(0)
      const sweepRows = (newStage: TCell[][]): TCell[][] => newStage.reduce((acc: TCell[][], row) => {
        if (row.findIndex(cell => cell[0] === 0) === -1) {
          // console.log('increase clearedRows in useStage')
          setRowsCleared(prev => prev + 1)
          acc.unshift((new Array(newStage[0].length).fill([0, 'clear'])) as TCell[])
          return acc
        }
        acc.push(row)
        return acc
      }, [])

      const updateStage = (prevStage: TCell[][]): TCell[][] => {
        // flush the stage
        const newStage = prevStage.map(row => row.map(cell => cell[1] === 'clear' ? [0, 'clear'] : cell))
        // draw the tetromino
        player.tetromino.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value !== 0) {
              newStage[y + player.pos.y][x + player.pos.x] = [value, `${player.collided ? 'merged' : 'clear'}`]
            }
          })
        })
        // check if we collided
        if (player.collided) {
          resetPlayer()
          return sweepRows(newStage as TCell[][])
        }

        return newStage as TCell[][]
      }

      setStage(prev => updateStage(prev))

    }, [player, resetPlayer])

    return [stage, setStage, rowsCleared]
  }
