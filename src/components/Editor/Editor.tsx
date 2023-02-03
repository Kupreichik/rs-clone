import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/lint/lint';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';

import { Controlled as ControlledEditor } from 'react-codemirror2-react-17';

type EditorProps = {
  displayName: string;
  language: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
};

function Editor({ displayName, language, value, onChange }: EditorProps) {
  function handleChange(currentValue: string) {
    onChange(currentValue);
  }

  return (
    <div className="editor-container">
      <div className="editor-title">{displayName}</div>
      <ControlledEditor
        onBeforeChange={(_editor, _data, currentValue) => handleChange(currentValue)}
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
}

export default Editor;
