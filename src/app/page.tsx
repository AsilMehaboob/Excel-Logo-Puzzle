import dynamic from 'next/dynamic';
import './globals.css'; // Import global CSS

const Puzzle = dynamic(() => import('./components/Game'), {
  ssr: false, // Disable server-side rendering for this component
});

const Home: React.FC = () => {
  return (
    <div className="bg-cover bg-center min-h-screen bg-desktop md:bg-mobile font-satoshi">
      <Puzzle />
    </div>
  );
};

export default Home;
