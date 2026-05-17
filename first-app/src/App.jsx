import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Music from "./pages/music";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Game from "./pages/Game";
import Game1 from "./pages/Game1";
import Admin from "./pages/Admin";
import AdminPanel from "./pages/AdminPanel";
import Sequencer from "./pages/Sequencer";
import EditProject from "./pages/EditProject";
import CustomCursor from "./components/CustomCursor";
import ThreeBackground from "./components/ThreeBackground";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  let Component;

  if (currentPath.startsWith("/admin/edit/")) {
    Component = EditProject;
    return <Component />;
  }

  switch (currentPath) {
      case "/music":
      case "/music/":
        Component = Music;
        break;

      case "/projects":
      case "/projects/":
        Component = Projects;
        break;

      case "/about":
      case "/about/":
        Component = About;
        break;

      case "/contact":
      case "/contact/":
        Component = Contact;
        break;

      case "/game":
      case "/game/":
        Component = Game;
        break;

      case "/game1":
      case "/game1/":
        Component = Game1;
        break;
      case "/sequencer":
      case "/sequencer/":
      case "/squenecer":
      case "/squenecer/":
        Component = Sequencer;
        break;

      case "/admin":
      case "/admin/":
        Component = Admin;
        break;

      case "/admin-panel":
      case "/admin-panel/":
        Component = AdminPanel;
        break;

      default:
        Component = Home;
        break;
  }

  return (
    <>
      <CustomCursor />
      <ThreeBackground />
      <Component />
    </>
  );
}

export default App;
