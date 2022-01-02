import styles from './button.module.css'

type Props = {
  type: string
  text: string
  handleMouseDown: () => void
  handleMouseUp?: () => void
}

const Button = ({ type, text, handleMouseDown, handleMouseUp }: Props) => {
  return (
    <button
      className={`${styles.button} ${styles[type]}`}
      // onClick={cb} 
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {text}
    </button>
  )
}

export default Button
