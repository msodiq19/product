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

const fieldClass = "w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-3 py-[10px] text-[var(--text-primary)] text-sm outline-none transition-[border-color,box-shadow] duration-150 font-[inherit] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-dim)]";
const labelClass = "block text-[13px] font-semibold text-[var(--text-primary)] mb-[6px]";
const errorClass = "text-[12px] text-[var(--danger)] mt-1 font-medium";

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

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-5">
                <div>
                    <label className={labelClass}>Product Name</label>
                    <input
                        {...register("name")}
                        placeholder="e.g. Wireless Noise-Cancelling Headphones"
                        className={fieldClass}
                    />
                    {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Price (₦)</label>
                        <input
                            {...register("price", { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className={fieldClass}
                        />
                        {errors.price && <p className={errorClass}>{errors.price.message}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Stock</label>
                        <input
                            {...register("stock", { valueAsNumber: true })}
                            type="number"
                            placeholder="0"
                            className={fieldClass}
                        />
                        {errors.stock && <p className={errorClass}>{errors.stock.message}</p>}
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Category</label>
                    <select
                        {...register("category")}
                        className={`${fieldClass} cursor-pointer`}
                    >
                        <option value="">Select a category...</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                        {!categories.length && <option value="Other">Other</option>}
                    </select>
                    {errors.category && <p className={errorClass}>{errors.category.message}</p>}
                </div>

                <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                        {...register("description")}
                        rows={3}
                        placeholder="Describe the product..."
                        className={`${fieldClass} resize-y`}
                    />
                    {errors.description && <p className={errorClass}>{errors.description.message}</p>}
                </div>

                <div>
                    <label className={labelClass}>Image URL</label>
                    <input
                        {...register("imageUrl")}
                        type="url"
                        placeholder="https://..."
                        className={fieldClass}
                    />
                    {errors.imageUrl && <p className={errorClass}>{errors.imageUrl.message}</p>}
                </div>

                <div className="mt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 border-0 rounded-lg text-sm font-semibold font-[inherit] transition-[opacity,background] duration-150 ${
                            isLoading
                                ? "bg-[var(--border)] text-[var(--text-muted)] cursor-not-allowed"
                                : "bg-[var(--text-primary)] text-[var(--bg-surface)] cursor-pointer hover:opacity-90"
                        }`}
                    >
                        {isLoading ? "Saving..." : product ? "Update Details" : "Create Product"}
                    </button>
                </div>
            </div>
        </form>
    );
}
