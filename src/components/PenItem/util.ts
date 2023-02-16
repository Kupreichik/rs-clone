import { IPenData } from './PenItem';

export const getSrcDoc = (data: Pick<IPenData, 'html' | 'css' | 'js'>, extraStyles = '') => {
  const srcDoc = `
    <html>
      <body>${data.html}</body>
      <style>${extraStyles ? extraStyles : ''}</style>
      <style>${data.css}</style>
      <script>${data.js}</script>
    </html>
  `;
  return srcDoc;
};
