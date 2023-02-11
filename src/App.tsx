import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout';
import { EditorPage } from './pages/EditorPage';
import { Homepage } from './pages/Homepage';
import { Login } from './pages/Login';
import { Notefoundpage } from './pages/Notefoundpage';
import { Registration } from './pages/Registration';
import { Workspace } from './pages/Workspace';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="workspace" element={<Workspace />} />
          <Route path="login" element={<Login />} />
          <Route path="registration" element={<Registration />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="*" element={<Notefoundpage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
