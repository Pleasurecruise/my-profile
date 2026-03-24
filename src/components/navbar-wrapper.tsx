"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

export default function NavbarWrapper() {
	const pathname = usePathname();
	if (pathname === "/") return null;
	return <Navbar />;
}
