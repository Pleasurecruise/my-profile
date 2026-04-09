import type { ReactNode } from "react";

interface BlogContentProps {
	children: ReactNode;
	className?: string;
}

export function BlogContent({ children, className }: BlogContentProps) {
	return <article className={className}>{children}</article>;
}
