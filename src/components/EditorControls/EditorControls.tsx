import './EditorControls.scss';

import { AlertColor } from '@mui/material';
import cn from 'classnames';
import { useState } from 'react';
import { TbCloudUpload } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as ViewBtnIcon } from '../../assets/svg/viewBtn.svg';
import { selectIsAuth, selectUserLogin } from '../../redux/slices/auth';
import { getEditorData, updateViewMode, ViewMode } from '../../redux/slices/editor';
import { addPen, getCurrentPen, removePenDataFromLocalStorage, updatePen } from '../../redux/slices/pens';
import { useAppDispatch } from '../../redux/store';
import { IPenData } from '../PenItem/PenItem';
import { SnackbarCustom } from '../Snackbar/Snackbar';

export const oppositeViewMode = (viewMode: ViewMode) => {
  const oppositeViewMode = viewMode === 'horizontal' ? 'vertical' : 'horizontal';
  return oppositeViewMode;
};

export const EditorControls = () => {
  const currentPenData = useSelector(getCurrentPen);

  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [messageMode, setMessageMode] = useState<AlertColor>('success');

  const isAuth = useSelector(selectIsAuth);
  const userLogin = useSelector(selectUserLogin);

  const isPenOwner = currentPenData.user.username === userLogin || currentPenData._id === '';

  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const editorData = useSelector(getEditorData);

  const onSave = async () => {
    if (!isAuth) {
      setText('LOG IN to save pen');
      setMessageMode('error');
      setOpen(true);
      return;
    }

    if (!currentPenData._id) {
      const { title, html, css, js } = currentPenData;
      const res = await dispatch(addPen({ title, html, css, js }));

      if (res.payload) {
        setText('pen saved');
        setMessageMode('success');
        setOpen(true);
        removePenDataFromLocalStorage();
        navigate(`/editor/${(res.payload as IPenData)._id}`);
      } else {
        console.log(`error, can't save`);
      }
      return;
    }

    if (isPenOwner) {
      const res = await dispatch(updatePen({ penId: currentPenData._id, params: { ...currentPenData } }));
      if (res) {
        setText('pen updated');
        setMessageMode('success');
        setOpen(true);
      } else {
        console.log(`error, can't update`);
      }
    } else {
      setText('error, you can save only your own pen');
      setMessageMode('error');
      setOpen(true);
    }
  };

  return (
    <div className="editor-controls">
      {isPenOwner && (
        <div className="editor-controls__btn button save-btn" onClick={onSave}>
          <TbCloudUpload size={30} />
          Save
        </div>
      )}
      <div
        onClick={() => dispatch(updateViewMode(oppositeViewMode(editorData.viewMode)))}
        className={cn({ 'editor-controls__btn view-btn': true, rotate: editorData.viewMode === 'vertical' })}
      >
        <ViewBtnIcon />
      </div>

      <SnackbarCustom open={open} setOpen={setOpen} severity={messageMode} customWidth={250} message={text} />
    </div>
  );
};
