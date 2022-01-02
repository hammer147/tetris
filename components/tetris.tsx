import { useCallback, useEffect, useState } from 'react'
import { createStage, willCollide } from '../helpers'
import { useGameStatus, useInterval, usePlayer, useStage } from '../hooks'
import Button from './button'
import Display from './display'
import Stage from './stage'
import styles from './tetris.module.css'

const Tetris = () => {

  const [dropTime, setDropTime] = useState<number | null>(null)
  const [gameOver, setGameOver] = useState(false)

  const [player, updatePlayerPos, resetPlayer, rotatePlayer] = usePlayer()
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer)
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared) // todo: rows increase by 2, why?

  // moving left and right
  const movePlayer = (dir: number) => {
    if (!willCollide(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false })
    }
  }

  const startGame = () => {
    // reset everything
    setStage(createStage())
    setDropTime(1000)
    resetPlayer()
    setGameOver(false)
    setScore(0)
    setRows(0)
    setLevel(0)
  }

  useEffect(startGame, []) // todo: a modal to start a game and show game over

  useEffect(() => {
    if (rows > (level + 1) * 10) {
      setLevel(prev => prev + 1)
      setDropTime(1000 / (level + 1) + 200) // also in keyup handler
    }
  }, [level, rows, setLevel])

  const drop = () => {
    if (!willCollide(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false })
    } else {
      // game over
      if (player.pos.y < 1) {
        setGameOver(true)
        setDropTime(null)
      }
      updatePlayerPos({ x: 0, y: 0, collided: true })
    }
  }

  const dropPlayer = () => {
    setDropTime(null)
    drop()
  }

  // key down
  const handleKeyDown = useCallback(({ key }: KeyboardEvent) => {
    if (!gameOver && key === 'Control') rotatePlayer(stage, -1)
    else if (!gameOver && key === 'ArrowUp') rotatePlayer(stage, 1)
    else if (!gameOver && key === 'ArrowLeft') movePlayer(-1)
    else if (!gameOver && key === 'ArrowDown') dropPlayer() // clears interval (dropPlayer) until keyup which will reset it (handleKeyUp)
    else if (!gameOver && key === 'ArrowRight') movePlayer(1)
  }, [player])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])


  // key up
  const handleKeyUp = useCallback(({ key }: KeyboardEvent) => {
    if (!gameOver && key === 'ArrowDown') setDropTime(1000 / (level + 1) + 200)
  }, [])

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyUp])


  useInterval(() => drop(), dropTime)

  return (
    <div className={styles.container}>

      <div className={styles.displays}>
        <Display gameOver={gameOver} text={`Score: ${score}`} />
        <Display gameOver={gameOver} text={`Rows: ${rows}`} />
        <Display gameOver={gameOver} text={`Level: ${level}`} />
      </div>

      <Stage stage={stage} />

      <div className={styles.buttons}>
        <Button type="rotateLeft" text="&#8634;" handleMouseDown={() => rotatePlayer(stage, -1)} />
        <Button type="rotateRight" text="&#8635;" handleMouseDown={() => rotatePlayer(stage, 1)} />
        <Button type="left" text="&#8592;" handleMouseDown={() => movePlayer(-1)} />
        <Button type="down" text="&#8595;" handleMouseDown={dropPlayer} handleMouseUp={() => setDropTime(1000 / (level + 1) + 200)} />
        <Button type="right" text="&#8594;" handleMouseDown={() => movePlayer(1)} />
      </div>

    </div>
  )
}

export default Tetris
