import { useCallback, useEffect, useMemo, useState } from 'react'
import Modal from 'react-modal'
import { createStage, willCollide } from '../helpers'
import { useGameStatus, useInterval, usePlayer, useStage } from '../hooks'
import Button from './button'
import Display from './display'
import Stage from './stage'
import styles from './tetris.module.css'

Modal.setAppElement('#__next')

const Tetris = () => {

  const [dropTime, setDropTime] = useState<number | null>(null)
  const [gameOver, setGameOver] = useState(true)

  const [player, updatePlayerPos, resetPlayer, rotatePlayer] = usePlayer()
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer)
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared) // todo: avoid side-effects (see comments in useGameStatus)

  // moving left and right
  const movePlayer = useCallback((dir: number) => {
    if (!willCollide(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false })
    }
  }, [updatePlayerPos, player, stage])

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

  useEffect(startGame, []) // optional todo: a modal to start a game

  useEffect(() => {
    if (rows > (level + 1) * 10) {
      setLevel(prev => prev + 1)
      setDropTime(1000 / (level + 1) + 200) // also in keyup handler
    }
  }, [level, rows, setLevel])

  const drop = useCallback(() => {
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
  }, [player, stage, updatePlayerPos])

  const dropPlayer = useCallback(() => {
    setDropTime(null)
    drop()
  }, [setDropTime, drop])


  // key down
  const handleKeyDown = useCallback(({ key }: KeyboardEvent) => {
    if (!gameOver && key === 'Control') rotatePlayer(stage, -1)
    else if (!gameOver && key === 'ArrowUp') rotatePlayer(stage, 1)
    else if (!gameOver && key === 'ArrowLeft') movePlayer(-1)
    else if (!gameOver && key === 'ArrowDown') dropPlayer() // clears interval (dropPlayer) until keyup which will reset it (handleKeyUp)
    else if (!gameOver && key === 'ArrowRight') movePlayer(1)
  }, [dropPlayer, gameOver, movePlayer, rotatePlayer, stage])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])


  // key up
  const handleKeyUp = useCallback(({ key }: KeyboardEvent) => {
    if (!gameOver && key === 'ArrowDown') setDropTime(1000 / (level + 1) + 200)
  }, [gameOver, level])

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

      <Modal
        isOpen={gameOver}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h1>Game Over</h1>
        <h3>Score: {score}</h3>
        <button onClick={startGame}>Start New Game</button>
      </Modal>

    </div>
  )
}

export default Tetris
