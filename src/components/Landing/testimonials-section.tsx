import React, { useRef } from "react";
import { Card, CardBody, Avatar } from "@heroui/react";
import { motion, useInView } from "framer-motion";
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
                delayChildren: 0.3
            }
        }
    };

    const cardVariants = (index: number) => ({
        hidden: {
            opacity: 0,
            x: index % 2 === 0 ? -50 : 50,
            y: 20
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: index * 0.1
            }
        }
    });

    return (
        <section className="py-24 relative bg-gradient-to-b from-content1/30 via-background to-background" ref={sectionRef}>
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500 bg-clip-text text-transparent">Что о нас говорят наши игроки</h2>
                    <p className="text-foreground-500 max-w-2xl mx-auto">
                        Не верьте нам на слово. Расскажите о нашем сообществе игроков, которые почувствовали разницу с Sakura.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            variants={cardVariants(index)}
                            whileHover={{
                                y: -5,
                                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
                                transition: { duration: 0.3 }
                            }}
                        >
                            <Card className="border border-divider h-full overflow-hidden">
                                <CardBody className="p-6 bg-gradient-to-br from-content1 to-content2">
                                    <div className="flex items-start mb-4">
                                        <Avatar
                                            src={testimonial.avatar}
                                            size="lg"
                                            className="mr-4"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold">{testimonial.name}</h3>
                                            <p className="text-sm text-foreground-500">{testimonial.role}</p>
                                            <div className="flex mt-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <motion.span
                                                        key={i}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{
                                                            delay: 0.3 + (i * 0.1),
                                                            type: "spring",
                                                            stiffness: 200,
                                                            damping: 10
                                                        }}
                                                    >
                                                        <Icon
                                                            icon="lucide:star"
                                                            className={`${
                                                                i < testimonial.rating
                                                                    ? "text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text fill-current"
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
                                            className="absolute -top-2 -left-1 text-primary-200 text-4xl opacity-50 transform -scale-x-100"
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