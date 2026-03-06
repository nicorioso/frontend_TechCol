import Profile from "../../components/dashboard/profile";
import MainFooter from "../../components/IU/footers/MainFooter";
import MainHeader from "../../components/IU/headers/Main";
import SeoHead from "../../seo/SeoHead";

export default function UserProfile() {
    return (   
        <>
            <SeoHead routeKey="private" override={{ path: "/user/profile", title: "Perfil de Usuario | TechCol" }} />
            <MainHeader />
            <main className="min-h-screen bg-white dark:bg-gray-900">
                <Profile />
            </main>
            <MainFooter />
        </>
    );
}
