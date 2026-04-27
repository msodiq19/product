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
            style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                position: "relative",
                display: isList ? "flex" : "block",
                height: isList ? "140px" : "auto",
            }}
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
                style={{
                    position: "relative",
                    height: isList ? "100%" : "200px",
                    width: isList ? "180px" : "100%",
                    flexShrink: 0,
                    background: "var(--bg-hover)",
                    overflow: "hidden",
                    borderRight: isList ? "1px solid var(--border)" : "none",
                    borderBottom: !isList ? "1px solid var(--border)" : "none",
                }}
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
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <Package size={48} color="var(--text-muted)" />
                    </div>
                )}
                <div
                    style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        background: "rgba(255,255,255,0.9)",
                        border: `1px solid ${accentColor}22`,
                        color: accentColor,
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "999px",
                        backdropFilter: "blur(4px)",
                    }}
                >
                    {product.category}
                </div>
            </div>

            <div style={{ padding: "1rem", display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px", fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase" }}>
                    {stockLevel === "critical" ? (
                        <span style={{ color: "var(--danger)" }}>⚠ {product.stock} Left</span>
                    ) : stockLevel === "low" ? (
                        <span style={{ color: "var(--warning)" }}>{product.stock} In stock</span>
                    ) : (
                        <span style={{ color: "var(--success)" }}>✓ In stock</span>
                    )}
                </p>

                <h3
                    style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        marginBottom: "4px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }}
                >
                    {product.name}
                </h3>

                <p
                    style={{
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        marginBottom: isList ? "0" : "1rem",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: isList ? 1 : 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: 1.5,
                        flex: 1,
                    }}
                >
                    {product.description}
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: isList ? "auto" : 0 }}>
                    <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {formatNaira(product.price)}
                    </span>

                    <div
                        style={{ display: "flex", gap: "6px" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => onEdit(product)}
                            aria-label="Edit product"
                            style={{
                                background: "var(--bg-base)",
                                border: "1px solid var(--border)",
                                color: "var(--text-secondary)",
                                cursor: "pointer",
                                padding: "6px",
                                borderRadius: "6px",
                                display: "flex",
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                const b = e.currentTarget;
                                b.style.borderColor = "var(--accent)";
                                b.style.color = "var(--accent)";
                                b.style.background = "var(--accent-dim)";
                            }}
                            onMouseLeave={(e) => {
                                const b = e.currentTarget;
                                b.style.borderColor = "var(--border)";
                                b.style.color = "var(--text-secondary)";
                                b.style.background = "var(--bg-base)";
                            }}
                        >
                            <Edit2 size={15} />
                        </button>
                        <button
                            onClick={() => onDelete(product)}
                            aria-label="Delete product"
                            style={{
                                background: "var(--bg-base)",
                                border: "1px solid var(--border)",
                                color: "var(--text-secondary)",
                                cursor: "pointer",
                                padding: "6px",
                                borderRadius: "6px",
                                display: "flex",
                                transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                const b = e.currentTarget;
                                b.style.borderColor = "var(--danger)";
                                b.style.color = "var(--danger)";
                                b.style.background = "var(--danger-dim)";
                            }}
                            onMouseLeave={(e) => {
                                const b = e.currentTarget;
                                b.style.borderColor = "var(--border)";
                                b.style.color = "var(--text-secondary)";
                                b.style.background = "var(--bg-base)";
                            }}
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
