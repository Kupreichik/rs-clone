import './PenInfo.scss';

import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { BsPencil } from 'react-icons/bs';
import { useSelector } from 'react-redux';

import { selectUserLogin } from '../../redux/slices/auth';
import { getCurrentPen, updatePenTitle } from '../../redux/slices/pens';
import { useAppDispatch } from '../../redux/store';

export const PenInfo = ({ title = 'Untitled', author = 'Captain Anonymous' }) => {
  const userLogin = useSelector(selectUserLogin);

  const currentPenData = useSelector(getCurrentPen);
  const isPenOwner = currentPenData.user.username === userLogin || currentPenData._id === '';

  const dispatch = useAppDispatch();

  const [isEditTitle, useEditTitle] = useState(false);

  const onBtn = () => {
    if (!isPenOwner) return;
    useEditTitle(!isEditTitle);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const onBlurInput = () => {
    dispatch(updatePenTitle({ title: inputRef.current?.value || title }));
    useEditTitle(false);
  };

  useEffect(() => {
    inputRef.current?.focus();
  });

  useEffect(() => {
    dispatch(updatePenTitle({ title: inputRef.current?.value || title }));
  }, [dispatch]);

  return (
    <div className="pen-info">
      <div className="pen-info__title">
        <span onClick={onBtn} className={cn({ 'pen-info__title-text': true, isVisHidden: isEditTitle })}>
          {currentPenData.title || title}
        </span>

        <div onClick={onBtn} className={cn({ 'pen-info__title-btn': true, isVisHidden: !isPenOwner || isEditTitle })}>
          <BsPencil />
        </div>
        <input
          ref={inputRef}
          onBlur={onBlurInput}
          type="text"
          className={cn({ 'pen-info__input': true, isVisHidden: !isEditTitle })}
          placeholder={currentPenData.title || title}
          defaultValue={currentPenData.title || title}
        />
      </div>
      <div className="pen-info__author">{currentPenData?.user.username || author}</div>
    </div>
  );
};
