import { createContext, useContext, useState } from "react";

const SidebarContext = createContext()

export function SidebarProvider({ children }) {
  const [tool, setTool] = useState(null)

  const toggleTool = (selectedTool) => {
    setTool(selectedTool === tool ? null : selectedTool)
  }

  return (
    <SidebarContext.Provider value={[tool, toggleTool]}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return useContext(SidebarContext)
}