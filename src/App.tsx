import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout';
import {
  EditingRoom,
  EditorPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  ProfilePage,
  RegistrationPage,
} from './pages/index';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';
import { useAppDispatch } from './redux/store';

function App() {
  const dispatch = useAppDispatch();
  useSelector(selectIsAuth);

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegistrationPage />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="editor/:idPen" element={<EditorPage />} />
          <Route path="editing-room/:roomId" element={<EditingRoom />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
