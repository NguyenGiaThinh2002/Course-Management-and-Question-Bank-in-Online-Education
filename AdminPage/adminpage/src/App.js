import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppProvider from "./context/AppProvider";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
function App() {
  return (
    <div className="App">
      <Router>
        <AppProvider>
          <Routes>

            <Route exact path="/" element={<Login />} />
            <Route exact path="/home" element={<Home />} />
          </Routes>
        </AppProvider>
      </Router>
    </div>
  );
}

export default App;
