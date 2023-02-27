import 'react-reflex/styles.css';
import '../Editor/EditorsPage.scss';

import CodeMirror, { Position } from 'codemirror';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { TbBrandCss3, TbBrandHtml5, TbBrandJavascript } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import { Editor, getSrcDoc } from '../../components/index';
import { Code } from '../../redux/slices/editingRoom';
import { getEditorData } from '../../redux/slices/editor';
import { clearEditor, getCurrentPen, updateEditorCSS, updateEditorHTML, updateEditorJS } from '../../redux/slices/pens';
import { useAppDispatch } from '../../redux/store';
import { setCssEditor, setHtmlEditor, setJsEditor, setWidget } from './widget';

type ViewMode = 'horizontal' | 'vertical';
type Properties = {
  code: Code;
  editor: string;
  pos: Position;
};

const baseURL = 'rs-clone-api.onrender.com';
const roomUserIdLength = 5;
const roomUserId = nanoid(roomUserIdLength);

const socket = io(baseURL, {
  transports: ['websocket'],
});

export const EditingRoom = () => {
  const { roomId } = useParams();

  const dispatch = useAppDispatch();

  const updateEditor = ({ html, css, js }: Code) => {
    dispatch(updateEditorHTML(html));
    dispatch(updateEditorCSS(css));
    dispatch(updateEditorJS(js));
  };

  useEffect(() => {
    dispatch(clearEditor());

    socket.emit('CONNECTED_TO_ROOM', { roomId, roomUserId });

    socket.on('START_CODE', ({ senderId, code }) => {
      if (senderId === roomUserId) {
        updateEditor(code);
      }
    });

    socket.on('CODE_CHANGED', ({ code, senderId, editor, pos }) => {
      if (senderId !== roomUserId) {
        updateEditor(code);
        setWidget(editor, pos);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('CODE_CHANGED');
      socket.off('START_CODE');
    };
  }, []);

  const { html, css, js } = useSelector(getCurrentPen);
  const editorData = useSelector(getEditorData);

  const [iframeKey, setIframeKey] = useState(uuidv4());
  const [srcDoc, setSrcDoc] = useState('');

  const oppositeViewMode = (viewMode: ViewMode) => {
    const oppositeViewMode = viewMode === 'horizontal' ? 'vertical' : 'horizontal';
    return oppositeViewMode;
  };

  const sendEditorData = (data: CodeMirror.EditorChange, properties: Properties) => {
    if (data.origin !== '+insert') {
      socket.emit('CODE_CHANGED', {
        roomId,
        senderId: roomUserId,
        ...properties,
      });
    }
  };

  const onHtmlChange = (editor: CodeMirror.Editor, data: CodeMirror.EditorChange, value: string) => {
    dispatch(updateEditorHTML(value));
    const pos = editor.getCursor('end');
    const properties = {
      code: { html: value, css, js },
      editor: 'html',
      pos,
    };

    sendEditorData(data, properties);
  };

  function onCssChange(editor: CodeMirror.Editor, data: CodeMirror.EditorChange, value: string) {
    dispatch(updateEditorCSS(value));
    const pos = editor.getCursor('end');
    const properties = {
      code: { html, css: value, js },
      editor: 'css',
      pos,
    };

    sendEditorData(data, properties);
  }

  const onJsChange = (editor: CodeMirror.Editor, data: CodeMirror.EditorChange, value: string) => {
    dispatch(updateEditorJS(value));
    const pos = editor.getCursor('end');
    const properties = {
      code: { html, css, js: value },
      editor: 'js',
      pos,
    };

    sendEditorData(data, properties);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIframeKey(uuidv4());

      setSrcDoc(getSrcDoc({ html, css, js }));
    }, 250);

    return () => {
      clearTimeout(timeout);
    };
  }, [html, css, js]);

  return (
    <div className="main-wrapper-editor">
      <ReflexContainer orientation={editorData.viewMode}>
        <ReflexElement flex={0.25} minSize={30}>
          <div className="div-absolute">
            <div className="editors-container">
              <ReflexContainer orientation={oppositeViewMode(editorData.viewMode)}>
                <ReflexElement minSize={30}>
                  <div className="div-absolute">
                    <Editor
                      icon={<TbBrandHtml5 color="red" size={20} />}
                      language="xml"
                      displayName="HTML"
                      onBeforeChange={onHtmlChange}
                      onRender={setHtmlEditor}
                      value={html || ''}
                    />
                  </div>
                </ReflexElement>

                <ReflexSplitter propagate={true} />

                <ReflexElement minSize={30}>
                  <div className="div-absolute">
                    <Editor
                      icon={<TbBrandCss3 color="blue" size={20} />}
                      language="css"
                      displayName="CSS"
                      onBeforeChange={onCssChange}
                      onRender={setCssEditor}
                      value={css || ''}
                    />
                  </div>
                </ReflexElement>

                <ReflexSplitter propagate={true} />

                <ReflexElement minSize={30}>
                  <div className="div-absolute">
                    <Editor
                      icon={<TbBrandJavascript color="yellow" size={20} />}
                      language="javascript"
                      displayName="JS"
                      onBeforeChange={onJsChange}
                      onRender={setJsEditor}
                      value={js || ''}
                    />
                  </div>
                </ReflexElement>
              </ReflexContainer>
            </div>
          </div>
        </ReflexElement>

        <ReflexSplitter />

        <ReflexElement>
          <div className="results-container">
            <iframe
              key={iframeKey}
              srcDoc={srcDoc}
              title="results"
              sandbox="allow-scripts"
              width="100%"
              height="100%"
            />
          </div>
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
};
