import { useEffect, useState } from 'react'

export const useGameStatus = (rowsCleared: number) => {
  const [score, setScore] = useState(0)
  const [rows, setRows] = useState(0)
  const [level, setLevel] = useState(0)

  // console.log('outside effect', rowsCleared)

  useEffect(
    () => {
      const linePoints = [40, 100, 300, 1200]
      if (rowsCleared) {
        // console.log('inside effect it doubles in StrictMode, why?',rowsCleared)
        setScore(prev => prev + linePoints[rowsCleared - 1] * (level + 1))
        setRows(prev => prev + rowsCleared)
      }
    }, [level, rowsCleared])

  return [score, setScore, rows, setRows, level, setLevel] as const
}
