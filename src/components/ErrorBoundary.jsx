import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback error={this.state.error} />;
        }

        return this.props.children;
    }
}

function ErrorFallback({ error }) {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex items-center justify-center px-6 text-white">
            <div className="glass-panel p-12 text-center max-w-2xl">
                <div className="text-6xl mb-4">⚠️</div>
                <h1 className="text-3xl font-bold mb-4 text-glow">{t('error.title')}</h1>
                <p className="text-gray-300 mb-6">
                    {t('error.desc')}
                </p>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-left">
                    <p className="text-sm font-mono text-red-300 break-all">
                        {error?.toString()}
                    </p>
                </div>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="glass-button px-6 py-3"
                    >
                        🔄 {t('error.reload')}
                    </button>
                    <Link to="/" className="glass-button px-6 py-3">
                        🏠 {t('error.home')}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ErrorBoundary;
