import { Link, Route, Routes } from 'react-router-dom';

import { Homepage } from './pages/Homepage';
import { Notefoundpage } from './pages/Notefoundpage';
import { Workspace } from './pages/Workspace';

function App() {
  return (
    <>
      <header>
        <Link to="/">Home</Link>
        <Link to="/workspace">Posts</Link>
      </header>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="*" element={<Notefoundpage />} />
      </Routes>
    </>
  );
}

export default App;
