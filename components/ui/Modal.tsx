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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
        >
            <div
                className="bg-elevated border border-border rounded-2xl w-full overflow-y-auto animate-slideUp"
                style={{ maxWidth, maxHeight: "90vh" }}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-border-subtle">
                    <h2 className="text-base font-semibold text-primary">{title}</h2>
                    <button
                        onClick={onClose}
                        className="bg-transparent border-0 text-muted cursor-pointer flex p-1 rounded-md transition-colors duration-150 hover:text-primary hover:bg-hover"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
