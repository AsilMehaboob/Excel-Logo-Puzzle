import dynamic from 'next/dynamic';
import './globals.css'; // Import your global CSS

// Dynamically import the Puzzle component with SSR disabled
const Puzzle = dynamic(() => import('./components/Game'), {
  ssr: false, // Disable server-side rendering for this component
});

const Home: React.FC = () => {
  return (
    <div
      className="bg-cover bg-center bg-reponsive min-h-screen bg-desktop md:bg-mobile"
    >
      <Puzzle />
    </div>
  );
};

export default Home;
