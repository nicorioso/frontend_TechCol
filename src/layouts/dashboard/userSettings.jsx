import Settings from "../../components/dashboard/settings";
import MainFooter from "../../components/IU/footers/MainFooter";
import MainHeader from "../../components/IU/headers/Main";
import SeoHead from "../../seo/SeoHead";

export default function userSettings() {
    return (   
        <>
            <SeoHead routeKey="private" override={{ path: "/user/settings", title: "Configuracion de Usuario | TechCol" }} />
            <Settings/>
        </>
    );
}
