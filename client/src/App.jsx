import AppRouter from './routes/AppRouter';
import IncomingCallModal from './components/mental-health/IncomingCallModal';
import './styles/theme.css';

function App() {
  return (
    <>
      <IncomingCallModal />
      <AppRouter />
    </>
  );
}

export default App;
