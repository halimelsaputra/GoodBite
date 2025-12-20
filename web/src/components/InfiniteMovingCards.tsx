import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type MovingCardItem = {
  quote: string;
  name: string;
  title: string;
  imageSrc?: string;
  href?: string;
};

type Props = {
  items: MovingCardItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
};

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;
    const scroller = scrollerRef.current;

    // Remove old clones (so updates re-clone fresh items)
    Array.from(scroller.children).forEach((node) => {
      if ((node as HTMLElement).dataset.clone === "true") {
        scroller.removeChild(node);
      }
    });

    const originals = Array.from(scroller.children);
    originals.forEach((item) => {
      const clone = item.cloneNode(true) as HTMLElement;
      clone.dataset.clone = "true";
      scroller.appendChild(clone);
    });

    setStart(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  // Update animation config whenever direction/speed change
  useEffect(() => {
    setDirection();
    setSpeed();
  }, [direction, speed]);

  const setDirection = () => {
    if (!containerRef.current) return;
    const dir = direction === "left" ? "forwards" : "reverse";
    containerRef.current.style.setProperty("--animation-direction", dir);
  };

  const setSpeed = () => {
    if (!containerRef.current) return;
    const duration = speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
    containerRef.current.style.setProperty("--animation-duration", duration);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item) => {
          const cardBody = (
            <div className="space-y-5">
              {item.imageSrc && (
                <div className="h-56 w-full overflow-hidden rounded-2xl">
                  <img
                    src={item.imageSrc}
                    alt={item.quote}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
              )}
              <blockquote>
                <span className="relative z-20 text-lg leading-[1.6] font-semibold text-neutral-900 dark:text-gray-100 block">
                  {item.quote}
                </span>
                <div className="relative z-20 mt-3 flex flex-row items-center">
                  <span className="flex flex-col gap-1">
                    <span className="text-sm leading-[1.6] font-medium text-neutral-600 dark:text-gray-300">
                      {item.name}
                    </span>
                    <span className="text-sm leading-[1.6] font-normal text-neutral-500 dark:text-gray-400">
                      {item.title}
                    </span>
                  </span>
                </div>
              </blockquote>
            </div>
          );

          const content = item.href ? (
            <Link
              to={item.href}
              className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-3xl"
            >
              {cardBody}
            </Link>
          ) : (
            cardBody
          );

          return (
            <li
              key={item.name + item.title}
              className="relative w-[420px] max-w-full shrink-0 rounded-3xl border border-zinc-200 bg-[linear-gradient(180deg,#fafafa,#f5f5f5)] px-10 py-8 md:w-[520px] shadow-x1 hover:shadow-2xl transition-shadow dark:border-zinc-700 dark:bg-[linear-gradient(180deg,#27272a,#18181b)]"
            >
              {content}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
