"use client";

import { Calendar, Package, Tag } from "lucide-react";
import Image from "next/image";
import { Product } from "../../../types/product";
import { formatNaira } from "./ProductCard";

interface ProductDetailProps {
    product: Product;
    onEdit: () => void;
}

export default function ProductDetail({ product, onEdit }: ProductDetailProps) {
    const stockLevel = product.stock > 20 ? "in-stock" : product.stock > 5 ? "low" : "critical";
    const stockColor = stockLevel === "in-stock" ? "var(--success)" : stockLevel === "low" ? "var(--warning)" : "var(--danger)";
    const stockLabel = stockLevel === "in-stock" ? "In Stock" : stockLevel === "low" ? "Low Stock" : "Critical";

    return (
        <div>
            <div
                style={{
                    position: "relative",
                    height: "240px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    marginBottom: "1.25rem",
                    background: "var(--bg-hover)",
                    border: "1px solid var(--border)",
                }}
            >
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="560px"
                        unoptimized
                        loading="eager"
                    />
                ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <Package size={64} color="var(--text-muted)" />
                    </div>
                )}
            </div>

            <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px", color: "var(--text-primary)" }}>
                {product.name}
            </h2>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "1rem" }}>
                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        background: "var(--accent-dim)",
                        color: "var(--accent)",
                        border: "1px solid var(--accent-dim)",
                        fontSize: "12px",
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: "999px",
                    }}
                >
                    <Tag size={11} />
                    {product.category}
                </span>

                <span
                    style={{
                        background: `${stockColor}12`,
                        color: stockColor,
                        border: `1px solid ${stockColor}33`,
                        fontSize: "12px",
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: "999px",
                    }}
                >
                    {stockLabel} — {product.stock} units
                </span>
            </div>

            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                {product.description}
            </p>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    background: "var(--bg-base)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    marginBottom: "1.25rem",
                }}
            >
                <div>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "2px", fontWeight: 500 }}>Price</p>
                    <p style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {formatNaira(product.price)}
                    </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "13px", fontWeight: 500 }}>
                    <Calendar size={14} />
                    {new Date(product.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}
                </div>
            </div>

            <button
                onClick={onEdit}
                style={{
                    width: "100%",
                    padding: "11px",
                    background: "var(--text-primary)",
                    color: "var(--bg-surface)",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "opacity 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
                Edit Details
            </button>
        </div>
    );
}
