import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./Component/main";
import MovieDetails from "./Component/MovieDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/details/:id" element={<MovieDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
