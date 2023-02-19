import { TbCloudUpload } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectIsAuth, selectUserLogin } from '../../redux/slices/auth';
import { addPen, deletePen, getCurrentPen, updatePen } from '../../redux/slices/pens';
import { useAppDispatch } from '../../redux/store';
import { IPenData } from '../PenItem/PenItem';

export const EditorControls = () => {
  const currentPenData = useSelector(getCurrentPen);

  const isAuth = useSelector(selectIsAuth);
  const userLogin = useSelector(selectUserLogin);

  const isPenOwner = currentPenData.user.username === userLogin;

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const onSave = async () => {
    if (!isAuth) {
      console.log('log in or sign up to save pen');
      return;
    }

    if (!currentPenData._id) {
      const { title, html, css, js } = currentPenData;
      const res = await dispatch(addPen({ title, html, css, js }));

      if (res.payload) {
        navigate(`/editor/${(res.payload as IPenData)._id}`);
      }

      console.log('pen saved');
      return;
    }

    if (isPenOwner) {
      await dispatch(updatePen({ penId: currentPenData._id, params: { ...currentPenData } }));
      console.log('pen updated');
    } else {
      console.log(`error, you can save only your own pen`);
    }
  };

  const onDelete = () => {
    if (isAuth) {
      const penId = prompt('enter pen id :');
      if (penId) {
        dispatch(deletePen(penId));
      }
    }
  };

  return (
    <div className="editor-controls" style={{ display: 'flex', marginRight: '300px' }}>
      <div
        className="save-btn"
        onClick={onSave}
        style={{
          cursor: 'pointer',
          marginRight: '100px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TbCloudUpload size={30} />
        Save
      </div>
      <button onClick={onDelete}>TEST Delete pen by id</button>
    </div>
  );
};
