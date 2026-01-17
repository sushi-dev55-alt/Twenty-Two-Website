import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import CreditsPage from "@/pages/CreditsPage";

function App() {
  return (
    <div className="w-full min-h-screen bg-black text-white selection:bg-rose-500/30">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/credits" element={<CreditsPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
