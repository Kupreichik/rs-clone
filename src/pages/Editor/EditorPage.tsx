import 'react-reflex/styles.css';
import './EditorsPage.scss';

import { useEffect, useState } from 'react';
import { TbBrandCss3, TbBrandHtml5, TbBrandJavascript } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { oppositeViewMode } from '../../components/EditorControls/EditorControls';
import { Editor, getSrcDoc } from '../../components/index';
import { getEditorData } from '../../redux/slices/editor';
import { fetchPen, getCurrentPen, updateEditorCSS, updateEditorJS } from '../../redux/slices/pens';
import { updateEditorHTML } from '../../redux/slices/pens';
import { useAppDispatch } from '../../redux/store';
import { storePenData } from '../../utils/localstorage';

export const EditorPage = () => {
  const dispatch = useAppDispatch();

  const { idPen } = useParams();
  useEffect(() => {
    if (idPen) {
      dispatch(fetchPen(idPen));
    }
  }, [dispatch, idPen]);

  const currentPenData = useSelector(getCurrentPen);
  const editorData = useSelector(getEditorData);

  const [srcDoc, setSrcDoc] = useState('');
  const [iframeKey, setIframeKey] = useState(uuidv4());

  useEffect(() => {
    if (currentPenData) {
      const timeout = setTimeout(() => {
        setIframeKey(uuidv4());
        const { html, css, js } = currentPenData;

        if (!currentPenData._id) {
          storePenData({ html, css, js });
        }
        setSrcDoc(getSrcDoc({ html, css, js }));
      }, 250);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [currentPenData]);

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
                      onBeforeChange={(_editor, _data, value) => {
                        dispatch(updateEditorHTML(value));
                      }}
                      value={currentPenData?.html || ''}
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
                      onBeforeChange={(_editor, _data, value) => {
                        dispatch(updateEditorCSS(value));
                      }}
                      value={currentPenData?.css || ''}
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
                      onBeforeChange={(_editor, _data, value) => {
                        dispatch(updateEditorJS(value));
                      }}
                      value={currentPenData?.js || ''}
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
