import UserSidebar from "../IU/section/userSidebar";

import {
  HomeIcon,
  Square2StackIcon,
  TicketIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";


export default function Profile() {
    return (
        <>
        <div className="flex">
            <UserSidebar
            items={[
                { label: "Home", icon: HomeIcon, href: "/" },
                { label: "Events", icon: Square2StackIcon, href: "/events" },
                { label: "Orders", icon: TicketIcon, href: "/orders" },
                { label: "Broadcasts", icon: MegaphoneIcon, href: "/broadcasts" },
                { label: "Settings", icon: Cog6ToothIcon, href: "/settings" },
            ]}
            user={{
                name: "Erica",
                image: "https://i.pravatar.cc/40"
            }}
            />
            <main className="flex-1 p-10">
                H
            </main>
        </div>
        </>
    );
}
