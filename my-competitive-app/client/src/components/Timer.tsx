import React, { useEffect, useState } from 'react';

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
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  return <div>残り時間: {timeLeft}秒</div>;
};

export default Timer;