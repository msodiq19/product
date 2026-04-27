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
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-surface)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Package size={20} color="var(--bg-surface)" />
            </div>
            <span style={{ fontWeight: 700, fontSize: "17px", letterSpacing: "-0.02em" }}>
              ProductHub
            </span>
          </div>

          <button
            onClick={() => setModal({ type: "create" })}
            id="add-product-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "9px 16px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "opacity 0.15s",
              boxShadow: "0 4px 12px var(--accent-dim)"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <Plus size={16} />
            <span>New Product</span>
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "4px" }}>
              Inventory
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              {isLoading ? "Retrieving catalogue..." : `Showing ${paginated.length} of ${filtered.length} products`}
            </p>
          </div>

          <div style={{ display: "flex", gap: "6px", background: "var(--bg-hover)", padding: "4px", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                background: viewMode === "grid" ? "var(--bg-surface)" : "transparent",
                color: viewMode === "grid" ? "var(--text-primary)" : "var(--text-muted)",
                border: viewMode === "grid" ? "1px solid var(--border)" : "1px solid transparent",
                padding: "6px 10px",
                borderRadius: "6px",
                cursor: "pointer",
                boxShadow: viewMode === "grid" ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
                transition: "all 0.15s",
              }}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                background: viewMode === "list" ? "var(--bg-surface)" : "transparent",
                color: viewMode === "list" ? "var(--text-primary)" : "var(--text-muted)",
                border: viewMode === "list" ? "1px solid var(--border)" : "1px solid transparent",
                padding: "6px 10px",
                borderRadius: "6px",
                cursor: "pointer",
                boxShadow: viewMode === "list" ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
                transition: "all 0.15s",
              }}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "2rem",
            alignItems: "stretch",
          }}
        >
          <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                pointerEvents: "none",
              }}
            />
            <input
              id="search-input"
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
              style={{
                width: "100%",
                height: "100%",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "10px 14px 10px 40px",
                color: "var(--text-primary)",
                fontSize: "14px",
                outline: "none",
                fontFamily: "inherit",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--accent)";
                e.target.style.boxShadow = "0 0 0 3px var(--accent-dim)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ position: "relative", width: "220px" }}>
            <select
              value={category}
              onChange={handleCategoryChange}
              style={{
                width: "100%",
                height: "100%",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "var(--text-primary)",
                fontSize: "14px",
                outline: "none",
                fontFamily: "inherit",
                cursor: "pointer",
                appearance: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            >
              <option value="All">All Categories</option>
              {dynamicCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }}>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {isError && (
          <div
            style={{
              background: "var(--danger-dim)",
              border: "1px solid rgba(220,38,38,0.2)",
              borderRadius: "10px",
              padding: "1rem 1.25rem",
              color: "var(--danger)",
              fontSize: "14px",
              marginBottom: "1.5rem",
            }}
          >
            Failed to load catalogue: {(error as Error)?.message ?? "Network error encountered."}
          </div>
        )}

        {isLoading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(260px, 1fr))" : "1fr",
              gap: "1.5rem",
            }}
          >
            {Array.from({ length: viewMode === "grid" ? 8 : 5 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 2rem",
              color: "var(--text-muted)",
              background: "var(--bg-surface)",
              border: "1px dashed var(--border)",
              borderRadius: "12px",
            }}
          >
            <Package size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
            <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>No products found</p>
            <p style={{ fontSize: "14px" }}>Try adjusting your search terms or category filters.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(260px, 1fr))" : "1fr",
              gap: "1.5rem",
            }}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "3rem",
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: "8px 14px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: page === 1 ? "var(--text-muted)" : "var(--text-primary)",
                cursor: page === 1 ? "not-allowed" : "pointer",
                fontSize: "13px",
                fontFamily: "inherit",
                fontWeight: 600,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { if (page !== 1) e.currentTarget.style.background = "var(--bg-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-surface)"; }}
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
                  <span key={`ellipsis-${idx}`} style={{ color: "var(--text-muted)", fontSize: "13px", padding: "0 4px" }}>
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item as number)}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      border: "1px solid",
                      background: page === item ? "var(--text-primary)" : "var(--bg-surface)",
                      borderColor: page === item ? "var(--text-primary)" : "var(--border)",
                      color: page === item ? "var(--bg-surface)" : "var(--text-secondary)",
                      fontSize: "14px",
                      fontWeight: page === item ? 600 : 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.15s"
                    }}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: "8px 14px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: page === totalPages ? "var(--text-muted)" : "var(--text-primary)",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                fontSize: "13px",
                fontFamily: "inherit",
                fontWeight: 600,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { if (page !== totalPages) e.currentTarget.style.background = "var(--bg-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-surface)"; }}
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