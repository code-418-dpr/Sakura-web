import { useInView } from "framer-motion";

import React, { useEffect, useRef } from "react";

interface SectionScrollSnapProps {
    children: React.ReactNode;
    id: string;
    className?: string;
}

export const SectionScrollSnap: React.FC<SectionScrollSnapProps> = ({ children, id, className = "" }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, {
        margin: "-40% 0px -40% 0px",
        once: false,
    });

    useEffect(() => {
        // Только когда секция в зоне видимости и есть ref
        if (!isInView || !sectionRef.current) return;

        const timer = setTimeout(() => {
            const el = sectionRef.current!;
            const rect = el.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Насколько элемент смещён от центра
            const distanceFromCenter = rect.top + rect.height / 2 - viewportHeight / 2;

            const threshold = viewportHeight * 0.2; // 20% высоты

            if (Math.abs(distanceFromCenter) < threshold) {
                window.scrollTo({
                    top: window.scrollY + distanceFromCenter,
                    behavior: "smooth",
                });
            }
        }, 100);

        return () => {
            clearTimeout(timer);
        };
    }, [isInView]);

    return (
        <section id={id} ref={sectionRef} className={className} data-section-id={id}>
            {children}
        </section>
    );
};
