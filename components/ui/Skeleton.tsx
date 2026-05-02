export function ProductCardSkeleton() {
    return (
        <div
            className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl overflow-hidden animate-[pulse_1.8s_ease-in-out_infinite]"
        >
            <div className="h-[200px] bg-[var(--bg-elevated)]" />
            <div className="p-4">
                <div className="h-[10px] w-2/5 bg-[var(--bg-elevated)] rounded mb-[10px]" />
                <div className="h-[14px] w-3/4 bg-[var(--bg-elevated)] rounded mb-2" />
                <div className="h-[12px] w-[55%] bg-[var(--bg-elevated)] rounded mb-5" />
                <div className="flex justify-between items-center">
                    <div className="h-[20px] w-[30%] bg-[var(--bg-elevated)] rounded" />
                    <div className="h-[32px] w-[32px] bg-[var(--bg-elevated)] rounded-lg" />
                </div>
            </div>
        </div>
    );
}
