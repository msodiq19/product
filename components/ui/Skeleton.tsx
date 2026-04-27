export function ProductCardSkeleton() {
    return (
        <div
            style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "12px",
                overflow: "hidden",
                animation: "pulse 1.8s ease-in-out infinite",
            }}
        >
            <div style={{ height: "200px", background: "var(--bg-elevated)" }} />
            <div style={{ padding: "1rem" }}>
                <div style={{ height: "10px", width: "40%", background: "var(--bg-elevated)", borderRadius: "4px", marginBottom: "10px" }} />
                <div style={{ height: "14px", width: "75%", background: "var(--bg-elevated)", borderRadius: "4px", marginBottom: "8px" }} />
                <div style={{ height: "12px", width: "55%", background: "var(--bg-elevated)", borderRadius: "4px", marginBottom: "20px" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ height: "20px", width: "30%", background: "var(--bg-elevated)", borderRadius: "4px" }} />
                    <div style={{ height: "32px", width: "32px", background: "var(--bg-elevated)", borderRadius: "8px" }} />
                </div>
            </div>
            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1 }
          50% { opacity: 0.5 }
        }
      `}</style>
        </div>
    );
}
