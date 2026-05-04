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
            className="fixed inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-[4px] flex items-center justify-center z-50 p-4 animate-[fadeIn_0.15s_ease]"
        >
            <div
                className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl w-full max-h-[90vh] overflow-y-auto animate-[slideUp_0.2s_ease]"
                style={{ maxWidth: maxWidth }}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-subtle)]">
                    <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
                    <button
                        onClick={onClose}
                        className="bg-none border-0 text-[var(--text-muted)] cursor-pointer flex p-1 rounded-md transition-[color,background] duration-150 hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>

            <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
        </div>
    );
}
