import './EditorControls.scss';

import { AlertColor } from '@mui/material';
import cn from 'classnames';
import { useRef, useState } from 'react';
import { TbCloudUpload } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { ReactComponent as ViewBtnIcon } from '../../assets/svg/viewBtn.svg';
import { selectIsAuth, selectUserLogin } from '../../redux/slices/auth';
import { fetchEditingRoom, RoomData } from '../../redux/slices/editingRoom';
import { getEditorData, updateViewMode, ViewMode } from '../../redux/slices/editor';
import { addPen, getCurrentPen, updatePen } from '../../redux/slices/pens';
import { useAppDispatch } from '../../redux/store';
import { clearPenData } from '../../utils/localstorage';
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
  const [path, setPath] = useState('/editor');
  const [coEditingStyle, setCoEditingStyle] = useState({});
  const [copyLinkBtnText, setCopyLinkBtnText] = useState('Copy Link');

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
        clearPenData();
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

  const editingRoomLinkRef = useRef<HTMLAnchorElement>(null);

  const handleCoEditingClick = async () => {
    setCoEditingStyle({ pointerEvents: 'none' });
    const { payload } = await dispatch(fetchEditingRoom(currentPenData));
    if (payload) setPath(`editing-room/${(payload as RoomData).roomId}`);
    setCoEditingStyle({});
    editingRoomLinkRef.current?.click();
  };

  const handleCopyLinkClick = () => {
    const milliseconds = 700;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyLinkBtnText('Copied!');
      setTimeout(() => setCopyLinkBtnText('Copy Link'), milliseconds);
    });
  };

  const locationRouter = useLocation();
  const clearPath = locationRouter.pathname.slice(0, 7);

  return (
    <div className="editor-controls">
      {isPenOwner && clearPath === '/editor' && (
        <div className="editor-controls__btn button save-btn" onClick={onSave}>
          <TbCloudUpload size={30} />
          Save
        </div>
      )}
      {clearPath === '/editor' && (
        <>
          <div className="button" style={coEditingStyle} onClick={handleCoEditingClick}>
            Co-Editing
          </div>
          <NavLink ref={editingRoomLinkRef} to={path} hidden></NavLink>
        </>
      )}
      <div
        onClick={() => dispatch(updateViewMode(oppositeViewMode(editorData.viewMode)))}
        className={cn({ 'editor-controls__btn view-btn': true, rotate: editorData.viewMode === 'vertical' })}
      >
        <ViewBtnIcon />
      </div>
      {clearPath === '/editin' && (
        <div className="button" onClick={handleCopyLinkClick} title="Invite a friend to co-edit">
          {copyLinkBtnText}
        </div>
      )}
      <SnackbarCustom open={open} setOpen={setOpen} severity={messageMode} customWidth={250} message={text} />
    </div>
  );
};
