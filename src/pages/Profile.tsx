import './Profile.scss';

import cn from 'classnames';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  fetchAuthAvatarDelete,
  fetchAuthAvatarUpdate,
  fetchAuthUpdate,
  selectUserAvatarUrl,
  selectUserLogin,
  selectUserName,
} from '../redux/slices/auth';
import { useAppDispatch } from '../redux/store';

export const Profile = () => {
  const userName = useSelector(selectUserName);
  const userLogin = useSelector(selectUserLogin);
  const userAvatarUrl = useSelector(selectUserAvatarUrl);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [isEditName, setEditName] = useState(false);
  const [profileName, setProfileName] = useState(userName);

  const dispatch = useAppDispatch();

  const editName = () => {
    setEditName(true);
  };

  const onBlurInput = () => {
    setEditName(false);

    if (profileName === '') {
      setProfileName(userName);
      return;
    }

    if (userName === profileName) return;

    dispatch(fetchAuthUpdate({ name: profileName }));
  };

  const handleChangeFile = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const formData = new FormData();
      const fileList = (event.target as HTMLInputElement).files as FileList;
      formData.append('image', fileList[0]);
      await dispatch(fetchAuthAvatarUpdate(formData));
    } catch (err) {
      console.warn(err);
      alert('File upload error!');
    }
  };

  const onRemoveAvatar = () => {
    dispatch(fetchAuthAvatarDelete());
  };

  useEffect(() => {
    if (isEditName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.selectionStart = nameInputRef.current?.value.length;
    }
  }, [isEditName]);

  return (
    <div className="profile">
      <div className="profile-header">
        <span
          onClick={editName}
          className={cn({ 'profile-name': true, isVisHidden: isEditName })}
          title="You can change name"
        >
          {profileName || userName}
        </span>
        <input
          ref={nameInputRef}
          type="text"
          className={cn({ 'profile-name_input': true, isVisHidden: !isEditName })}
          defaultValue={userName}
          onChange={(e) => setProfileName(e.target.value)}
          onBlur={onBlurInput}
        ></input>
        <div className="profile-login">{`@${userLogin}`}</div>
        <img className="profile-avatar" src={userAvatarUrl} alt={`User Avatar`}></img>
      </div>
      <div className="profile-manage-avatar">
        <div className="profile-avatar_update" onClick={() => inputFileRef.current?.click()}>
          Upload Avatar
        </div>
        <span>|</span>
        <div className="profile-avatar_remove" onClick={onRemoveAvatar}>
          Remove Avatar
        </div>
      </div>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
    </div>
  );
};
