import { TCell } from '../typings'
import Cell from './cell'

type Props = {
  stage: TCell[][] // an array of rows, and each row is an array of cells
}

const Stage = ({ stage }: Props) => {

  const numCols = stage[0].length // the number cells in a row (i.e. the number of columns)
  const numRows = stage.length // the number of rows

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${numCols}, 1fr)`,
      gridTemplateRows: `repeat(${numRows}, calc(min(90vw,400px) / ${numCols}))`, // square cells
      gap: '1px',
      border: '1px solid #333',
      width: '100%',
      maxWidth: 'min(90vw,400px)',
      background: '#111'
    }}>
      {stage.map(row => row.map((cell, i) => <Cell key={i} type={cell[0]}/>))}
    </div>
  )
}

export default Stage
