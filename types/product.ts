export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    createdAt: string;
    stock: number;
    category: string;
}

export type CreateProductInput = Omit<Product, "id" | "createdAt">;
export type UpdateProductInput = Partial<CreateProductInput>;