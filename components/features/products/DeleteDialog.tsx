"use client";

import { AlertTriangle } from "lucide-react";
import { Product } from "../../../types/product";

interface DeleteDialogProps {
    product: Product;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function DeleteDialog({ product, onConfirm, onCancel, isLoading }: DeleteDialogProps) {
    return (
        <div style={{ textAlign: "center" }}>
            <div
                style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "var(--danger-dim)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                }}
            >
                <AlertTriangle size={22} color="var(--danger)" />
            </div>

            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                Are you sure you want to delete{" "}
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{product.name}</span>?
                <br />
                <span style={{ fontSize: "13px" }}>This action cannot be undone.</span>
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
                <button
                    onClick={onCancel}
                    style={{
                        flex: 1,
                        padding: "10px",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: 500,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "border-color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--text-muted)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    style={{
                        flex: 1,
                        padding: "10px",
                        background: isLoading ? "var(--danger-dim)" : "var(--danger)",
                        border: "1px solid transparent",
                        color: "#fff",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: isLoading ? "not-allowed" : "pointer",
                        fontFamily: "inherit",
                        opacity: isLoading ? 0.7 : 1,
                        transition: "opacity 0.15s",
                    }}
                >
                    {isLoading ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    );
}
