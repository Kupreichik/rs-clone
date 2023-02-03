import { useState } from 'react';

import Editor from '../components/Editor/Editor';

export const EditorPage = () => {
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJS] = useState('');

  return (
    <div className="editors-container">
      <Editor language="xml" displayName="HTML" onChange={setHtml} value={html} />
      <Editor language="css" displayName="CSS" onChange={setCss} value={css} />
      <Editor language="javascript" displayName="JAVASCRIPT" onChange={setJS} value={js} />
    </div>
  );
};
