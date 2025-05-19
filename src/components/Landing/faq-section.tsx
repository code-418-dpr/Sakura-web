import React, { useRef } from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import { motion, useInView } from "framer-motion";
import { Icon } from "@iconify/react";
import { faqs } from "../../mocks/faq-data";

const FaqSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            },
        },
    };

    return (
        <section className="py-24 relative bg-gradient-to-b from-background to-content1/30" ref={sectionRef}>
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500 bg-clip-text text-transparent">
                        Часто задаваемые вопросы
                    </h2>
                    <p className="text-foreground-500 max-w-2xl mx-auto">
                        Найдите ответы на распространенные вопросы о лотерее Sakura, о том, как играть
                        и как получить свой выигрыш.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="max-w-3xl mx-auto"
                >
                    <Accordion variant="bordered" selectionMode="multiple" className="px-0">
                        {faqs.map((faq) => (
                            <AccordionItem
                                key={faq.id}
                                aria-label={faq.question}
                                title={
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 ml-4">
                                            <Icon icon={faq.icon} className="text-primary-500" />
                                        </div>
                                        <span className="font-medium">{faq.question}</span>
                                    </div>
                                }
                                className="py-2"
                                motionProps={{
                                    variants: {
                                        enter: {
                                            y: 0,
                                            opacity: 1,
                                            height: "auto",
                                            transition: {
                                                height: {
                                                    type: "spring",
                                                    stiffness: 100,
                                                    damping: 15,
                                                },
                                                opacity: { duration: 0.2 },
                                            },
                                        },
                                        exit: {
                                            y: -10,
                                            opacity: 0,
                                            height: 0,
                                            transition: {
                                                height: { duration: 0.2 },
                                                opacity: { duration: 0.3 },
                                            },
                                        },
                                    },
                                }}
                            >
                                <div className="pl-12 pr-4 pb-2 text-foreground-600">
                                    {faq.answer}
                                </div>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-center mt-12"
                >
                    <p className="text-foreground-500 mb-4">Остались еще вопросы?</p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block"
                    >
                        <div className="flex items-center gap-2 text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text font-medium cursor-pointer">
                            <span>Свяжитесь с нашей службой поддержки</span>
                            <Icon icon="lucide:arrow-right" className="text-primary-500" />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default FaqSection;