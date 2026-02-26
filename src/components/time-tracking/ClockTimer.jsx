import { useEffect } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTimeTrackerStore } from '../../store/timeTrackerStore';

const ClockTimer = ({ onStart, onPause, onResume, onStop }) => {
  const { isRunning, elapsedSeconds, tick } = useTimeTrackerStore();

  // Update timer every second
  useEffect(() => {
    let interval;
    if (isRunning) {
      // Update immediately
      tick();
      
      // Then update every second
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, tick]);

  // Format time
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
    };
  };

  const { hours, minutes, seconds } = formatTime(elapsedSeconds);

  // Calculate rotation for clock hands
  const secondsRotation = (elapsedSeconds % 60) * 6; // 360deg / 60s = 6deg/s
  const minutesRotation = ((elapsedSeconds % 3600) / 60) * 6; // 360deg / 60m = 6deg/m
  const hoursRotation = ((elapsedSeconds % 43200) / 3600) * 30; // 360deg / 12h = 30deg/h

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Analog Clock */}
      <div className="relative">
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 blur-3xl"
          animate={{
            scale: isRunning ? [1, 1.15, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: isRunning ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />

        {/* Clock container */}
        <div className="relative w-72 h-72 md:w-96 md:h-96">
          {/* Clock face */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-dark-bg2 to-dark-bg3 border-4 border-primary/30 shadow-2xl">
            {/* Hour markers */}
            {[...Array(12)].map((_, i) => {
              const angle = i * 30;
              const isMainHour = i % 3 === 0;
              
              return (
                <div
                  key={i}
                  className="absolute top-0 left-1/2 w-1 origin-bottom"
                  style={{
                    height: '50%',
                    transform: `translateX(-50%) rotate(${angle}deg)`,
                  }}
                >
                  <div
                    className="rounded-full mx-auto"
                    style={{
                      width: isMainHour ? '4px' : '2px',
                      height: isMainHour ? '20px' : '12px',
                      backgroundColor: isMainHour ? 'var(--color-primary)' : 'var(--border)',
                    }}
                  />
                </div>
              );
            })}

            {/* Hour hand */}
            <motion.div
              className="absolute top-1/2 left-1/2 origin-bottom"
              style={{
                width: '8px',
                height: '28%',
                marginLeft: '-4px',
                marginTop: '-28%',
              }}
              animate={{ rotate: hoursRotation }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
              <div className="w-full h-full bg-gradient-to-t from-dark-text to-dark-text/80 rounded-full shadow-lg" />
            </motion.div>

            {/* Minute hand */}
            <motion.div
              className="absolute top-1/2 left-1/2 origin-bottom"
              style={{
                width: '6px',
                height: '38%',
                marginLeft: '-3px',
                marginTop: '-38%',
              }}
              animate={{ rotate: minutesRotation }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
              <div className="w-full h-full bg-gradient-to-t from-primary to-primary-400 rounded-full shadow-lg" />
            </motion.div>

            {/* Second hand */}
            <motion.div
              className="absolute top-1/2 left-1/2 origin-bottom"
              style={{
                width: '3px',
                height: '42%',
                marginLeft: '-1.5px',
                marginTop: '-42%',
              }}
              animate={{ rotate: secondsRotation }}
              transition={{ duration: 0.5, ease: 'linear' }}
            >
              <div className="w-full h-full bg-gradient-to-t from-error to-error/80 rounded-full" />
            </motion.div>

            {/* Center point */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-primary shadow-lg z-30 glow-primary" />

            {/* Digital time display */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-12 bg-dark-bg/90 backdrop-blur-sm px-5 py-2.5 rounded-xl border border-dark-border shadow-xl z-20">
              <div className="flex items-center gap-0.5 font-mono text-2xl md:text-3xl font-bold text-dark-text tabular-nums">
                <span>{hours}</span>
                <span className={isRunning ? 'animate-pulse' : ''}>:</span>
                <span>{minutes}</span>
                <span className={isRunning ? 'animate-pulse' : ''}>:</span>
                <span>{seconds}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-4">
        {!isRunning ? (
          <button
            onClick={elapsedSeconds > 0 ? onResume : onStart}
            className="btn btn-primary btn-lg min-w-[140px]"
          >
            <Play className="w-5 h-5" fill="currentColor" />
            {elapsedSeconds > 0 ? 'Resume' : 'Start'}
          </button>
        ) : (
          <>
            <button onClick={onPause} className="btn btn-secondary btn-lg min-w-[140px]">
              <Pause className="w-5 h-5" fill="currentColor" />
              Pause
            </button>
            <button onClick={onStop} className="btn btn-danger btn-lg min-w-[140px]">
              <Square className="w-5 h-5" fill="currentColor" />
              Stop
            </button>
          </>
        )}
      </div>

      {/* Time breakdown */}
      <div className="flex items-center gap-6 md:gap-8">
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-display font-bold text-dark-text tabular-nums">
            {hours}
          </div>
          <div className="text-xs text-dark-muted uppercase tracking-wider mt-1">
            Hours
          </div>
        </div>
        <div className="text-2xl md:text-3xl text-dark-muted font-light">:</div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-display font-bold text-dark-text tabular-nums">
            {minutes}
          </div>
          <div className="text-xs text-dark-muted uppercase tracking-wider mt-1">
            Minutes
          </div>
        </div>
        <div className="text-2xl md:text-3xl text-dark-muted font-light">:</div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-display font-bold text-dark-text tabular-nums">
            {seconds}
          </div>
          <div className="text-xs text-dark-muted uppercase tracking-wider mt-1">
            Seconds
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClockTimer;