import { memo } from 'react'
import { TETROMINOS } from '../tetrominos'

type Props = {
  type: 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z' | 0
}

const Cell = ({ type }: Props) => {

  const { color } = TETROMINOS[type]

  return (
    <div style={{
      width: 'auto',
      background: `rgba(${color}, 0.8)`,
      border: `${type === 0 ? '0': '4px solid'}`,
      borderTopColor: `rgba(${color}, 1)`,
      borderRightColor: `rgba(${color}, 1)`,
      borderBottomColor: `rgba(${color}, 0.1)`,
      borderLeftColor: `rgba(${color}, 0.3)`,
    }}>

    </div>
  )
}

export default memo(Cell)
