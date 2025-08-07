// MainRouter.tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/main/Main';
import MovieDetailPage from './pages/movie/detail/MovieDetailPage';
import { useEffect } from 'react';
import Home from './pages/home/Home';
import SignUp from './pages/login/SignUp';
import Login from './pages/login/Login';

const NotFound = () => <div>Not Found</div>;

const MainRouter = () => {
  useEffect(() => {}, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<Home />} />
          <Route path="detail/:id" element={<MovieDetailPage></MovieDetailPage>} />
          {/* <Route path="movies" element={<MainMovieGrid />} /> */}
        </Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MainRouter;
