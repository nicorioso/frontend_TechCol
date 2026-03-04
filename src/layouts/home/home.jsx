import MainHeader from "../../components/IU/headers/Main";
import Home from "../../components/home/page";
import MainFooter from "../../components/IU/footers/MainFooter";

export function HomePage() {
  return (
    <>
      <main className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
        <MainHeader/>
        <Home/>
        <MainFooter/>
      </main>
    </>
  );
}

export default HomePage;
