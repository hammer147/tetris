import styles from './display.module.css'

type Props = {
  gameOver: boolean
  text: string
}

const Display = ({ gameOver, text }: Props) => {
  return (
    <div className={`${styles.display} ${gameOver ? styles.gameOver : ''}`}>
      {text}
    </div>
  )
}

export default Display
