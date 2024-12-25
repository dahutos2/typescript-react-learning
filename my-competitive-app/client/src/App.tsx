import React, { useEffect, useState } from 'react';
import tasksData from './data/tasks.json';
import Timer from './components/Timer';
import TaskRunner from './components/TaskRunner';
import './styles/style.css';

function App() {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [disqualified, setDisqualified] = useState(false);
  const [timerKey, setTimerKey] = useState(0); // タイマーリセット用のキー

  const currentTask = tasksData[currentTaskIndex];

  // タブがhiddenになったら失格
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setDisqualified(true);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const handleTimeUp = () => {
    setDisqualified(true);
  };

  const handleNextTask = () => {
    setCurrentTaskIndex((prev) => (prev + 1) % tasksData.length);
    setDisqualified(false);
    setTimerKey(prev => prev + 1); // タイマーをリセット
  };

  if (!currentTask) {
    return (
      <div className='container'>
        課題データがありません。
      </div>
    );
  }

  if (disqualified) {
    return (
      <div className='container'>
        <div className='disqualified'>失格になりました...(タブが非アクティブ)</div>
      </div>
    );
  }

  return (
    <div className='container'>
      <div className='title'>ローカル競プロ学習アプリ</div>

      <div className='timer'>
        <Timer key={timerKey} totalSec={currentTask.timeLimitSec} onTimeUp={handleTimeUp} />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <button
          className='btn'
          onClick={handleNextTask}
        >
          次の課題へ
        </button>
      </div>

      <TaskRunner task={currentTask} />
    </div>
  );
}

export default App;
