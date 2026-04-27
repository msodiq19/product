"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Product } from "../../../types/product";

const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    price: z.number({ message: "Price must be a valid number" }).positive("Price must be a positive number"),
    stock: z.number({ message: "Stock must be a valid number" }).int().min(0, "Stock cannot be negative"),
    category: z.string().min(1, "Category is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    imageUrl: z.string().url("Must be a valid URL").or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

interface ProductFormProps {
    product?: Product;
    categories: string[];
    onSubmit: (data: FormValues) => void;
    isLoading?: boolean;

}

const fieldStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "10px 12px",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: "6px",
};

const errorStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "var(--danger)",
    marginTop: "4px",
    fontWeight: 500,
};

export default function ProductForm({ product, categories, onSubmit, isLoading }: ProductFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: product
            ? {
                name: product.name,
                price: product.price,
                stock: product.stock,
                category: product.category,
                description: product.description,
                imageUrl: product.imageUrl,
            }
            : undefined,
    });

    useEffect(() => {
        if (product) {
            reset({
                name: product.name,
                price: product.price,
                stock: product.stock,
                category: product.category,
                description: product.description,
                imageUrl: product.imageUrl,
            });
        } else {
            reset({});
        }
    }, [product, reset]);

    const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.target.style.borderColor = "var(--accent)";
        e.target.style.boxShadow = "0 0 0 3px var(--accent-dim)";
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.target.style.borderColor = "var(--border)";
        e.target.style.boxShadow = "none";
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ display: "grid", gap: "1.25rem" }}>
                <div>
                    <label style={labelStyle}>Product Name</label>
                    <input
                        {...register("name")}
                        placeholder="e.g. Wireless Noise-Cancelling Headphones"
                        style={fieldStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                    {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                        <label style={labelStyle}>Price (₦)</label>
                        <input
                            {...register("price", { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            style={fieldStyle}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        />
                        {errors.price && <p style={errorStyle}>{errors.price.message}</p>}
                    </div>

                    <div>
                        <label style={labelStyle}>Stock</label>
                        <input
                            {...register("stock", { valueAsNumber: true })}
                            type="number"
                            placeholder="0"
                            style={fieldStyle}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        />
                        {errors.stock && <p style={errorStyle}>{errors.stock.message}</p>}
                    </div>
                </div>

                <div>
                    <label style={labelStyle}>Category</label>
                    {/* Using a select box for typical usage, populated dynamically from props */}
                    <select
                        {...register("category")}
                        style={{ ...fieldStyle, cursor: "pointer" }}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    >
                        <option value="">Select a category...</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                        {!categories.length && <option value="Other">Other</option>}
                    </select>
                    {errors.category && <p style={errorStyle}>{errors.category.message}</p>}
                </div>

                <div>
                    <label style={labelStyle}>Description</label>
                    <textarea
                        {...register("description")}
                        rows={3}
                        placeholder="Describe the product..."
                        style={{ ...fieldStyle, resize: "vertical" }}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                    {errors.description && <p style={errorStyle}>{errors.description.message}</p>}
                </div>

                <div>
                    <label style={labelStyle}>Image URL</label>
                    <input
                        {...register("imageUrl")}
                        type="url"
                        placeholder="https://..."
                        style={fieldStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                    {errors.imageUrl && <p style={errorStyle}>{errors.imageUrl.message}</p>}
                </div>

                <div style={{ marginTop: "0.5rem" }}>
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: isLoading ? "var(--border)" : "var(--text-primary)",
                            color: isLoading ? "var(--text-muted)" : "var(--bg-surface)",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: 600,
                            cursor: isLoading ? "not-allowed" : "pointer",
                            transition: "opacity 0.15s, background 0.15s",
                            fontFamily: "inherit",
                        }}
                        onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.opacity = "0.9" }}
                        onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.opacity = "1" }}
                    >
                        {isLoading ? "Saving..." : product ? "Update Details" : "Create Product"}
                    </button>
                </div>
            </div>
        </form>
    );
}
