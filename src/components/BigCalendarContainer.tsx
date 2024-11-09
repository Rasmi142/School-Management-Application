// components/BigCalendarContainer.tsx
"use client"; // Mark as Client Component
import React, { useState, useEffect } from "react";
import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalender";
import SchedulerModal from "./SchedulerModal";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";
import { FaPlus } from 'react-icons/fa';

const BigCalendarContainer = ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedule, setSchedule] = useState([]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleOpenModal}
        className="btn btn-primary add-scheduler-btn"
        style={{
          position: 'absolute',
          top: -38,
          right: -7,
          background: 'none',
          border: 'none',
          color: '#000',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <FaPlus style={{ marginRight: '5px', opacity: 0.5 }} /> {/* Add icon with some opacity */}
        Add Scheduler
      </button>

      {/* Render the modal only when needed, passing `id` as `teacherId` */}
      {isModalOpen && <SchedulerModal isOpen={isModalOpen} onClose={handleCloseModal} teacherId={id} />}

      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;
