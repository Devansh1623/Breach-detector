import React from "react";
import { loadHistory, clearHistory } from "../utils/history";
import { useTranslation } from "react-i18next";

export default function HistoryModal({ open, onClose }) {
  if (!open) return null;

  const history = loadHistory();
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center animate-fadeIn p-4">
      <div className="glass-panel w-full max-w-xl p-6 shadow-2xl animate-slideUp relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white text-glow">{t('history.title')}</h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Clear Button */}
        {history.length > 0 && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                clearHistory();
                onClose();
              }}
              className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded text-red-300 hover:bg-red-500/30 hover:text-white transition text-sm flex items-center gap-2"
            >
              <span>🗑️</span> {t('history.clear')}
            </button>
          </div>
        )}

        {/* Empty State */}
        {history.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <p className="text-lg">{t('history.empty')}</p>
            <p className="text-sm mt-2 opacity-60">{t('history.emptyDesc')}</p>
          </div>
        )}

        {/* History List */}
        <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {history.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition animate-fadeIn group"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-bold text-purple-300 capitalize flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
                  {item.type} {t('history.checkSuffix')}
                </div>

                <div className="text-xs text-gray-400 font-mono">
                  {new Date(item.time).toLocaleString()}
                </div>
              </div>

              <div className="text-white text-sm mb-3 break-all font-mono bg-black/20 p-2 rounded border border-white/5">
                {item.value}
              </div>

              {/* result */}
              {!item.result?.error && item.result?.breached && (
                <div className="text-red-400 text-sm font-semibold flex items-center gap-2">
                  {t('history.status.breached')}
                  {item.result.data?.length
                    ? ` (${item.result.data.length} ${t('history.sources')})`
                    : item.result.count
                      ? ` (${item.result.count.toLocaleString()} ${t('history.occurrences')})`
                      : ""}
                </div>
              )}

              {!item.result?.error && !item.result?.breached && (
                <div className="text-green-400 text-sm font-semibold flex items-center gap-2">
                  {t('history.status.safe')}
                </div>
              )}

              {item.result?.error && (
                <div className="text-red-400 text-sm font-semibold flex items-center gap-2">
                  {t('history.status.error')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
