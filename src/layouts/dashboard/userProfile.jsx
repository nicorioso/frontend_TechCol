import Profile from "../../components/dashboard/profile";
import MainFooter from "../../components/IU/footers/MainFooter";
import MainHeader from "../../components/IU/headers/Main";

export default function UserProfile() {
    return (   
        <>
            <MainHeader />
            <main className="min-h-screen bg-white dark:bg-gray-900">
                <Profile />
            </main>
            <MainFooter />
        </>
    );
}