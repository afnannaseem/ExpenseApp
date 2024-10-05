// client/src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ListDetail from "./pages/ListDetail";
import { ListsProvider } from "./contexts/ListsContext"; // Import the provider

function App() {
  return (
    <ListsProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list/:id" element={<ListDetail />} />
        </Routes>
      </Router>
    </ListsProvider>
  );
}

export default App;
