"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

export function NavLink({ href, children, ...props }: ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href.toString());

  return (
    <Link href={href} className={isActive ? "active" : undefined} {...props}>
      {children}
    </Link>
  );
}
