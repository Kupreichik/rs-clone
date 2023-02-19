import { TbCloudUpload } from 'react-icons/tb';
import { useSelector } from 'react-redux';

import { selectIsAuth, selectUserLogin } from '../../redux/slices/auth';
import { getEditorData } from '../../redux/slices/editor';
import { addPen, deletePen, updatePen } from '../../redux/slices/pens';
import { useAppDispatch } from '../../redux/store';

export const EditorControls = () => {
  const editorData = useSelector(getEditorData);

  const isAuth = useSelector(selectIsAuth);
  const userLogin = useSelector(selectUserLogin);

  const dispatch = useAppDispatch();

  const onSave = async () => {
    if (isAuth) {
      editorData._id
        ? editorData.user.username === userLogin
          ? dispatch(updatePen({ penId: editorData._id, params: { ...editorData } }))
          : console.log(
              `can save only your own pen`,
              'editorData.user.username-->',
              editorData.user.username,
              'userLogin-->',
              userLogin,
            )
        : dispatch(addPen(editorData));
    } else {
      console.log('log in or sign up to save pen');
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
