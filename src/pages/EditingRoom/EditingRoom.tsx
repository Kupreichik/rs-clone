import 'react-reflex/styles.css';
import '../Editor/EditorsPage.scss';

import { useEffect, useState } from 'react';
import { TbBrandCss3, TbBrandHtml5, TbBrandJavascript } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

import { Editor, getSrcDoc } from '../../components/index';
import { getEditorData } from '../../redux/slices/editor';
import { getCurrentPen, updateEditorCSS, updateEditorJS } from '../../redux/slices/pens';
import { updateEditorHTML } from '../../redux/slices/pens';
import { useAppDispatch } from '../../redux/store';

type ViewMode = 'horizontal' | 'vertical';
const baseURL = 'localhost:3033';

export const EditingRoom = () => {
  const dispatch = useAppDispatch();

  const { roomId } = useParams();
  const socket = io(baseURL, {
    transports: ['websocket'],
  });

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('CONNECTED_TO_ROOM', { roomId });
    });

    socket.on('CODE_CHANGED', (code) => {
      setHtml(code.html);
      setCss(code.css);
      setJS(code.js);
    });

    return () => {
      socket.off('connect');
      socket.off('CODE_CHANGED');
    };
  }, []);

  const currentPenData = useSelector(getCurrentPen);
  const editorData = useSelector(getEditorData);

  const [html, setHtml] = useState(currentPenData?.html || '');
  const [css, setCss] = useState(currentPenData?.css || '');
  const [js, setJS] = useState(currentPenData?.js || '');

  const [srcDoc, setSrcDoc] = useState('');

  const oppositeViewMode = (viewMode: ViewMode) => {
    const oppositeViewMode = viewMode === 'horizontal' ? 'vertical' : 'horizontal';
    return oppositeViewMode;
  };

  const onHtmlChange = (value: string, data: CodeMirror.EditorChange) => {
    dispatch(updateEditorHTML(value));

    if (data.origin !== '+insert') {
      socket.emit('CODE_CHANGED', {
        roomId,
        code: {
          html: value,
          css: currentPenData?.css,
          js: currentPenData?.js,
        },
      });
    }
  };

  const onCssChange = (value: string, data: CodeMirror.EditorChange) => {
    dispatch(updateEditorCSS(value));
    if (data.origin !== '+insert') {
      socket.emit('CODE_CHANGED', {
        roomId,
        code: {
          html: currentPenData?.html,
          css: value,
          js: currentPenData?.js,
        },
      });
    }
  };

  const onJsChange = (value: string, data: CodeMirror.EditorChange) => {
    dispatch(updateEditorJS(value));
    if (data.origin !== '+insert') {
      socket.emit('CODE_CHANGED', {
        roomId,
        code: {
          html: currentPenData?.html,
          css: currentPenData?.css,
          js: value,
        },
      });
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
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
            <iframe srcDoc={srcDoc} title="results" sandbox="allow-scripts" width="100%" height="100%" />
          </div>
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
};
