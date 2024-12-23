import React, { useState } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  language: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language }) => {
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handleZoomIn = () => {
    setFontSize(prev => Math.min(prev + 1, 32));
  };
  const handleZoomOut = () => {
    setFontSize(prev => Math.max(prev - 1, 8));
  };

  return (
    <div className='editor-container'>
      <div className='editor-header'>
        <div>
          {language} Code Editor
        </div>
        <div>
          <button className='btn' onClick={handleZoomIn}>拡大</button>
          <button className='btn' onClick={handleZoomOut}>縮小</button>
          <button className='btn' onClick={() => setTheme('light')}>ライト</button>
          <button className='btn' onClick={() => setTheme('dark')}>ダーク</button>
        </div>
      </div>
      <div
        className='editor-body'
        style={{
          background: theme === 'dark' ? '#2e2e2e' : '#fff'
        }}
      >
        <textarea
          className='code-textarea'
          style={{
            fontSize: `${fontSize}px`,
            background: theme === 'dark' ? '#1e1e1e' : '#fff',
            color: theme === 'dark' ? '#eee' : '#000'
          }}
          value={code}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CodeEditor;