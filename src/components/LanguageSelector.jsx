import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
];

export default function LanguageSelector() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

    const changeLanguage = (code) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-white"
            >
                <span className="text-xl">{currentLanguage.flag}</span>
                <span className="hidden md:inline">{currentLanguage.name}</span>
                <span className="text-xs">▼</span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 glass-panel p-2 z-50 max-h-96 overflow-y-auto custom-scrollbar">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition text-left ${i18n.language === lang.code
                                        ? "bg-purple-500/30 text-white"
                                        : "hover:bg-white/10 text-gray-300"
                                    }`}
                            >
                                <span className="text-xl">{lang.flag}</span>
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
