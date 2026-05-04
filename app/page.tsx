"use client";

import { LayoutGrid, List, Package, Plus, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";


import DeleteDialog from "../components/features/products/DeleteDialog";
import ProductCard from "../components/features/products/ProductCard";
import ProductDetail from "../components/features/products/ProductDetail";
import ProductForm from "../components/features/products/ProductForm";
import Modal from "../components/ui/Modal";
import { ProductCardSkeleton } from "../components/ui/Skeleton";
import {
  useCreateProduct,
  useDeleteProduct,
  useGetProducts,
  useUpdateProduct,
} from "../hooks/useProducts";
import { CreateProductInput, Product } from "../types/product";

const PAGE_SIZE = 12;

type ModalState =
  | { type: "create" }
  | { type: "edit"; product: Product }
  | { type: "delete"; product: Product }
  | { type: "detail"; product: Product }
  | null;

export default function Dashboard() {
  const [modal, setModal] = useState<ModalState>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: allProducts = [], isLoading, isError, error } = useGetProducts();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  // Dynamically extract unique categories from API data
  const dynamicCategories = useMemo(() => {
    const cats = new Set(allProducts.map((p) => p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [allProducts]);

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "All" || p.category === category;
      return matchSearch && matchCategory;
    });
  }, [allProducts, search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPage(1);
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const handleCreate = async (data: CreateProductInput) => {
    await createMutation.mutateAsync(data);
    closeModal();
  };

  const handleUpdate = async (data: CreateProductInput) => {
    if (modal?.type !== "edit") return;
    await updateMutation.mutateAsync({ id: modal.product.id, data });
    closeModal();
  };

  const handleDelete = async () => {
    if (modal?.type !== "delete") return;
    await deleteMutation.mutateAsync(modal.product.id);
    closeModal();
  };

  const handleDetailEdit = () => {
    if (modal?.type !== "detail") return;
    setModal({ type: "edit", product: modal.product });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <header className="border-b border-[var(--border)] bg-[var(--bg-surface)] sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-[10px]">
            <div className="w-9 h-9 rounded-lg bg-[var(--text-primary)] flex items-center justify-center">
              <Package size={20} color="var(--bg-surface)" />
            </div>
            <span className="font-bold text-[17px] tracking-[-0.02em]">ProductHub</span>
          </div>

          <button
            onClick={() => setModal({ type: "create" })}
            id="add-product-btn"
            className="flex items-center gap-[6px] bg-[var(--accent)] text-white border-0 rounded-lg px-4 py-[9px] text-sm font-semibold cursor-pointer font-[inherit] transition-opacity duration-150 shadow-[0_4px_12px_var(--accent-dim)] hover:opacity-90"
          >
            <Plus size={16} />
            <span>New Product</span>
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.03em] mb-1">Inventory</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {isLoading ? "Retrieving catalogue..." : `Showing ${paginated.length} of ${filtered.length} products`}
            </p>
          </div>

          <div className="flex gap-[6px] bg-[var(--bg-hover)] p-1 rounded-lg border border-[var(--border)]">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-[10px] py-[6px] rounded-md cursor-pointer transition-all duration-150 ${
                viewMode === "grid"
                  ? "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                  : "bg-transparent text-[var(--text-muted)] border border-transparent"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-[10px] py-[6px] rounded-md cursor-pointer transition-all duration-150 ${
                viewMode === "list"
                  ? "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                  : "bg-transparent text-[var(--text-muted)] border border-transparent"
              }`}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-8 items-stretch">
          <div className="relative flex-1 max-w-[400px]">
            <Search
              size={16}
              className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
            />
            <input
              id="search-input"
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
              className="w-full h-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg py-[10px] pr-[14px] pl-10 text-[var(--text-primary)] text-sm outline-none font-[inherit] transition-[border-color,box-shadow] duration-150 focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-dim)]"
            />
          </div>

          <div className="relative w-[220px]">
            <select
              value={category}
              onChange={handleCategoryChange}
              className="w-full h-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg py-[10px] px-[14px] text-[var(--text-primary)] text-sm outline-none font-[inherit] cursor-pointer appearance-none transition-[border-color] duration-150 focus:border-[var(--accent)]"
            >
              <option value="All">All Categories</option>
              {dynamicCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {isError && (
          <div className="bg-[var(--danger-dim)] border border-[rgba(220,38,38,0.2)] rounded-[10px] px-5 py-4 text-[var(--danger)] text-sm mb-6">
            Failed to load catalogue: {(error as Error)?.message ?? "Network error encountered."}
          </div>
        )}

        {isLoading ? (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-[repeat(auto-fill,minmax(260px,1fr))]"
                : "grid-cols-1"
            }`}
          >
            {Array.from({ length: viewMode === "grid" ? 8 : 5 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20 px-8 text-[var(--text-muted)] bg-[var(--bg-surface)] border border-dashed border-[var(--border)] rounded-xl">
            <Package size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-base font-semibold mb-[6px] text-[var(--text-primary)]">No products found</p>
            <p className="text-sm">Try adjusting your search terms or category filters.</p>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-[repeat(auto-fill,minmax(260px,1fr))]"
                : "grid-cols-1"
            }`}
          >
            {paginated.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                layout={viewMode}
                onEdit={(p) => setModal({ type: "edit", product: p })}
                onDelete={(p) => setModal({ type: "delete", product: p })}
                onClick={(p) => setModal({ type: "detail", product: p })}
              />
            ))}
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-[14px] py-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg text-[13px] font-[inherit] font-semibold transition-all duration-150 ${
                page === 1
                  ? "text-[var(--text-muted)] cursor-not-allowed"
                  : "text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-hover)]"
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
              .reduce<(number | "...")[]>((acc, n, idx, arr) => {
                if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push("...");
                acc.push(n);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "..." ? (
                  <span key={`ellipsis-${idx}`} className="text-[var(--text-muted)] text-[13px] px-1">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item as number)}
                    className={`w-9 h-9 rounded-lg border text-sm font-[inherit] cursor-pointer transition-all duration-150 ${
                      page === item
                        ? "bg-[var(--text-primary)] border-[var(--text-primary)] text-[var(--bg-surface)] font-semibold"
                        : "bg-[var(--bg-surface)] border-[var(--border)] text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-hover)]"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-[14px] py-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg text-[13px] font-[inherit] font-semibold transition-all duration-150 ${
                page === totalPages
                  ? "text-[var(--text-muted)] cursor-not-allowed"
                  : "text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-hover)]"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </main>

      <Modal open={modal?.type === "create"} onClose={closeModal} title="Add New Product">
        <ProductForm
          categories={dynamicCategories}
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
        />
      </Modal>

      <Modal open={modal?.type === "edit"} onClose={closeModal} title="Edit Product">
        {modal?.type === "edit" && (
          <ProductForm
            product={modal.product}
            categories={dynamicCategories}
            onSubmit={handleUpdate}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      <Modal open={modal?.type === "delete"} onClose={closeModal} title="Confirm Deletion" maxWidth="400px">
        {modal?.type === "delete" && (
          <DeleteDialog
            product={modal.product}
            onConfirm={handleDelete}
            onCancel={closeModal}
            isLoading={deleteMutation.isPending}
          />
        )}
      </Modal>

      <Modal open={modal?.type === "detail"} onClose={closeModal} title="Product Profile">
        {modal?.type === "detail" && (
          <ProductDetail product={modal.product} onEdit={handleDetailEdit} />
        )}
      </Modal>
    </div>
  );
}