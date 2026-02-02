import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

type Page = 'home' | 'privacy' | 'terms';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'privacy':
        return <PrivacyPolicy onNavigate={handleNavigate} />;
      case 'terms':
        return <TermsOfService onNavigate={handleNavigate} />;
      default:
        return <Home onNavigateToLegal={handleNavigate} />;
    }
  };

  return (
    <div className="App">
      <Navbar
        onLogoClick={() => handleNavigate('home')}
        onLinkClick={() => { }}
        onPortfolioClick={() => { }}
      />
      <AnimatePresence mode="wait">
        {renderPage()}
      </AnimatePresence>
      {currentPage !== 'home' && (
        <Footer
          onLinkClick={() => { }}
          onPortfolioClick={() => { }}
          onNavigateToLegal={handleNavigate}
        />
      )}
    </div>
  );
}

export default App;
