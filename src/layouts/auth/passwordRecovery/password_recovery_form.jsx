import MainHeader from "../../../components/IU/headers/Main";
import PasswordRecovery from "../../../components/auth/passwordRecovery/form";
import MainFooter from "../../../components/IU/footers/MainFooter";
import SeoHead from "../../../seo/SeoHead";

function PasswordRecoveryLayout() {
  return (
    <>
      <SeoHead
        routeKey="auth"
        override={{ path: "/auth/password-recovery", title: "Recuperar Contrasena | TechCol" }}
      />
      <main className="flex min-h-screen flex-col">
        <MainHeader />
        <PasswordRecovery />
        <MainFooter />
      </main>
    </>
  );
}

export default PasswordRecoveryLayout;
