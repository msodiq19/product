"use client";

import { Edit2, Package, Trash2 } from "lucide-react";
import Image from "next/image";
import { Product } from "../../../types/product";

interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    onClick: (product: Product) => void;
    layout?: "grid" | "list";
}

const CATEGORY_COLORS: Record<string, string> = {
    Electronics: "#2563eb",
    Clothing: "#06b6d4",
    "Home & Garden": "#16a34a",
    Sports: "#d97706",
    Books: "#db2777",
    Beauty: "#ea580c",
    Toys: "#7c3aed",
    Food: "#059669",
};

function getCategoryColor(category: string) {
    return CATEGORY_COLORS[category] ?? "#2563eb";
}

export function formatNaira(amount: number) {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 2 }).format(amount);
}

export default function ProductCard({ product, onEdit, onDelete, onClick, layout = "grid" }: ProductCardProps) {
    const accentColor = getCategoryColor(product.category);
    const stockLevel = product.stock > 20 ? "in-stock" : product.stock > 5 ? "low" : "critical";
    const isList = layout === "list";

    return (
        <div
            onClick={() => onClick(product)}
            className={`bg-surface border border-border rounded-xl overflow-hidden cursor-pointer transition-[transform,border-color,box-shadow] duration-200 relative ${isList ? "flex h-[140px]" : "block"
                }`}
            onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = isList ? "translateX(4px)" : "translateY(-3px)";
                el.style.borderColor = accentColor + "88";
                el.style.boxShadow = `0 12px 24px rgba(0,0,0,0.04)`;
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translate(0)";
                el.style.borderColor = "var(--border)";
                el.style.boxShadow = "none";
            }}
        >
            <div
                className={`relative overflow-hidden flex-shrink-0 bg-hover ${isList
                        ? "h-full w-[180px] border-r border-border"
                        : "h-[200px] w-full border-b border-border"
                    }`}
            >
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 640px) 100vw, 25vw"
                        unoptimized
                        loading="eager"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <Package size={48} color="var(--text-muted)" />
                    </div>
                )}
                <div
                    className="absolute top-[10px] left-[10px] text-[11px] font-semibold px-2 py-[2px] rounded-full backdrop-blur-sm"
                    style={{
                        background: "rgba(255,255,255,0.9)",
                        border: `1px solid ${accentColor}22`,
                        color: accentColor,
                    }}
                >
                    {product.category}
                </div>
            </div>

            <div className="p-4 flex flex-col flex-1 min-w-0">
                <p className="text-[12px] text-muted mb-1 font-semibold tracking-wide uppercase">
                    {stockLevel === "critical" ? (
                        <span className="text-danger">⚠ {product.stock} Left</span>
                    ) : stockLevel === "low" ? (
                        <span className="text-warning">{product.stock} In stock</span>
                    ) : (
                        <span className="text-success">✓ In stock</span>
                    )}
                </p>

                <h3 className="text-[15px] font-semibold text-primary mb-1 truncate">{product.name}</h3>

                <p
                    className={`text-[13px] text-secondary leading-[1.5] flex-1 overflow-hidden ${isList ? "mb-0 line-clamp-1" : "mb-4 line-clamp-2"
                        }`}
                >
                    {product.description}
                </p>

                <div className={`flex items-center justify-between ${isList ? "mt-auto" : ""}`}>
                    <span className="text-base font-bold text-primary">{formatNaira(product.price)}</span>

                    <div className="flex gap-[6px]" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => onEdit(product)}
                            aria-label="Edit product"
                            className="bg-base border border-border text-secondary cursor-pointer p-[6px] rounded-md flex transition-all duration-150 hover:border-accent hover:text-accent hover:bg-accent-dim"
                        >
                            <Edit2 size={15} />
                        </button>
                        <button
                            onClick={() => onDelete(product)}
                            aria-label="Delete product"
                            className="bg-base border border-border text-secondary cursor-pointer p-[6px] rounded-md flex transition-all duration-150 hover:border-danger hover:text-danger hover:bg-danger-dim"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
