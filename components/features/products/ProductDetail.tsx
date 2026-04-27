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
    const stockColor =
        stockLevel === "in-stock" ? "var(--success)" : stockLevel === "low" ? "var(--warning)" : "var(--danger)";
    const stockLabel = stockLevel === "in-stock" ? "In Stock" : stockLevel === "low" ? "Low Stock" : "Critical";

    return (
        <div>
            <div className="relative h-[240px] rounded-[10px] overflow-hidden mb-5 bg-hover border border-border">
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
                    <div className="flex items-center justify-center h-full">
                        <Package size={64} color="var(--text-muted)" />
                    </div>
                )}
            </div>

            <h2 className="text-[20px] font-bold mb-2 text-primary">{product.name}</h2>

            <div className="flex flex-wrap gap-2 mb-4">
                <span
                    className="flex items-center gap-[5px] bg-accent-dim text-accent border border-accent-dim text-[12px] font-semibold px-[10px] py-[3px] rounded-full"
                >
                    <Tag size={11} />
                    {product.category}
                </span>

                <span
                    className="text-[12px] font-semibold px-[10px] py-[3px] rounded-full border"
                    style={{
                        background: `${stockColor}12`,
                        color: stockColor,
                        borderColor: `${stockColor}33`,
                    }}
                >
                    {stockLabel} — {product.stock} units
                </span>
            </div>

            <p className="text-sm text-secondary leading-relaxed mb-5">{product.description}</p>

            <div className="flex items-center justify-between px-4 py-[14px] bg-base border border-border rounded-[10px] mb-5">
                <div>
                    <p className="text-[12px] text-muted mb-[2px] font-medium">Price</p>
                    <p className="text-[22px] font-bold text-primary">{formatNaira(product.price)}</p>
                </div>

                <div className="flex items-center gap-[6px] text-secondary text-[13px] font-medium">
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
                className="w-full py-[11px] bg-primary text-surface border-0 rounded-lg text-sm font-semibold cursor-pointer font-[inherit] transition-opacity duration-200 hover:opacity-90"
            >
                Edit Details
            </button>
        </div>
    );
}
