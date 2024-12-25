import React, { useEffect, useState } from 'react';
import './Timer.css';

interface TimerProps {
  totalSec: number;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ totalSec, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(totalSec);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  // タイマーのリセット機能
  const handleReset = () => {
    setTimeLeft(totalSec);
  };

  return (
    <div className='timer-container'>
      <div className={`timer-display ${timeLeft <= 10 ? 'timer-warning' : ''}`}>
        残り時間: {timeLeft}秒
      </div>
      <button className='btn reset-btn' onClick={handleReset}>
        リセット
      </button>
    </div>
  );
};

export default Timer;