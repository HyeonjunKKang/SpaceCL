import MainRouter from './routes/MainRouter';
import './App.css';
import { AuthProvider } from './context/auth.context';

function App() {
  return (
    <AuthProvider>
      <MainRouter></MainRouter>;
    </AuthProvider>
  );
}

export default App;
