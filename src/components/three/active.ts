import { createContext, useContext } from 'react'

export const SceneActiveContext = createContext(true)
export const useSceneActive = () => useContext(SceneActiveContext)
