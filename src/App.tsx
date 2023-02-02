import { Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout';
import { Homepage } from './pages/Homepage';
import { Notefoundpage } from './pages/Notefoundpage';
import { Workspace } from './pages/Workspace';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="workspace" element={<Workspace />} />
          <Route path="*" element={<Notefoundpage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
