import dynamic from 'next/dynamic';

const Puzzle = dynamic(() => import('./components/Game'), {
  ssr: false, // Disable SSR for this component
});

const Home: React.FC = () => {
  return (
    <div>
      <Puzzle />
    </div>
  );
};

export default Home;
