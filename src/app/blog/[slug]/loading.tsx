"use client";

import { useEffect, useState } from "react";
import { LoaderFive } from "@/components/aceternityui/loader";

export default function Loading() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const value = sessionStorage.getItem("blog:navigate-from-tree");
    if (value) {
      sessionStorage.removeItem("blog:navigate-from-tree");
      setShouldShow(true);
    }
  }, []);

  if (!shouldShow) {
    return null;
  }

  return (
    <section className="flex min-h-[40vh] items-center justify-center">
      <LoaderFive text="Loading post..." />
    </section>
  );
}
