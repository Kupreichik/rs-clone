import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout';
import { EditorPage } from './pages/EditorPage';
import { Homepage } from './pages/Homepage';
import { Login } from './pages/Login';
import { Notefoundpage } from './pages/Notefoundpage';
import { Profile } from './pages/Profile';
import { Registration } from './pages/Registration';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';
import { useAppDispatch } from './redux/store';

function App() {
  const dispatch = useAppDispatch();
  useSelector(selectIsAuth);

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Registration />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="*" element={<Notefoundpage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
