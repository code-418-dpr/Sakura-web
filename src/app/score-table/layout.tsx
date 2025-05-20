"use client";

import React, { Suspense, useState } from "react";

import FooterElement from "@/components/Footer/footer";
import NavbarElement from "@/components/Navbar/navbar";
import { PageTab } from "@/types/tabs";

import Loading from "./loading";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = useState<PageTab>("score");
    return (
        <Suspense fallback={<Loading />}>
            <NavbarElement activeTab={activeTab} setActiveTabAction={setActiveTab} />
            <div className="container mx-auto py-6">{children}</div>
            <FooterElement />
        </Suspense>
    );
}
