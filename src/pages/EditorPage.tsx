import 'react-reflex/styles.css';
import './EditorsPage.scss';

import cn from 'classnames';
import { useEffect, useState } from 'react';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';

import { ReactComponent as ViewBtnIcon } from '../assets/svg/viewBtn.svg';
import Editor from '../components/Editor/Editor';
import useLocalStorage from '../hooks/useLocalStorage';

type ViewMode = 'horizontal' | 'vertical';

export const EditorPage = () => {
  const [html, setHtml] = useLocalStorage('html', '');
  const [css, setCss] = useLocalStorage('css', '');
  const [js, setJS] = useLocalStorage('js', '');

  const [srcDoc, setSrcDoc] = useState('');

  const [viewMode, setViewMode] = useState<ViewMode>('vertical');

  const oppositeViewMode = (viewMode: ViewMode) => {
    const oppositeViewMode = viewMode === 'horizontal' ? 'vertical' : 'horizontal';
    return oppositeViewMode;
  };

  const onChangeMode = () => {
    setViewMode(oppositeViewMode(viewMode));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
      <html>
        <body>${html}</body>
        <style>${css}</style>
        <script>${js}</script>
      </html>
    `);
    }, 250);

    return () => {
      clearTimeout(timeout);
    };
  }, [html, css, js]);

  console.log('JSON.stringify(srcDoc)-->', JSON.stringify(srcDoc));

  return (
    <div className="main-wrapper-editor">
      <div onClick={onChangeMode} className={cn({ 'view-button': true, rotate: viewMode === 'vertical' })}>
        <ViewBtnIcon />
      </div>
      <ReflexContainer orientation={viewMode}>
        <ReflexElement flex={0.25} minSize={30}>
          <div className="div-absolute">
            <div className="editors-container">
              <ReflexContainer orientation={oppositeViewMode(viewMode)}>
                <ReflexElement minSize={30}>
                  <div className="div-absolute">
                    <Editor language="xml" displayName="HTML" onChange={setHtml} value={html} />
                  </div>
                </ReflexElement>

                <ReflexSplitter propagate={true} />

                <ReflexElement minSize={30}>
                  <div className="div-absolute">
                    <Editor language="css" displayName="CSS" onChange={setCss} value={css} />
                  </div>
                </ReflexElement>

                <ReflexSplitter propagate={true} />

                <ReflexElement minSize={30}>
                  <div className="div-absolute">
                    <Editor language="javascript" displayName="JS" onChange={setJS} value={js} />
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
