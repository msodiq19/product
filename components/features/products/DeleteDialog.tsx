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
        <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-danger-dim border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={22} color="var(--danger)" />
            </div>

            <p className="text-sm text-secondary mb-6">
                Are you sure you want to delete{" "}
                <span className="text-primary font-semibold">{product.name}</span>?
                <br />
                <span className="text-[13px]">This action cannot be undone.</span>
            </p>

            <div className="flex gap-[10px]">
                <button
                    onClick={onCancel}
                    className="flex-1 py-[10px] bg-surface border border-border text-primary rounded-lg text-sm font-medium cursor-pointer font-[inherit] transition-colors duration-150 hover:border-muted"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`flex-1 py-[10px] border border-transparent text-white rounded-lg text-sm font-semibold font-[inherit] transition-opacity duration-150 ${isLoading
                            ? "bg-danger-dim cursor-not-allowed opacity-70"
                            : "bg-danger cursor-pointer"
                        }`}
                >
                    {isLoading ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    );
}
