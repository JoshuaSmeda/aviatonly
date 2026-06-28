'use client'

import { createContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from 'react'
import { useTheme } from 'next-themes'
import config from '../config'

// Define context type
interface CustomizerContextState {
  activeDir: string; setActiveDir: Dispatch<SetStateAction<string>>;
  activeMode: string | undefined; setActiveMode: (mode: string) => void;
  activeTheme: string; setActiveTheme: Dispatch<SetStateAction<string>>;
  activeLayout: string; setActiveLayout: Dispatch<SetStateAction<string>>;
  isCardShadow: boolean; setIsCardShadow: Dispatch<SetStateAction<boolean>>;
  isLayout: string; setIsLayout: Dispatch<SetStateAction<string>>;
  isBorderRadius: number; setIsBorderRadius: Dispatch<SetStateAction<number>>;
  isCollapse: boolean; setIsCollapse: Dispatch<SetStateAction<boolean>>;
  isLanguage: string; setIsLanguage: Dispatch<SetStateAction<string>>;
}

export const CustomizerContext = createContext<CustomizerContextState>({} as CustomizerContextState)


// LocalStorage hook stays same
function usePersistentState<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(defaultValue)

  useEffect(() => {
    const stored = localStorage.getItem(key)
    const storedDefault = localStorage.getItem(`${key}_default`)
    const currentDefault = JSON.stringify(defaultValue)

    if (storedDefault !== currentDefault) {
      setState(defaultValue)
      localStorage.setItem(`${key}_default`, currentDefault)
    } else if (stored) {
      setState(JSON.parse(stored))
    }
  }, [key, defaultValue])

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}

// Provider
export const CustomizerContextProvider = ({ children }: { children: ReactNode }) => {
  const { theme: activeMode, setTheme: setActiveMode } = useTheme()

  const [activeDir, setActiveDir] = usePersistentState("activeDir", config.activeDir)
  const [activeTheme, setActiveTheme] = usePersistentState("activeTheme", config.activeTheme)
  const [activeLayout, setActiveLayout] = usePersistentState("activeLayout", config.activeLayout)
  const [isCardShadow, setIsCardShadow] = usePersistentState("isCardShadow", config.isCardShadow)
  const [isLayout, setIsLayout] = usePersistentState("isLayout", config.isLayout)
  const [isCollapse, setIsCollapse] = usePersistentState("isCollapse", config.isCollapse)
  const [isLanguage, setIsLanguage] = usePersistentState("isLanguage", config.isLanguage)
  const [isBorderRadius, setIsBorderRadius] = usePersistentState("isBorderRadius", config.isBorderRadius)



  // Apply attributes to <html> safely after hydration
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", activeDir)
      document.documentElement.setAttribute("data-color-theme", activeTheme)
      document.documentElement.setAttribute("data-layout", activeLayout)
      document.documentElement.setAttribute("data-boxed-layout", isLayout)
      document.documentElement.setAttribute("data-sidebar-type", String(isCollapse))
      document.documentElement.setAttribute("data-card-shadow", String(isCardShadow))
    }
  }, [activeDir, activeTheme, activeLayout, isLayout, isCollapse, isCardShadow])

  return (
    <CustomizerContext.Provider value={{
      activeDir, setActiveDir,
      activeMode, setActiveMode,
      activeTheme, setActiveTheme,
      activeLayout, setActiveLayout,
      isCardShadow, setIsCardShadow,
      isLayout, setIsLayout,
      isBorderRadius, setIsBorderRadius,
      isCollapse, setIsCollapse,
      isLanguage, setIsLanguage,
    }}>
      {children}
    </CustomizerContext.Provider>
  )
}

