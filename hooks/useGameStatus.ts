import { useEffect, useState } from 'react'

export const useGameStatus = (rowsCleared: number) => {
  const [score, setScore] = useState(0)
  const [rows, setRows] = useState(0)
  const [level, setLevel] = useState(0)

  // console.log('outside the effect', rowsCleared)

  // React double-invokes some functions to detect side effects
  // https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects

  useEffect(
    () => {
      const linePoints = [40, 100, 300, 1200]
      if (rowsCleared) {
        // console.log('inside the effect it doubles in StrictMode (only in dev)', rowsCleared)

        // temporary workaround ONLY IN DEV!!
        // rowsCleared = rowsCleared / 2 

        setScore(prev => prev + linePoints[rowsCleared - 1] * (level + 1))
        setRows(prev => prev + rowsCleared)
      }
    }, [level, rowsCleared])

  return [score, setScore, rows, setRows, level, setLevel] as const
}
