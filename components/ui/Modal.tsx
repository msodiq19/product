"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export default function Modal({ open, onClose, title, children, maxWidth = "560px" }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        if (open) document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    if (!open) return null;

    return (
        <div
            ref={overlayRef}
            onClick={(e) => e.target === overlayRef.current && onClose()}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
                padding: "1rem",
                animation: "fadeIn 0.15s ease",
            }}
        >
            <div
                style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    width: "100%",
                    maxWidth,
                    maxHeight: "90vh",
                    overflowY: "auto",
                    animation: "slideUp 0.2s ease",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1.25rem 1.5rem",
                        borderBottom: "1px solid var(--border-subtle)",
                    }}
                >
                    <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>{title}</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            display: "flex",
                            padding: "4px",
                            borderRadius: "6px",
                            transition: "color 0.15s, background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                            (e.currentTarget as HTMLButtonElement).style.background = "none";
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>
                <div style={{ padding: "1.5rem" }}>{children}</div>
            </div>

            <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
        </div>
    );
}
