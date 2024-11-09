// BigCalendar.tsx
"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const BigCalendar = ({
  data,
}: {
  data: { title: string; start: Date; end: Date }[];
}) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <Calendar
      localizer={localizer}
      events={data}
      startAccessor="start"
      endAccessor="end"
      titleAccessor="title" // Ensures title is displayed on events
      views={["work_week", "day"]}
      view={view}
      style={{ height: "98%" }}
      onView={handleOnChangeView}
      min={new Date(2025, 1, 0, 8, 0, 0)}
      max={new Date(2025, 1, 0, 17, 0, 0)}
      // Add custom event style to visually distinguish events, if needed
      eventPropGetter={(event) => ({
        style: {
          backgroundColor: event.title.includes("Absent") ? "#ffcccb" : "#cce5ff", // Example coloring based on attendance status
        },
      })}
    />
  );
};

export default BigCalendar;
