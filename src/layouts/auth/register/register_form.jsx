import MainHeader from "../../../components/IU/headers/Main";
import RegisterForm from "../../../components/auth/register/form";
import MainFooter from "../../../components/IU/footers/MainFooter";

function RegisterLayout() {

  return (
    <>
    <main className="flex flex-col min-h-screen"> 
      <MainHeader/>
      <RegisterForm/>
      <MainFooter/>
    </main>
    </>
  );  
}

export default RegisterLayout;
