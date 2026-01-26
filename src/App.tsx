import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <AnimatePresence mode="wait">
        <Home />
      </AnimatePresence>
    </div>
  );
}

export default App;
