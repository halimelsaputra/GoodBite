"use client";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import React, { useRef, useState } from "react";

type NavItem = { name: string; link: string };

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: NavItem[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 40);
  });

  return (
    <motion.div ref={ref} className={cn("fixed inset-x-0 top-0 z-50 w-full px-4", className)}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ visible?: boolean }>, { visible })
          : child,
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => (
  <motion.div
    initial={false}
    animate={{
      backdropFilter: visible ? "blur(12px)" : "none",
      boxShadow: visible
        ? "0 12px 40px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.08) inset"
        : "none",
      y: visible ? 6 : 0,
      scale: visible ? 0.92 : 1,
      maxWidth: visible ? "900px" : "1200px",
      paddingLeft: visible ? 12 : 16,
      paddingRight: visible ? 12 : 16,
      paddingTop: visible ? 10 : 12,
      paddingBottom: visible ? 10 : 12,
    }}
    transition={{ type: "spring", stiffness: 200, damping: 40 }}
    className={cn(
      "relative z-[60] mx-auto hidden w-full flex-row items-center justify-between rounded-full bg-black/70 px-4 py-3 lg:flex border border-white/10 text-white",
      className,
    )}
  >
    {children}
  </motion.div>
);

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "relative hidden flex-1 flex-row items-center justify-center gap-2 text-sm font-semibold text-white lg:flex",
        className,
      )}
    >
      {items.map((item, idx) => (
        <motion.a
          layout
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-1"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div layoutId="hovered" className="absolute inset-0 rounded-full bg-white/15" />
          )}
          <span className="relative z-20">{item.name}</span>
        </motion.a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => (
  <motion.div
    initial={false}
    animate={{
      backdropFilter: visible ? "blur(10px)" : "none",
      boxShadow: visible
        ? "0 0 24px rgba(34,42,53,0.06), 0 1px 1px rgba(0,0,0,0.05), 0 0 0 1px rgba(34,42,53,0.04)"
        : "none",
      y: visible ? 6 : 0,
    }}
    transition={{ type: "spring", stiffness: 200, damping: 50 }}
    className={cn(
      "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between rounded-2xl bg-black/70 px-3 py-3 lg:hidden border border-white/10 text-white",
      className,
    )}
  >
    {children}
  </motion.div>
);

export const MobileNavHeader = ({ children, className }: MobileNavHeaderProps) => (
  <div className={cn("flex w-full flex-row items-center justify-between", className)}>{children}</div>
);

export const MobileNavMenu = ({ children, className, isOpen }: MobileNavMenuProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        className={cn(
          "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start gap-4 rounded-lg bg-white px-4 py-6 shadow-lg border border-white/50 dark:bg-neutral-950 dark:border-neutral-800",
          className,
        )}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export const MobileNavToggle = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) =>
  isOpen ? (
    <X className="text-white h-6 w-6" onClick={onClick} />
  ) : (
    <Menu className="text-white h-6 w-6" onClick={onClick} />
  );

export const NavbarLogo = ({
  name,
  children,
  href = "/",
}: {
  name: string;
  children?: React.ReactNode;
  href?: string;
}) => (
  <a href={href} className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-white">
    {children}
    <span className="font-semibold text-white">{name}</span>
  </a>
);

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
} & (React.ComponentPropsWithoutRef<"a"> | React.ComponentPropsWithoutRef<"button">)) => {
  const baseStyles =
    "px-4 py-2 rounded-full border text-sm font-semibold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-flex items-center gap-2";
  const variantStyles = {
    primary: "bg-white text-black border-white/60 shadow",
    secondary: "bg-transparent text-white border-white/40 hover:bg-white/10",
  };

  return (
    <Tag href={href || undefined} className={cn(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </Tag>
  );
};
