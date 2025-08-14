import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./Component/Main";
import MovieDetails from "./Component/MovieDetails";

import Login from "./Component/Login";
import NaBar from "./Component/NaBar";
import MovieSearch from "./Component/MovieSearch";
import MovieSearchResults from "./Component/MovieSearchResults";
import AppLayout from "./Component/AppLayout";
import { AuthProvider } from "./auth/AuthContext";

import BookMark from "./Component/BookMark";
import MyPage from "./Component/mypage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Main />} />
            <Route path="/details/:id" element={<MovieDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<NaBar />} />
            <Route path="/search" element={<MovieSearch />} />
            <Route path="/search/results" element={<MovieSearchResults />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/mypage/bookmark" element={<BookMark />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
