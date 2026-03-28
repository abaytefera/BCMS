import React from "react";
import { useSelector } from "react-redux";
import { X, ChevronLeft, ChevronRight, Download, FileText, Maximize2 } from "lucide-react";

const AttachmentModal = ({ open, files = [], activeIndex = 0, onClose, setActiveIndex }) => {
  const { DarkMode } = useSelector((state) => state.webState);

  if (!open || files.length === 0) return null;

  const activeFile = files[activeIndex];

  const prevFile = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? files.length - 1 : prev - 1));
  };

  const nextFile = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === files.length - 1 ? 0 : prev + 1));
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/80 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 transform scale-100 ${
          DarkMode ? 'bg-slate-950 border border-slate-800' : 'bg-white border border-slate-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Capitalized Text */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          DarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${DarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
              <FileText size={18} />
            </div>
            <div>
              <h2 className={`text-sm font-semibold capitalize tracking-tight ${DarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                {activeFile.original_name?.toLowerCase() || "attachment view"}
              </h2>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                File {activeIndex + 1} of {files.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a 
              href={activeFile.file_path} 
              download 
              className={`p-2.5 rounded-xl transition-all ${
                DarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-indigo-600'
              }`}
            >
              <Download size={18} />
            </a>
            <button
              onClick={onClose}
              className={`p-2.5 rounded-xl transition-all ${
                DarkMode ? 'hover:bg-rose-500/10 text-slate-400 hover:text-rose-500' : 'hover:bg-rose-50 text-slate-500 hover:text-rose-600'
              }`}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Viewer Area */}
        <div className={`relative min-h-[50vh] max-h-[75vh] flex items-center justify-center p-2 ${
          DarkMode ? 'bg-black/20' : 'bg-slate-50/30'
        }`}>
          {/* Navigation Controls */}
          {files.length > 1 && (
            <>
              <button
                onClick={prevFile}
                className={`absolute left-4 z-10 p-3 rounded-2xl shadow-lg transition-all active:scale-95 ${
                  DarkMode ? 'bg-slate-900/90 border border-slate-700 text-white hover:bg-slate-800' : 'bg-white/90 border border-slate-200 text-slate-800 hover:bg-slate-50'
                }`}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextFile}
                className={`absolute right-4 z-10 p-3 rounded-2xl shadow-lg transition-all active:scale-95 ${
                  DarkMode ? 'bg-slate-900/90 border border-slate-700 text-white hover:bg-slate-800' : 'bg-white/90 border border-slate-200 text-slate-800 hover:bg-slate-50'
                }`}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Media Content */}
          <div className="w-full h-full flex justify-center items-center animate-in zoom-in-95 duration-300">
            {activeFile.file_type.startsWith("image/") ? (
              <img
                src={activeFile.file_path}
                alt={activeFile.original_name}
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl transition-transform"
              />
            ) : activeFile.file_type.startsWith("video/") ? (
              <video controls className="max-h-[70vh] w-full rounded-xl shadow-2xl aspect-video">
                <source src={activeFile.file_path} type={activeFile.file_type} />
              </video>
            ) : activeFile.file_type.startsWith("audio/") ? (
              <div className={`w-full max-w-md p-8 rounded-3xl border ${
                DarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <audio controls className="w-full">
                  <source src={activeFile.file_path} type={activeFile.file_type} />
                </audio>
              </div>
            ) : (
              <div className="w-full h-[70vh] p-4">
                <iframe
                  src={activeFile.file_path}
                  title={activeFile.original_name}
                  className={`w-full h-full rounded-xl border shadow-inner ${
                    DarkMode ? 'border-slate-800 bg-white/5' : 'border-slate-200 bg-white'
                  }`}
                ></iframe>
              </div>
            )}
          </div>
        </div>

        {/* Footer Thumbnails (Optional hint) */}
        {files.length > 1 && (
          <div className={`px-6 py-3 flex justify-center gap-2 border-t ${
            DarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-100 bg-slate-50/30'
          }`}>
            {files.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeIndex 
                    ? 'w-8 bg-indigo-500' 
                    : `w-2 ${DarkMode ? 'bg-slate-700' : 'bg-slate-300'}`
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentModal;