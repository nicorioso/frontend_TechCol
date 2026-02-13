import Profile from "../../components/dashboard/profile";
import MainFooter from "../../components/IU/footers/MainFooter";
import MainHeader from "../../components/IU/headers/Main";

export function userProfile() {
    return (   
        <>
            <MainHeader/>
                <Profile/>
            <MainFooter/>
        </>
    );
}