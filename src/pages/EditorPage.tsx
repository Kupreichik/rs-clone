import './EditorsPage.scss';

import { useEffect, useState } from 'react';

import Editor from '../components/Editor/Editor';
import useLocalStorage from '../hooks/useLocalStorage';

export const EditorPage = () => {
  const [html, setHtml] = useLocalStorage('html', '');
  const [css, setCss] = useLocalStorage('css', '');
  const [js, setJS] = useLocalStorage('js', '');

  const [srcDoc, setSrcDoc] = useState('');

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
    <>
      <div className="editors-container">
        <Editor language="xml" displayName="HTML" onChange={setHtml} value={html} />
        <Editor language="css" displayName="CSS" onChange={setCss} value={css} />
        <Editor language="javascript" displayName="JAVASCRIPT" onChange={setJS} value={js} />
      </div>
      <div className="results-container">
        <iframe srcDoc={srcDoc} title="results" sandbox="allow-scripts" width="100%" height="100%" />
      </div>
    </>
  );
};
