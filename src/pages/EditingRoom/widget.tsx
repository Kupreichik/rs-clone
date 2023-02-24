import { Position } from 'codemirror';

let htmlEditor: CodeMirror.Editor;
let cssEditor: CodeMirror.Editor;
let jsEditor: CodeMirror.Editor;

const widget = document.createElement('span');
widget.style.cssText = 'background: #73f37d; padding: 0px 1px;';

export const setWidget = (editorName: string, pos: Position) => {
  if (editorName === 'html') htmlEditor.setBookmark(pos, { widget });
  if (editorName === 'css') cssEditor.setBookmark(pos, { widget });
  if (editorName === 'js') jsEditor.setBookmark(pos, { widget });
};

export const setHtmlEditor = (editor: CodeMirror.Editor) => (htmlEditor = editor);
export const setCssEditor = (editor: CodeMirror.Editor) => (cssEditor = editor);
export const setJsEditor = (editor: CodeMirror.Editor) => (jsEditor = editor);
