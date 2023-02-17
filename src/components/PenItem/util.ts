import { IPenData } from './PenItem';

export const getSrcDoc = (data: Pick<IPenData, 'html' | 'css' | 'js'>, extraStyles = '') => {
  const srcDoc = `
    <html>
      <body>${data.html}</body>
      <style>${extraStyles ? extraStyles : ''}</style>
      <style>
          ::-webkit-scrollbar {
            width: 12px;
            height: 12px;
            background-color: #3d4d56;
          }
          ::-webkit-scrollbar-thumb {
            background-color: #666b7a;
            border-radius: 6px;
          }${data.css}</style>
      <script>${data.js}</script>
    </html>
  `;
  return srcDoc;
};
