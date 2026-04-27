export function ProductCardSkeleton() {
    return (
        <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden animate-skeleton">
            <div className="h-[200px] bg-elevated" />
            <div className="p-4">
                <div className="h-[10px] w-[40%] bg-elevated rounded mb-[10px]" />
                <div className="h-[14px] w-[75%] bg-elevated rounded mb-2" />
                <div className="h-[12px] w-[55%] bg-elevated rounded mb-5" />
                <div className="flex justify-between items-center">
                    <div className="h-5 w-[30%] bg-elevated rounded" />
                    <div className="h-8 w-8 bg-elevated rounded-lg" />
                </div>
            </div>
        </div>
    );
}
