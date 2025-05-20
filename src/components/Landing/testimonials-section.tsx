import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";
import { Avatar, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

import { testimonials } from "../../mocks/testimonials-data";

const TestimonialsSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const cardVariants = (index: number) => ({
        hidden: {
            opacity: 0,
            x: index % 2 === 0 ? -50 : 50,
            y: 20,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: index * 0.1,
            },
        },
    });

    return (
        <section
            className="from-content1/30 via-background to-background relative bg-gradient-to-b py-24"
            ref={sectionRef}
        >
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 text-center"
                >
                    <h2 className="from-primary-500 via-primary-400 to-secondary-500 mb-4 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                        Что о нас говорят наши игроки
                    </h2>
                    <p className="text-foreground-500 mx-auto max-w-2xl">
                        Не верьте нам на слово — послушайте тех, кто уже выиграл вместе с Sakura.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 gap-8 md:grid-cols-2"
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            variants={cardVariants(index)}
                            whileHover={{
                                y: -5,
                                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
                                transition: { duration: 0.3 },
                            }}
                        >
                            <Card className="border-divider h-full overflow-hidden border">
                                <CardBody className="from-content1 to-content2 bg-gradient-to-br p-6">
                                    <div className="mb-4 flex items-start">
                                        <Avatar
                                            src={testimonial.avatar}
                                            size="lg"
                                            className="mr-4"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold">{testimonial.name}</h3>
                                            <p className="text-foreground-500 text-sm">
                                                {testimonial.role}
                                            </p>
                                            <div className="mt-1 flex">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <motion.span
                                                        key={i}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{
                                                            delay: 0.3 + i * 0.1,
                                                            type: "spring",
                                                            stiffness: 200,
                                                            damping: 10,
                                                        }}
                                                    >
                                                        <Icon
                                                            icon={
                                                                i < testimonial.rating
                                                                    ? "bi:star-fill"
                                                                    : "bi:star"
                                                            }
                                                            className={`${
                                                                i < testimonial.rating
                                                                    ? "text-yellow-400"
                                                                    : "text-foreground-300"
                                                            } text-lg`}
                                                        />
                                                    </motion.span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <Icon
                                            icon="lucide:quote"
                                            className="text-primary-200 absolute -top-2 -left-1 -scale-x-100 transform text-4xl opacity-50"
                                        />
                                        <p className="text-foreground-600 relative z-10 pl-6 italic">
                                            {testimonial.text}
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
