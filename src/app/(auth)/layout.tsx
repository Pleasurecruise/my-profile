import { auth } from "@/lib/auth";
import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (session?.user) {
        return redirect("/");
    }

    return <div className="">{children}</div>;
}
