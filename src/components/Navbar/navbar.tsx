"use client";

import Link from "next/link";

import { Button, Image, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";

import { ThemeSwitcher } from "../theme-switcher";

export default function NavbarElement() {
    return (
        <Navbar>
            <NavbarBrand className="gap-x-4">
                <Image alt="Sakura Logo" src="sakura.png" width={32} height={32} />
                <p className="font-bold text-inherit">SAKURA</p>
            </NavbarBrand>
            <NavbarContent className="hidden gap-4 sm:flex" justify="center">
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Features
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link aria-current="page" href="#">
                        Customers
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Integrations
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Button as={Link} color="primary" href="#" variant="flat">
                        Войти
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <ThemeSwitcher />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
