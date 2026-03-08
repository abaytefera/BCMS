// MeetingScheduler.jsx
import React, { useState } from 'react';

const availableSlots = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '01:00 PM',
  '01:30 PM',
];

export default function MeetingScheduler() {
  const maxMeetingsPerDay = 8;

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(15); // default 15 min
  const [scheduledMeetings, setScheduledMeetings] = useState({}); // { '2024-04-20': ['09:00 AM', ...] }
  const [message, setMessage] = useState('');

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) {
      setMessage('Please select date and time slot.');
      return;
    }

    const dayMeetings = scheduledMeetings[selectedDate] || [];

    if (dayMeetings.length >= maxMeetingsPerDay) {
      setMessage('Max meetings reached for this day.');
      return;
    }

    if (dayMeetings.includes(selectedTime)) {
      setMessage('Time slot already booked.');
      return;
    }

    // Add the meeting
    const updatedMeetings = {
      ...scheduledMeetings,
      [selectedDate]: [...dayMeetings, selectedTime],
    };
    setScheduledMeetings(updatedMeetings);
    setMessage(`Meeting scheduled on ${selectedDate} at ${selectedTime} for ${duration} mins.`);
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-4 w-full">
      <h2 className="text-lg font-bold">Secretary Meeting Scheduler</h2>

      {/* Date Picker */}
      <div>
        <label className="block font-semibold mb-1">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      {/* Time Slot */}
      <div>
        <label className="block font-semibold mb-1">Select Time Slot:</label>
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">-- Select Time --</option>
          {availableSlots.map((slot) => (
            <option
              key={slot}
              value={slot}
              disabled={scheduledMeetings[selectedDate]?.includes(slot)}
            >
              {slot} {scheduledMeetings[selectedDate]?.includes(slot) ? '(Booked)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Duration */}
      <div>
        <label className="block font-semibold mb-1">Duration (minutes):</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          min={10}
          max={60}
          className="border rounded p-2 w-full"
        />
      </div>

      {/* Schedule Button */}
      <button
        onClick={handleSchedule}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Schedule Meeting
      </button>

      {/* Feedback Message */}
      {message && <div className="text-red-600 font-semibold">{message}</div>}

      {/* Scheduled Meetings */}
      {selectedDate && scheduledMeetings[selectedDate]?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Meetings on {selectedDate}:</h3>
          <ul className="list-disc pl-5">
            {scheduledMeetings[selectedDate].map((time) => (
              <li key={time}>
                {time} ({duration} mins)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}