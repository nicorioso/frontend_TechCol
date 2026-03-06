import MainHeader from "../../../components/IU/headers/Main";
import RegisterForm from "../../../components/auth/register/form";
import MainFooter from "../../../components/IU/footers/MainFooter";
import SeoHead from "../../../seo/SeoHead";

function RegisterLayout() {

  return (
    <>
    <SeoHead routeKey="auth" override={{ path: "/auth/register", title: "Registro de Usuario | TechCol" }} />
    <main className="flex flex-col min-h-screen"> 
      <MainHeader/>
      <RegisterForm/>
      <MainFooter/>
    </main>
    </>
  );  
}

export default RegisterLayout;
