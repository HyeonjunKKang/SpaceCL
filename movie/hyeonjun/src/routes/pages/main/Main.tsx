import { Outlet } from 'react-router-dom';
import Header from '../../../components/Header';

const Main = () => {
  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </header>
      <div className="mt-[70px] px-3">
        <Outlet />
      </div>
      <footer>
        <div>FOOTER</div>
      </footer>
    </div>
  );
};

export default Main;
