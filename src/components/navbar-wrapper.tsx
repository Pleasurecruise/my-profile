"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

export default function NavbarWrapper() {
	const _pathname = usePathname();
	return <Navbar />;
}
