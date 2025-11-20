import React from "react";
import { loadHistory, clearHistory } from "../utils/history";

export default function HistoryModal({ open, onClose }) {
  if (!open) return null;

  const history = loadHistory();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
      <div className="bg-[#0f0d24] border border-white/10 rounded-xl w-[90%] max-w-xl p-6 shadow-2xl animate-slideUp">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">📜 Scan History</h2>

          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-lg px-2"
          >
            ✕
          </button>
        </div>

        {/* Clear Button */}
        {history.length > 0 && (
          <button
            onClick={() => {
              clearHistory();
              onClose();
            }}
            className="px-3 py-1 bg-red-500/30 border border-red-500/40 rounded text-sm hover:bg-red-500/40 mb-4"
          >
            🗑️ Clear All History
          </button>
        )}

        {/* Empty State */}
        {history.length === 0 && (
          <div className="text-center text-gray-300 py-10">
            No history yet.
          </div>
        )}

        {/* History List */}
        <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
          {history.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white/5 border border-white/10 rounded-lg animate-fadeIn"
            >
              <div className="flex justify-between items-center">
                <div className="font-semibold text-purple-300 capitalize">
                  {item.type} Check
                </div>

                <div className="text-xs text-gray-400">
                  {new Date(item.time).toLocaleString()}
                </div>
              </div>

              <div className="mt-2 text-gray-200 text-sm">
                🔍 <strong>Input:</strong> {item.value}
              </div>

              {/* result */}
              {!item.result?.error && item.result?.breached && (
                <div className="mt-2 text-orange-300">
                  ⚠️ Breached  
                  {item.result.data?.length
                    ? ` (${item.result.data.length} sources)`
                    : item.result.count
                    ? ` (${item.result.count} occurrences)`
                    : ""}
                </div>
              )}

              {!item.result?.error && !item.result?.breached && (
                <div className="mt-2 text-green-300">✅ Safe</div>
              )}

              {item.result?.error && (
                <div className="mt-2 text-red-300">❌ Error</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
