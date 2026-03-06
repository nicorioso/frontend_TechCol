import Entities from "../../components/dashboard/entities";
import MainFooter from "../../components/IU/footers/MainFooter";
import MainHeader from "../../components/IU/headers/Main";
import SeoHead from "../../seo/SeoHead";

export default function userEntities() {
    return (   
        <>
            <SeoHead routeKey="private" override={{ path: "/user/entities", title: "Entidades de Usuario | TechCol" }} />
            <Entities/>
        </>
    );
}
