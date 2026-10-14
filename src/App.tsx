import { MotionConfig } from "framer-motion";
import { HashRouter, MemoryRouter, Route, Routes } from "react-router-dom";

// The single-file web preview runs inside a sandboxed frame, where URL changes aren't allowed.
const Router = import.meta.env.VITE_ROUTER === "memory" ? MemoryRouter : HashRouter;
import { TabBar, TopNav } from "./components/Nav";
import Feed from "./pages/Feed";
import MapPage from "./pages/MapPage";
import Passport from "./pages/Passport";
import Reader from "./pages/Reader";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <TopNav />
        <main>
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/piece/:id" element={<Reader />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/passport" element={<Passport />} />
            <Route path="*" element={<Feed />} />
          </Routes>
        </main>
        <TabBar />
      </Router>
    </MotionConfig>
  );
}
