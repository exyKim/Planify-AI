import React, { useState, useEffect } from "react";
import "../styles/cal.css";

import AddContentModal from "../components/AddContentModal";
import ReminderCard from "../components/ReminderCard";
import TodoList from "../components/TodoList";

import logo from "../images/logo.svg";
import navLeft from "../images/nav_btn_l.svg";
import navRight from "../images/nav_btn_r.svg";

import MailManager from "../components/MailManager";
import mailBtn from "../images/mail_btn.svg";

function Calendar() {
  const [currentWeek, setCurrentWeek] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [schedules, setSchedules] = useState({});
  const [reminderItems, setReminderItems] = useState([]);
  const [showTodo, setShowTodo] = useState(false);
  const [showMail, setShowMail] = useState(false);

  useEffect(() => {
    updateWeekDays(currentDate);
  }, [currentDate]);

  const handleMailSubmit = (data) => {
    console.log("Mail input data:", data);
  };

  const updateWeekDays = (date) => {
    const monday = getMonday(date);

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(
        monday.getFullYear(),
        monday.getMonth(),
        monday.getDate() + i
      );
      return d;
    });

    setCurrentWeek(days);
  };

  const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay();

    const monday = new Date(d);
    monday.setDate(d.getDate() - ((day + 6) % 7)); // 월요일 기준
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const handleToggleHighlight = (dateKey, idx) => {
    setSchedules((prev) => {
      const dayItems = [...(prev[dateKey] || [])];
      const target = { ...dayItems[idx] };
      target.highlight = !target.highlight;
      dayItems[idx] = target;
      return { ...prev, [dateKey]: dayItems };
    });
  };

  const handleAddClick = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const formatDateKey = (date) => {
    if (!date) return "";

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  const handleModalSubmit = (data) => {
    const dateKey = data.date;
    const targetDate = parseLocalYmd(dateKey);
    setCurrentDate(targetDate);

    setSchedules((prev) => ({
      ...prev,
      [dateKey]: [
        ...(prev[dateKey] || []),
        {
          type: data.contentType?.toUpperCase() || "",
          content: data.content,
          memo: data.memo,
          highlight: false,
        },
      ],
    }));

    setShowModal(false);
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const parseLocalYmd = (ymd) => {
    const [y, m, d] = ymd.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setHours(0, 0, 0, 0);
    return dt;
  };

  const calculateDday = (targetYmd) => {
    const DAY = 1000 * 60 * 60 * 24;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = parseLocalYmd(targetYmd);
    const diffDays = Math.round((target - today) / DAY);
    return diffDays;
  };

  const updateReminders = () => {
    const reminderList = Object.entries(schedules)
      .flatMap(([date, items]) => {
        const dday = calculateDday(date);
        if (dday >= 0 && dday <= 2) {
          return items.map((item) => ({
            ...item,
            date,
            dday,
          }));
        }
        return [];
      })
      .sort((a, b) => a.dday - b.dday);

    setReminderItems(reminderList);
  };

  useEffect(() => {
    updateReminders();
  }, [schedules]);

  return (
    <div className="calendar-container">
      <aside className="sidebar">
        <img src={logo} alt="Planify Logo" className="logo" />
        <h2 className="reminder-title">Reminder</h2>
        <div className="reminder-list">
          {reminderItems.map((item, index) => (
            <ReminderCard
              key={index}
              type={item.dday === 0 ? "D-day" : `D-${item.dday}`}
              title={item.content}
              memo={item.memo || ""}
            />
          ))}
        </div>
      </aside>

      <main className="main-content">
        <header className="calendar-header">
          <div className="date-navigation">
            <button className="nav-btn" onClick={() => navigateWeek(-1)}>
              <img src={navLeft} alt="Previous" />
            </button>

            <h1>
              {currentDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
              })}
            </h1>

            <button className="nav-btn" onClick={() => navigateWeek(1)}>
              <img src={navRight} alt="Next" />
            </button>
          </div>

          <button className="add-btn" onClick={handleAddClick}>
            Add
          </button>
        </header>

        <div className="calendar-grid">
          <div className="weekdays">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day, index) => {
                const currentDay = currentWeek[index];
                if (!currentDay) return null;

                const dateKey = formatDateKey(currentDay);
                const daySchedules = schedules[dateKey] || [];

                return (
                  <div key={day} className="weekday-item">
                    <button
                      className="day-button"
                      onClick={() => {
                        setCurrentDate(currentDay);
                        setShowTodo(true);
                      }}
                    >
                      <div className="day-name">{day}</div>
                      <div className="day-number">
                        {currentDay.getDate()}
                      </div>
                    </button>

                    <div className="timeline">
                      {daySchedules.map((schedule, idx) => (
                        <div
                          key={`${dateKey}-${idx}`}
                          className={`schedule-item ${schedule.type} ${
                            schedule.highlight ? "highlight" : ""
                          }`}
                          onDoubleClick={() =>
                            handleToggleHighlight(dateKey, idx)
                          }
                          title={schedule.content}
                        >
                          {schedule.content}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="todo-divider"></div>

        <div className="todo-date-display">
          <div className="todo-date-left">
            {currentDate.getDate()}
          </div>
          <div className="todo-date-right">
            <div>{currentDate.getFullYear()}</div>
            <div>
              {currentDate.toLocaleString("en-US", { month: "short" })}.
            </div>
          </div>
        </div>

        <div className="todo-section">
          <div className="todo-scroll">
            <TodoList
              items={(schedules[formatDateKey(currentDate)] || []).map(
                (item) => ({
                  content: item.content,
                  done: item.highlight ? true : false,
                })
              )}
            />
          </div>
        </div>
      </main>

      {/* MAIL FLOATING BUTTON */}
      <img
        src={mailBtn}
        alt="Mail Button"
        className="mail-floating-btn"
        onClick={() => setShowMail(true)}
      />

      {/* MAIL MANAGER POPUP */}
      {showMail && (
        <MailManager
          isOpen={showMail}
          onClose={() => setShowMail(false)}
          onSubmit={handleMailSubmit}
        />
      )}

      {showModal && (
        <AddContentModal
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}

export default Calendar;
