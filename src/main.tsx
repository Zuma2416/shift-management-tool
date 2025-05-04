import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// MUIのデフォルトスタイルを使用
import '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Robotoフォントを直接CSSでインポート
const style = document.createElement('style');
style.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>
); 