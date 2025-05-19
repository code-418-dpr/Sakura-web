import React from "react";

import { ContactInfo } from "@/app/user-profile/_components/contact-info";
import { PersonalInfo } from "@/app/user-profile/_components/personal-info";
import { PersonalInfoProps } from "@/lib/user-personal-info-props";
import { Tab, Tabs } from "@heroui/react";

export function ProfileTabs({ user }: PersonalInfoProps) {
    return (
        <div className="flex w-full flex-col pt-4">
            <Tabs aria-label="Options" fullWidth={true}>
                <Tab key="info" title="Личная информация" className="flex-1 py-4 text-center">
                    <div className="space-y-4">
                        <PersonalInfo user={user} />
                        <div className="space-y-4">
                            <ContactInfo user={user} />
                        </div>
                    </div>
                </Tab>
                <Tab key="payment" title="Реквизиты" className="flex-1 py-4 text-center">
                    <div className="space-y-4">
                        <p>Ведётся разработка</p>
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
}
