import React, { useEffect, useState } from 'react';
import { TaskMode } from './utils/types';
import tasksData from './data/tasks.json';
import practiceTasksData from './data/practiceTasks.json';
import Timer from './components/Timer';
import TaskRunner from './components/TaskRunner';
import CompletionScreen from './components/CompletionScreen';
import Login from './components/Login';
import styles from './App.module.css';
import './styles/globals.css';

function App() {
  const [disqualified, setDisqualified] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [mode, setMode] = useState<TaskMode | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const currentTask = mode === 'task' ? tasksData[0] : practiceTasksData[0];

  // タブがhiddenになったら失格
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (userId && mode === 'task') {
          setDisqualified(true);
          fetch('/api/disqualify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
          });
        }
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [userId, mode]);

  const handleTimeUp = () => {
    setDisqualified(true);
    setRemainingTime(0);
    if (userId && mode === 'task') {
      fetch('/api/disqualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
    }
  };

  const switchModeToTask = () => {
    const timeLimitSec = currentTask.timeLimitSec;
    fetch('/api/switch-mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, timeLimitSec }),
    }).then(() => {
      setMode('task');
      setRemainingTime(timeLimitSec);
    });
  }

  const handleLogin = (newUserId: string, selectedMode: TaskMode) => {
    // タスクのtimeLimitSecを取得
    const timeLimitSec = selectedMode === 'task' ? currentTask.timeLimitSec : undefined;

    // サーバー側でユーザー状態を初期化
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: newUserId, mode: selectedMode, timeLimitSec }),
    }).then(() => {
      setUserId(newUserId);
      setMode(selectedMode);
      if (selectedMode === 'task' && timeLimitSec) {
        setRemainingTime(timeLimitSec);
      }
    });
  };

  // ログイン後にユーザー状態を取得
  useEffect(() => {
    if (userId && mode) {
      fetch(`/api/user-state?userId=${encodeURIComponent(userId)}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            const { userState } = data;
            if (userState.disqualified) {
              setDisqualified(true);
            } else if (userState.completed) {
              setCompleted(true);
            } else if (userState.remainingTime !== undefined) {
              setRemainingTime(userState.remainingTime);
            }
          }
        });
    }
  }, [userId, mode]);

  if (!userId || !mode) {
    return <Login onLogin={handleLogin} />;
  }

  if (disqualified) {
    return (
      <div className={styles.container}>
        <div className={styles.disqualified}>失格になりました...</div>
      </div>
    );
  }

  if (completed) {
    return (
      <CompletionScreen
        userId={userId}
        mode={mode}
        onInComplete={() => setCompleted(false)}
        switchModeToTask={switchModeToTask}
      />
    );
  }

  return (
    <div className={styles.container}>
      {mode === 'task' && (
        <div className={styles.timer}>
          <Timer
            totalSec={remainingTime || currentTask.timeLimitSec}
            onTimeUp={handleTimeUp}
            mode={mode}
          />
        </div>
      )}

      <TaskRunner
        task={currentTask}
        userId={userId}
        mode={mode}
        switchModeToTask={switchModeToTask}
        onComplete={() => setCompleted(true)}
      />
    </div>
  );
}

export default App;
