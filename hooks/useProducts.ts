import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { CreateProductInput, Product, UpdateProductInput } from "../types/product";

const QUERY_KEY = ["products"];

export const useGetProducts = () => {
    return useQuery<Product[]>({
        queryKey: QUERY_KEY,
        queryFn: async () => {
            // Fetch setting a high limit so that mockapi returns all items for client-side pagination
            const res = await api.get<Product[]>("/products", {
                params: { limit: 100, sortBy: "createdAt", order: "desc" },
            });
            return res.data;
        },
    });
};

export const useGetProduct = (id: string) => {
    return useQuery<Product>({
        queryKey: [...QUERY_KEY, id],
        queryFn: async () => {
            const res = await api.get<Product>(`/products/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};

export const useCreateProduct = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateProductInput) => {
            const res = await api.post<Product>("/products", data);
            return res.data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
    });
};

export const useUpdateProduct = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateProductInput }) => {
            const res = await api.put<Product>(`/products/${id}`, data);
            return res.data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
    });
};

export const useDeleteProduct = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/products/${id}`);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
    });
};