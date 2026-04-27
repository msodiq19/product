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

    const fieldClass =
        "w-full bg-surface border border-border rounded-lg px-3 py-[10px] text-primary text-sm outline-none transition-[border-color,box-shadow] duration-150 font-[inherit] field-focus";

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-5">
                <div>
                    <label className="block text-[13px] font-semibold text-primary mb-[6px]">Product Name</label>
                    <input
                        {...register("name")}
                        placeholder="e.g. Wireless Noise-Cancelling Headphones"
                        className={fieldClass}
                    />
                    {errors.name && <p className="text-[12px] text-danger mt-1 font-medium">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[13px] font-semibold text-primary mb-[6px]">Price (₦)</label>
                        <input
                            {...register("price", { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className={fieldClass}
                        />
                        {errors.price && <p className="text-[12px] text-danger mt-1 font-medium">{errors.price.message}</p>}
                    </div>

                    <div>
                        <label className="block text-[13px] font-semibold text-primary mb-[6px]">Stock</label>
                        <input
                            {...register("stock", { valueAsNumber: true })}
                            type="number"
                            placeholder="0"
                            className={fieldClass}
                        />
                        {errors.stock && <p className="text-[12px] text-danger mt-1 font-medium">{errors.stock.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-[13px] font-semibold text-primary mb-[6px]">Category</label>
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
                    {errors.category && <p className="text-[12px] text-danger mt-1 font-medium">{errors.category.message}</p>}
                </div>

                <div>
                    <label className="block text-[13px] font-semibold text-primary mb-[6px]">Description</label>
                    <textarea
                        {...register("description")}
                        rows={3}
                        placeholder="Describe the product..."
                        className={`${fieldClass} resize-y`}
                    />
                    {errors.description && <p className="text-[12px] text-danger mt-1 font-medium">{errors.description.message}</p>}
                </div>

                <div>
                    <label className="block text-[13px] font-semibold text-primary mb-[6px]">Image URL</label>
                    <input
                        {...register("imageUrl")}
                        type="url"
                        placeholder="https://..."
                        className={fieldClass}
                    />
                    {errors.imageUrl && <p className="text-[12px] text-danger mt-1 font-medium">{errors.imageUrl.message}</p>}
                </div>

                <div className="mt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 border-0 rounded-lg text-sm font-semibold font-[inherit] transition-[opacity,background] duration-150 ${isLoading
                                ? "bg-border text-muted cursor-not-allowed"
                                : "bg-primary text-surface cursor-pointer hover:opacity-90"
                            }`}
                    >
                        {isLoading ? "Saving..." : product ? "Update Details" : "Create Product"}
                    </button>
                </div>
            </div>
        </form>
    );
}
