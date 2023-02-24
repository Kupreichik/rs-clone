import 'react-reflex/styles.css';
import '../Editor/EditorsPage.scss';

import CodeMirror from 'codemirror';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { TbBrandCss3, TbBrandHtml5, TbBrandJavascript } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import { Editor, getSrcDoc } from '../../components/index';
import { getEditorData } from '../../redux/slices/editor';
import { clearEditor, getCurrentPen, updateEditorCSS, updateEditorHTML, updateEditorJS } from '../../redux/slices/pens';
import { useAppDispatch } from '../../redux/store';

type ViewMode = 'horizontal' | 'vertical';
const baseURL = 'rs-clone-api.onrender.com';
const roomUserIdLength = 5;
const roomUserId = nanoid(roomUserIdLength);
const socket = io(baseURL, {
  transports: ['websocket'],
});

let htmlEditor: CodeMirror.Editor;
let cssEditor: CodeMirror.Editor;
let jsEditor: CodeMirror.Editor;

export const EditingRoom = () => {
  const dispatch = useAppDispatch();

  const { roomId } = useParams();

  const widget = document.createElement('span');
  widget.style.cssText = 'background: #73f37d; padding: 0px 1px;';

  useEffect(() => {
    dispatch(clearEditor());

    socket.emit('CONNECTED_TO_ROOM', { roomId, roomUserId });

    socket.on('START_CODE', ({ senderId, code }) => {
      if (senderId === roomUserId) {
        setHtml(code.html);
        setCss(code.css);
        setJS(code.js);
      }
    });

    socket.on('CODE_CHANGED', ({ code, senderId, editor, pos }) => {
      if (senderId !== roomUserId) {
        setHtml(code.html);
        setCss(code.css);
        setJS(code.js);
        if (editor === 'html') htmlEditor.setBookmark(pos, { widget });
        if (editor === 'css') cssEditor.setBookmark(pos, { widget });
        if (editor === 'js') jsEditor.setBookmark(pos, { widget });
      }
    });

    return () => {
      socket.off('connect');
      socket.off('CODE_CHANGED');
      socket.off('START_CODE');
    };
  }, []);

  const currentPenData = useSelector(getCurrentPen);
  const editorData = useSelector(getEditorData);

  const [html, setHtml] = useState(currentPenData?.html || '');
  const [css, setCss] = useState(currentPenData?.css || '');
  const [js, setJS] = useState(currentPenData?.js || '');
  const [iframeKey, setIframeKey] = useState(uuidv4());

  const [srcDoc, setSrcDoc] = useState('');

  const oppositeViewMode = (viewMode: ViewMode) => {
    const oppositeViewMode = viewMode === 'horizontal' ? 'vertical' : 'horizontal';
    return oppositeViewMode;
  };

  const onHtmlChange = (value: string, data: CodeMirror.EditorChange, editor: CodeMirror.Editor) => {
    setHtml(value);
    const { line, ch } = editor.getCursor('end');
    if (data.origin !== '+insert') {
      socket.emit('CODE_CHANGED', {
        roomId,
        senderId: roomUserId,
        code: {
          html: value,
          css,
          js,
        },
        editor: 'html',
        pos: { line, ch },
      });
    }
  };

  const onCssChange = (value: string, data: CodeMirror.EditorChange, editor: CodeMirror.Editor) => {
    setCss(value);
    const { line, ch } = editor.getCursor('end');
    if (data.origin !== '+insert') {
      socket.emit('CODE_CHANGED', {
        roomId,
        senderId: roomUserId,
        code: {
          html,
          css: value,
          js,
        },
        editor: 'css',
        pos: { line, ch },
      });
    }
  };

  const onJsChange = (value: string, data: CodeMirror.EditorChange, editor: CodeMirror.Editor) => {
    setJS(value);
    const { line, ch } = editor.getCursor('end');
    if (data.origin !== '+insert') {
      socket.emit('CODE_CHANGED', {
        roomId,
        senderId: roomUserId,
        code: {
          html,
          css,
          js: value,
        },
        editor: 'js',
        pos: { line, ch },
      });
    }
  };

  useEffect(() => {
    dispatch(updateEditorHTML(html));
    dispatch(updateEditorCSS(css));
    dispatch(updateEditorJS(js));

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
                      onChange={onHtmlChange}
                      onRender={(editor) => (htmlEditor = editor)}
                      value={html}
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
                      onChange={onCssChange}
                      onRender={(editor) => (cssEditor = editor)}
                      value={css}
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
                      onChange={onJsChange}
                      onRender={(editor) => (jsEditor = editor)}
                      value={js}
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
