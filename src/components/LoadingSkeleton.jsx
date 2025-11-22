import React from "react";

export default function LoadingSkeleton({ type = "default" }) {
    if (type === "tool") {
        return (
            <div className="glass-panel p-8 animate-pulse">
                <div className="skeleton skeleton-title mb-6"></div>
                <div className="skeleton skeleton-text w-full"></div>
                <div className="skeleton skeleton-text w-3/4"></div>
                <div className="skeleton skeleton-button mt-6"></div>
            </div>
        );
    }

    if (type === "result") {
        return (
            <div className="glass-panel p-6 animate-pulse mt-6">
                <div className="skeleton skeleton-text w-1/2 mb-4"></div>
                <div className="skeleton skeleton-text w-full"></div>
                <div className="skeleton skeleton-text w-5/6"></div>
                <div className="skeleton skeleton-text w-4/5"></div>
            </div>
        );
    }

    return (
        <div className="skeleton skeleton-text"></div>
    );
}
