import React, { useState } from 'react';
import Calendar from 'react-calendar'; // npm install react-calendar
import 'react-calendar/dist/Calendar.css';

const SecretaryTime = () => {
  const [date, setDate] = useState(new Date());
  const [meetings, setMeetings] = useState([]); // Store your approved meetings here
  const MAX_DAILY_MEETINGS = 8;

  // Filter meetings for the selected date
  const selectedDateMeetings = meetings.filter(
    (m) => m.date.toDateString() === date.toDateString()
  );

  return (
    <div className=" bg-gray-50 p-8 font-sans">
     

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Select Date</h2>
          <Calendar 
            onChange={setDate} 
            value={date} 
            className="w-full border-none rounded-lg"
          />
        </div>

        {/* Meeting Details & Scheduling Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Meetings for {date.toLocaleDateString()}
            </h2>
            
            {selectedDateMeetings.length === 0 ? (
              <p className="text-gray-400 italic">No meetings scheduled for this day.</p>
            ) : (
              <ul className="space-y-3">
                {selectedDateMeetings.map((m, index) => (
                  <li key={index} className="flex justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <span className="font-medium text-blue-900">{m.title}</span>
                    <span className="text-blue-700">{m.time} ({m.duration} min)</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Action Form: Only shows if under daily limit */}
          {selectedDateMeetings.length < MAX_DAILY_MEETINGS ? (
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
              <h3 className="font-semibold text-gray-800 mb-4">Approve & Schedule Meeting</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="time" className="p-2 border rounded" placeholder="Start Time" />
                <select className="p-2 border rounded">
                  <option>10 Minutes</option>
                  <option>15 Minutes</option>
                  <option>20 Minutes</option>
                </select>
                <button className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                  Confirm Meeting Slot
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
              ⚠️ Daily meeting limit reached (8/8). Please select another date.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecretaryTime;