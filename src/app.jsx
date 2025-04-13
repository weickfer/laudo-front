import { BrowserRouter, Route, Routes } from "react-router"
import { Toaster } from "./components/ui/toaster"
import { AnnotationsProvider } from "./modules/annotations/contexts/annotations"
import { CreateReport } from "./pages/create-report"
import { Home } from "./pages/home"
import { UpdateReport } from "./pages/update-report"
import { ViewReport } from "./pages/view-report"

function App() {
  return (
    <AnnotationsProvider>
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reports/create" element={<CreateReport />} />
            <Route path="/reports/:id/view" element={<ViewReport />} />
            <Route path="/reports/:id/update" element={<UpdateReport />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </>
    </AnnotationsProvider>
  )
}

export default App
