import dynamic from 'next/dynamic';

// Dynamically import the Puzzle component with SSR disabled
const Puzzle = dynamic(() => import('./components/Game'), {
  ssr: false, // Disable server-side rendering for this component
});

const Home: React.FC = () => {
  return (
    <div>
      <Puzzle />
    </div>
  );
};

export default Home;
