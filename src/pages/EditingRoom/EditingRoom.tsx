import 'react-reflex/styles.css';
import '../Editor/EditorsPage.scss';

import cn from 'classnames';
import { useEffect, useState } from 'react';
import { TbBrandCss3, TbBrandHtml5, TbBrandJavascript } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';

import { ReactComponent as ViewBtnIcon } from '../../assets/svg/viewBtn.svg';
import { Editor, getSrcDoc } from '../../components/index';
import { getCurrentPenData } from '../../redux/slices/editor';

type ViewMode = 'horizontal' | 'vertical';

export const EditingRoom = () => {
  const currentPenData = useSelector(getCurrentPenData);

  const [html, setHtml] = useState(currentPenData?.html || '');
  const [css, setCss] = useState(currentPenData?.css || '');
  const [js, setJS] = useState(currentPenData?.js || '');

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
      setSrcDoc(getSrcDoc({ html, css, js }));
    }, 250);

    return () => {
      clearTimeout(timeout);
    };
  }, [html, css, js]);

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
                    <Editor
                      icon={<TbBrandHtml5 color="red" size={20} />}
                      language="xml"
                      displayName="HTML"
                      onChange={setHtml}
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
                      onChange={setCss}
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
                      onChange={setJS}
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
