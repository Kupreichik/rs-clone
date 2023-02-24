import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/lint/lint';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';

import { ReactNode } from 'react';
import { Controlled as ControlledEditor } from 'react-codemirror2-react-17';

type EditorProps = {
  displayName: string;
  icon: ReactNode;
  language: string;
  value: string;
  onChange: (currentValue: string, _data: CodeMirror.EditorChange, _editor: CodeMirror.Editor) => void;
  onRender?: (editor: CodeMirror.Editor) => void;
};

export const Editor = ({ displayName, icon, language, value, onChange, onRender }: EditorProps) => {
  function handleChange(currentValue: string, _data: CodeMirror.EditorChange, _editor: CodeMirror.Editor) {
    onChange(currentValue, _data, _editor);
  }

  function handleUpdate(editor: CodeMirror.Editor) {
    if (onRender) onRender(editor);
  }

  return (
    <div className="editor-container">
      <div className="editor-title">
        {icon}
        <h3>{displayName}</h3>
      </div>
      <ControlledEditor
        onBeforeChange={(_editor, _data, currentValue) => handleChange(currentValue, _data, _editor)}
        onUpdate={(editor) => handleUpdate(editor)}
        value={value}
        className="editor"
        options={{
          lineWrapping: true,
          mode: language,
          autoCloseBrackets: true,
          autoCloseTags: true,
          lint: true,
          theme: 'material',
          lineNumbers: true,
        }}
      />
    </div>
  );
};
