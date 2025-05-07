import { BrowserRouter, Route, Routes } from "react-router"
import { Toaster } from "./components/ui/toaster"
import { AnnotationsProvider } from "./modules/annotations/contexts/annotations"
import { AIGeneratedConclusion } from "./pages/ai-conclusion"
import { CreateReport } from "./pages/create-report"
import { Home } from "./pages/home"
import { ViewReport } from "./pages/view-report"

function App() {
  return (
    <AnnotationsProvider>
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reports/:id/create" element={<CreateReport />} />
            <Route path="/reports/:id/view" element={<ViewReport />} />
            <Route path="/reports/:id/conclusion" element={<AIGeneratedConclusion />} />
            <Route path="/reports/:id/update" element={<CreateReport />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </>
    </AnnotationsProvider>
  )
}

export default App
