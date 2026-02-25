import * as React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'rectangle' | 'circle' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", variant = 'rectangle' }) => {
    const baseStyles = "bg-stone-200 dark:bg-stone-800 animate-pulse";

    const variantStyles = {
        rectangle: "rounded-xl",
        circle: "rounded-full",
        text: "rounded h-4 w-full"
    };

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        />
    );
};

export const SkeletonCard = () => (
    <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 p-5 space-y-4 shadow-sm">
        <Skeleton className="w-full aspect-video rounded-[2rem]" />
        <div className="space-y-3 px-1">
            <Skeleton className="h-6 w-3/4" />
            <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-24 rounded-full" />
            </div>
        </div>
    </div>
);
