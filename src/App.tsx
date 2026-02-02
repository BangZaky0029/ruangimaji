import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import TeamMemberProfile from './pages/TeamMemberProfile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useTeamMembers } from './hooks/useSupabaseData';
import type { TeamMember } from './hooks/useSupabaseData';

type Page = 'home' | 'privacy' | 'terms' | 'team-profile';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const { teamMembers } = useTeamMembers();

  const handleNavigate = (page: Page, data?: any) => {
    if (page === 'team-profile' && data) {
      setSelectedMember(data);
    }

    // If we're navigating back to home, we might want to scroll to a section
    if (page === 'home' && typeof data === 'string' && data.startsWith('#')) {
      setCurrentPage('home');
      // Wait for the Home component to be mounted/rendered before scrolling
      setTimeout(() => {
        const element = document.getElementById(data.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'privacy':
        return <PrivacyPolicy onNavigate={handleNavigate} />;
      case 'terms':
        return <TermsOfService onNavigate={handleNavigate} />;
      case 'team-profile':
        return selectedMember ? (
          <TeamMemberProfile
            member={selectedMember}
            onBack={() => handleNavigate('home')}
            allMembers={teamMembers}
            onNavigateToMember={(member: TeamMember) => handleNavigate('team-profile', member)}
          />
        ) : (
          <Home onNavigateToLegal={handleNavigate} onNavigateToTeamProfile={(member) => handleNavigate('team-profile', member)} />
        );
      default:
        return <Home onNavigateToLegal={handleNavigate} onNavigateToTeamProfile={(member) => handleNavigate('team-profile', member)} />;
    }
  };

  return (
    <div className="App">
      <Navbar
        onLogoClick={() => handleNavigate('home')}
        onLinkClick={(href) => handleNavigate('home', href)}
        onPortfolioClick={() => handleNavigate('home', '#portfolio')}
      />
      <AnimatePresence mode="wait">
        {renderPage()}
      </AnimatePresence>
      {currentPage !== 'home' && (
        <Footer
          onLinkClick={(href: string) => handleNavigate('home', href)}
          onPortfolioClick={() => handleNavigate('home', '#portfolio')}
          onNavigateToLegal={(page) => handleNavigate(page as Page)}
        />
      )}
    </div>
  );
}

export default App;
