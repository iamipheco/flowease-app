import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

const Calendar = ({
  selectedDate,
  onDateSelect,
  timeEntries,
}) => {
  // 🔒 SAFETY FALLBACKS
  const safeSelectedDate =
    selectedDate instanceof Date ? selectedDate : new Date();

  const safeTimeEntries = Array.isArray(timeEntries)
    ? timeEntries
    : [];

  const safeOnDateSelect =
    typeof onDateSelect === "function"
      ? onDateSelect
      : () => {};

  const [currentMonth, setCurrentMonth] = useState(
    new Date(safeSelectedDate)
  );
  const [hoveredDay, setHoveredDay] = useState(null);
  const [now, setNow] = useState(Date.now());

  // ⏱ Update live time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🗂 Group entries by date safely
  const entriesByDate = useMemo(() => {
    const map = {};

    safeTimeEntries.forEach((entry) => {
      if (!entry) return;

      const start =
        entry.clockIn ||
        entry.startTime ||
        entry.start ||
        null;

      if (!start) return;

      const dateObj = new Date(start);
      if (isNaN(dateObj.getTime())) return;

      const dateStr = dateObj.toDateString();

      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(entry);
    });

    return map;
  }, [safeTimeEntries]);

  // 📅 Generate calendar days
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];

    // Empty leading cells
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toDateString();

      const dayEntries = entriesByDate[dateStr] || [];

      let dayHours = dayEntries.reduce((sum, entry) => {
        if (!entry) return sum;

        const start =
          entry.clockIn ||
          entry.startTime ||
          entry.start;

        const end =
          entry.clockOut ||
          entry.endTime ||
          entry.end;

        if (!start) return sum;

        const startDate = new Date(start);
        if (isNaN(startDate.getTime())) return sum;

        // 🔴 LIVE SESSION
        if (!end) {
          const seconds = Math.max(
            0,
            Math.floor((now - startDate.getTime()) / 1000)
          );
          return sum + seconds / 3600;
        }

        const endDate = new Date(end);
        if (isNaN(endDate.getTime())) return sum;

        const seconds = Math.max(
          0,
          Math.floor((endDate.getTime() - startDate.getTime()) / 1000)
        );

        return sum + seconds / 3600;
      }, 0);

      if (!Number.isFinite(dayHours)) {
        dayHours = 0;
      }

      days.push({
        date,
        day: i,
        hasEntries: dayEntries.length > 0,
        dayHours,
        isToday:
          dateStr === new Date().toDateString(),
        isSelected:
          safeSelectedDate &&
          dateStr === safeSelectedDate.toDateString(),
      });
    }

    return days;
  }, [currentMonth, entriesByDate, safeSelectedDate, now]);

  const monthName = currentMonth.toLocaleString(
    "default",
    { month: "long", year: "numeric" }
  );

  const previousMonth = () =>
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1
      )
    );

  const nextMonth = () =>
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1
      )
    );

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const selectedEntries =
    entriesByDate[safeSelectedDate.toDateString()] || [];

  const selectedHours = selectedEntries.reduce(
    (sum, entry) => {
      const start =
        entry.clockIn ||
        entry.startTime ||
        entry.start;

      const end =
        entry.clockOut ||
        entry.endTime ||
        entry.end;

      if (!start) return sum;

      const startDate = new Date(start);
      if (isNaN(startDate.getTime())) return sum;

      if (!end) {
        const seconds = Math.max(
          0,
          Math.floor((now - startDate.getTime()) / 1000)
        );
        return sum + seconds / 3600;
      }

      const endDate = new Date(end);
      if (isNaN(endDate.getTime())) return sum;

      const seconds = Math.max(
        0,
        Math.floor((endDate.getTime() - startDate.getTime()) / 1000)
      );

      return sum + seconds / 3600;
    },
    0
  );

  const maxDayHours = Math.max(
    ...daysInMonth.map((d) => d?.dayHours || 0),
    1
  );

  const getBarColor = (hours) => {
    if (hours < 2) return "bg-success/50";
    if (hours < 5) return "bg-success/70";
    return "bg-success";
  };

  return (
    <div className="card p-4 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-dark-text">
          Calendar
        </h3>

        {selectedHours > 0 && (
          <span className="text-xs text-dark-muted">
            {selectedHours.toFixed(1)}h tracked
          </span>
        )}
      </div>

      {/* Month Nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={previousMonth}
          className="p-1 hover:bg-dark-bg3 rounded"
        >
          <ChevronLeft className="w-4 h-4 text-dark-muted" />
        </button>

        <h4 className="text-sm font-medium text-dark-text">
          {monthName}
        </h4>

        <button
          onClick={nextMonth}
          className="p-1 hover:bg-dark-bg3 rounded"
        >
          <ChevronRight className="w-4 h-4 text-dark-muted" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((d, i) => (
          <div
            key={i}
            className="text-center text-xs text-dark-muted py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day, idx) => (
          <div key={idx} className="relative flex flex-col items-center">
            <motion.button
              disabled={!day}
              onClick={() =>
                day && safeOnDateSelect(day.date)
              }
              onMouseEnter={() =>
                day && setHoveredDay(day)
              }
              onMouseLeave={() =>
                setHoveredDay(null)
              }
              whileHover={day ? { scale: 1.05 } : {}}
              whileTap={day ? { scale: 0.95 } : {}}
              className={cn(
                "aspect-square w-full rounded-lg text-xs font-medium flex items-end justify-center relative transition-all",
                !day && "invisible",
                day?.isToday &&
                  "bg-primary/10 text-primary font-bold ring-2 ring-primary/30",
                day?.isSelected &&
                  !day?.isToday &&
                  "bg-primary text-white",
                !day?.isToday &&
                  !day?.isSelected &&
                  "text-dark-text hover:bg-dark-bg3"
              )}
            >
              {day?.day}

              {day?.hasEntries && (
                <motion.div
                  layout
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                  className={cn(
                    "absolute bottom-1 w-1.5 rounded",
                    getBarColor(day.dayHours)
                  )}
                  style={{
                    height: `${
                      (day.dayHours / maxDayHours) * 20 + 4
                    }px`,
                  }}
                />
              )}
            </motion.button>

            <AnimatePresence>
              {hoveredDay === day &&
                day?.hasEntries && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: -10 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute z-50 -top-6 left-1/2 -translate-x-1/2 bg-dark-bg2 text-xs text-dark-text font-medium px-2 py-1 rounded shadow-md whitespace-nowrap"
                  >
                    {day.dayHours.toFixed(1)}h tracked
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Selected Summary */}
      <div className="mt-4 pt-4 border-t border-dark-border">
        {selectedEntries.length > 0 ? (
          <>
            <p className="text-xs text-dark-muted mb-2">
              {safeSelectedDate.toLocaleDateString(
                "default",
                {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-dark-muted">
                  Sessions
                </span>
                <span className="text-dark-text font-medium">
                  {selectedEntries.length}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-dark-muted">
                  Total Time
                </span>
                <span className="text-primary font-semibold">
                  {selectedHours.toFixed(1)}h
                </span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-xs text-dark-muted text-center">
            No time tracked on this day
          </p>
        )}
      </div>
    </div>
  );
};

export default Calendar;