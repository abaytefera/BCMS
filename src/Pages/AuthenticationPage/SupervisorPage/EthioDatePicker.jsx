import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { toEthiopian, toGregorian } from "ethiopian-date";
import { ChevronLeft, ChevronRight, Calendar, X, ChevronDown, ChevronUp } from "lucide-react";

const MONTHS = [
  "Meskerem", "Tikimt", "Hidar", "Tahsas",
  "Tir", "Yekatit", "Megabit", "Miazia",
  "Ginbot", "Sene", "Hamle", "Nehasse", "Pagume"
];

const EthioDatePicker = ({ label, value, onChange }) => {
  const { DarkMode } = useSelector((state) => state.webState || {});
  
  const today = new Date();
  const [currentEthYear] = toEthiopian(today.getFullYear(), today.getMonth() + 1, today.getDate());

  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(currentEthYear); 
  const [showYearPicker, setShowYearPicker] = useState(false);
  
  const yearPickerRef = useRef(null);

  useEffect(() => {
    if (value && !isNaN(value.getTime())) {
      const [y, m, d] = toEthiopian(value.getFullYear(), value.getMonth() + 1, value.getDate());
      setMonth(m);
      setYear(y);
    }
  }, [value]);

  useEffect(() => {
    if (showYearPicker && yearPickerRef.current) {
      const activeBtn = yearPickerRef.current.querySelector(".active-year");
      if (activeBtn) {
        activeBtn.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, [showYearPicker]);

  const daysInMonth = month === 13 ? (year % 4 === 3 ? 6 : 5) : 30;

  const formattedValue = value && !isNaN(value.getTime())
    ? (() => {
        const [y, m, d] = toEthiopian(value.getFullYear(), value.getMonth() + 1, value.getDate());
        return `${d}/${m}/${y}`;
      })()
    : "";

  const years = Array.from({ length: 100 }, (_, i) => (currentEthYear - 80) + i);

  return (
    <div className="w-full relative group">
      {label && (
        <label className={`text-[11px] font-bold capitalize tracking-tight ml-1 mb-2 block ${DarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          {label.toLowerCase()}
        </label>
      )}

      <div className={`transition-all duration-300 rounded-[2rem] p-5 shadow-sm min-h-[300px] border-2 ${
        DarkMode 
        ? 'bg-slate-900 border-slate-800 shadow-slate-950/40' 
        : 'bg-white border-slate-100 shadow-slate-200/50'
      }`}>
        
        {/* Header: Selected Date Display */}
        <div className={`mb-5 flex justify-between items-center border-b pb-3 ${DarkMode ? 'border-slate-800' : 'border-slate-50'}`}>
          <div className="flex items-center gap-2">
            <Calendar size={14} className={DarkMode ? 'text-slate-400' : 'text-slate-500'} />
            <span className={`text-[13px] font-bold ${formattedValue ? (DarkMode ? 'text-slate-200' : 'text-slate-800') : 'text-slate-400'}`}>
              {formattedValue || "Select date"}
            </span>
          </div>
          {formattedValue && (
            <button 
              onClick={() => onChange(null)} 
              className={`p-1.5 rounded-xl transition-colors ${DarkMode ? 'hover:bg-rose-500/10 text-slate-600 hover:text-rose-400' : 'hover:bg-rose-50 text-slate-300 hover:text-rose-500'}`}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Navigation: Year and Month Controls */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setShowYearPicker(!showYearPicker)}
            className={`flex items-center gap-1.5 text-[12px] font-bold px-4 py-2 rounded-2xl transition-all active:scale-95 ${
              DarkMode 
              ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' 
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {year}
            {showYearPicker ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setMonth(m => (m === 1 ? 13 : m - 1))} 
              className={`p-2 rounded-xl transition-colors ${DarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
            >
              <ChevronLeft size={16} />
            </button>
            <span className={`font-bold text-[12px] w-24 text-center capitalize ${DarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {MONTHS[month - 1].toLowerCase()}
            </span>
            <button 
              onClick={() => setMonth(m => (m === 13 ? 1 : m + 1))} 
              className={`p-2 rounded-xl transition-colors ${DarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Year Picker Overlay */}
        {showYearPicker && (
          <div 
            ref={yearPickerRef}
            className={`absolute inset-x-5 top-[105px] bottom-5 z-20 grid grid-cols-4 gap-2 overflow-y-auto p-3 border-2 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${
              DarkMode ? 'bg-slate-900 border-slate-800 shadow-black' : 'bg-white border-slate-50 shadow-slate-100'
            }`}
          >
            {years.map(y => (
              <button 
                key={y} 
                onClick={() => { setYear(y); setShowYearPicker(false); }}
                className={`text-[11px] py-3 rounded-xl font-bold transition-all active:scale-90 ${
                  y === year 
                    ? 'bg-primBtn text-white shadow-lg active-year' 
                    : `${DarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'}`
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        )}

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isSelected = value && formattedValue === `${day}/${month}/${year}`;
            
            return (
              <button
                key={day}
                onClick={() => {
                  const [gY, gM, gD] = toGregorian(year, month, day);
                  onChange(new Date(gY, gM - 1, gD));
                }}
                className={`aspect-square flex items-center justify-center rounded-xl text-[11px] font-bold transition-all active:scale-90 ${
                  isSelected 
                    ? "bg-primBtn text-white shadow-lg ring-2 ring-slate-400/10" 
                    : `${DarkMode 
                        ? "text-slate-400 hover:bg-slate-800 hover:text-white" 
                        : "text-slate-600 hover:bg-slate-100"
                      }`
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EthioDatePicker;