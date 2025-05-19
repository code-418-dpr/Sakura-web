import { motion, useInView } from "framer-motion";

import React, { useRef } from "react";

import { Button, Divider, Input, Link } from "@heroui/react";
import { Icon } from "@iconify/react";

import { footerData } from "../../mocks/footer-data";

const Footer: React.FC = () => {
    const footerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(footerRef, { once: false, amount: 0.2 });

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    };

    return (
        <footer
            ref={footerRef}
            className="from-content1/50 to-content2/50 border-divider relative overflow-hidden border-t bg-gradient-to-b pt-16 pb-8"
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="container mx-auto px-6"
            >
                <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand & Social */}
                    <motion.div variants={itemVariants}>
                        <div className="mb-4 flex items-center gap-2">
                            <Icon
                                icon="lucide:cherry"
                                className="from-primary-500 to-secondary-500 bg-gradient-to-r bg-clip-text text-2xl text-transparent"
                            />
                            <h3 className="text-xl font-bold">Sakura Лотерея</h3>
                        </div>
                        <p className="text-foreground-500 mb-6">
                            Каждый билет превращает мечты в реальность. Играть ответственным и испытывающим радость
                            победы.
                        </p>
                        <div className="flex gap-4">
                            {footerData.socialLinks.map((social, idx) => (
                                <motion.a
                                    key={idx}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="from-content2 to-content3 hover:from-content3 hover:to-content4 rounded-full bg-gradient-to-br p-2 transition-all duration-300"
                                    aria-label={social.label}
                                >
                                    <Icon icon={social.icon} className="text-xl" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick & Legal Links */}
                    <motion.div variants={itemVariants}>
                        <h3 className="mb-4 text-lg font-semibold">Ссылки</h3>
                        <ul className="space-y-2">
                            {footerData.quickLinks.slice(0, 3).map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        color="foreground"
                                        className="hover:from-primary-500 hover:to-secondary-500 flex items-center gap-1 transition-colors hover:bg-gradient-to-r hover:bg-clip-text hover:text-transparent"
                                    >
                                        <Icon icon="lucide:chevron-right" className="text-sm" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <h3 className="mt-6 mb-4 text-lg font-semibold">Юридическая информация</h3>
                        <ul className="space-y-2">
                            {footerData.legalLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        color="foreground"
                                        className="hover:from-primary-500 hover:to-secondary-500 flex items-center gap-1 transition-colors hover:bg-gradient-to-r hover:bg-clip-text hover:text-transparent"
                                    >
                                        <Icon icon="lucide:chevron-right" className="text-sm" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Resources & Contact */}
                    <motion.div variants={itemVariants}>
                        <h3 className="mb-4 text-lg font-semibold">Ресурсы</h3>
                        <ul className="space-y-2">
                            {footerData.resourceLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        color="foreground"
                                        className="hover:from-primary-500 hover:to-secondary-500 flex items-center gap-1 transition-colors hover:bg-gradient-to-r hover:bg-clip-text hover:text-transparent"
                                    >
                                        <Icon icon="lucide:chevron-right" className="text-sm" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <h3 className="mt-6 mb-4 text-lg font-semibold">Контакты</h3>
                        <ul className="space-y-3">
                            {footerData.contactInfo.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <Icon icon={item.icon} className="text-primary-500 mt-1" />
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Subscribe & App Download */}
                    <motion.div variants={itemVariants}>
                        <h3 className="mb-4 text-lg font-semibold">Подписывайтесь на обновления</h3>
                        <p className="text-foreground-500 mb-4">
                            Будьте в курсе последних розыгрышей, рекламных акций и победителей.
                        </p>
                        <div className="flex flex-col gap-2">
                            <Input
                                placeholder="Ваш email"
                                type="email"
                                variant="bordered"
                                radius="full"
                                startContent={<Icon icon="lucide:mail" className="text-foreground-400" />}
                            />
                            <Button
                                color="primary"
                                radius="full"
                                className="from-primary-500 to-secondary-500 w-full bg-gradient-to-r"
                            >
                                Subscribe
                            </Button>
                        </div>

                        <div className="mt-6">
                            <h4 className="mb-2 font-semibold">Установите наше приложение</h4>
                            <div className="flex gap-2">
                                <Button variant="flat" className="flex items-center gap-2" size="sm">
                                    <Icon icon="logos:apple" className="text-xl" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs">Установить на</span>
                                        <span className="text-sm font-medium">App Store</span>
                                    </div>
                                </Button>
                                <Button variant="flat" className="flex items-center gap-2" size="sm">
                                    <Icon icon="logos:google-play-icon" className="text-xl" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs">Установить с</span>
                                        <span className="text-sm font-medium">Google Play</span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <Divider className="my-6" />

                <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center justify-between gap-4 md:flex-row"
                >
                    <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                        {footerData.paymentMethods.map((method, idx) => (
                            <Icon key={idx} icon={method.icon} className="text-foreground-400 text-2xl" />
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon icon="lucide:shield-check" className="text-success-500" />
                        <span className="text-sm">Secure Payments</span>
                    </div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="border-divider text-foreground-500 mt-8 border-t pt-6 text-center text-sm"
                >
                    <p>© {new Date().getFullYear()} Сакура Лотерея. Все права защищены.</p>
                    <p className="mt-2">Азартные игры могут вызывать привыкание. Пожалуйста, играйте ответственно.</p>
                </motion.div>
            </motion.div>

            {/* Decorative SVG overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.05 } : { opacity: 0 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="pointer-events-none absolute top-0 left-0 h-full w-full"
                style={{
                    backgroundImage:
                        'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ff6680" fill-opacity="0.2"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
                }}
            />
        </footer>
    );
};

export default Footer;
