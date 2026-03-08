import React from 'react';

export default function MeetingApproval() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-4">Meeting Approval</h2>
      <div>
        <p>Citizen: Abebe G. (CMP-004)</p>
        <div className="flex gap-2 mt-2">
          <button className="px-2 py-1 bg-green-500 text-white rounded">Approve</button>
          <button className="px-2 py-1 bg-red-500 text-white rounded">Reject</button>
        </div>
      </div>
    </div>
  );
}