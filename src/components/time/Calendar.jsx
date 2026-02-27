import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

const Calendar = ({ selectedDate, onDateSelect, timeEntries }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysCount = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= daysCount; i++) {
      const date = new Date(year, month, i);
      const hasEntries = timeEntries.some((entry) => {
        const entryDate = new Date(entry.clockIn);
        return entryDate.toDateString() === date.toDateString();
      });

      // Calculate total hours for this day (duration is in minutes)
      const dayHours = timeEntries
        .filter((entry) => {
          const entryDate = new Date(entry.clockIn);
          return entryDate.toDateString() === date.toDateString();
        })
        .reduce((sum, entry) => sum + (entry.duration || 0) / 60, 0); // convert minutes to hours

      days.push({
        date,
        day: i,
        hasEntries,
        dayHours,
        isToday: date.toDateString() === new Date().toDateString(),
        isSelected: date.toDateString() === selectedDate.toDateString(),
      });
    }

    return days;
  }, [currentMonth, timeEntries, selectedDate]);

  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  // Get selected date info
  const selectedDateEntries = timeEntries.filter((entry) => {
    const entryDate = new Date(entry.clockIn);
    return entryDate.toDateString() === selectedDate.toDateString();
  });

  const selectedDateHours = selectedDateEntries.reduce(
    (sum, entry) => sum + (entry.duration || 0) / 60, // convert minutes to hours
    0
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-sm font-semibold text-dark-text">Calendar</h3>
        <span className="text-xs text-dark-muted">
          {selectedDateHours > 0 && `${selectedDateHours.toFixed(1)}h tracked`}
        </span>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <button
          onClick={previousMonth}
          className="p-1 hover:bg-dark-bg3 rounded transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-dark-muted" />
        </button>
        <h4 className="text-xs sm:text-sm font-medium text-dark-text">{monthName}</h4>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-dark-bg3 rounded transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-dark-muted" />
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="text-center text-[10px] sm:text-xs font-medium text-dark-muted py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {daysInMonth.map((day, index) => (
          <motion.button
            key={index}
            onClick={() => day && onDateSelect(day.date)}
            disabled={!day}
            whileHover={day ? { scale: 1.05 } : {}}
            whileTap={day ? { scale: 0.95 } : {}}
            className={cn(
              "aspect-square rounded-lg text-[10px] sm:text-xs font-medium transition-all relative",
              !day && "invisible",
              day?.isToday && "bg-primary/10 text-primary font-bold ring-2 ring-primary/30",
              day?.isSelected && !day?.isToday && "bg-primary text-white",
              !day?.isToday && !day?.isSelected && "text-dark-text hover:bg-dark-bg3"
            )}
          >
            {day?.day}
            {day?.hasEntries && !day?.isSelected && (
              <div className="absolute bottom-0.5 sm:bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-success" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Selected Date Summary */}
      {selectedDate && selectedDateEntries.length > 0 && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-dark-border">
          <p className="text-[10px] sm:text-xs text-dark-muted mb-2">
            {selectedDate.toLocaleDateString("default", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-dark-muted">Sessions</span>
              <span className="font-medium text-dark-text">
                {selectedDateEntries.length}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-dark-muted">Total Time</span>
              <span className="font-semibold text-primary">
                {selectedDateHours.toFixed(1)}h
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State for Selected Date */}
      {selectedDate && selectedDateEntries.length === 0 && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-dark-border">
          <p className="text-[10px] sm:text-xs text-dark-muted text-center">
            No time tracked on this day
          </p>
        </div>
      )}
    </div>
  );
};

export default Calendar;