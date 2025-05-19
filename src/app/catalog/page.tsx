"use client";

//import { useDisclosure } from "@heroui/react";
import { useState } from "react";

import FooterElement from "@/components/Footer/footer";
import NavbarElement from "@/components/Navbar/navbar";
import { SearchCardOrDrawer } from "@/components/search-card-or-drawer";
import { Tab } from "@/types/tabs";

import { SearchForm } from "./_components/search-form";

export default function CatalogPage() {
    //const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [activeTab, setActiveTab] = useState<Tab>("main");
    // const { user } = useContext(AuthContext)!;

    return (
        <div>
            <NavbarElement activeTab={activeTab} setActiveTabAction={setActiveTab} />
            <div className="container mx-auto py-6">
                <SearchCardOrDrawer>
                    {" "}
                    <SearchForm />
                </SearchCardOrDrawer>
            </div>
            <FooterElement />
        </div>
    );
}
