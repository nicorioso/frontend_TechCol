import MainHeader from "../../components/IU/headers/Main";
import Home from "../../components/home/page";
import MainFooter from "../../components/IU/footers/MainFooter";
import SeoHead from "../../seo/SeoHead";
import { buildOrganizationSchema } from "../../seo/schema";

export function HomePage() {
  return (
    <>
      <SeoHead routeKey="home" schema={buildOrganizationSchema()} />
      <main className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
        <MainHeader/>
        <Home/>
        <MainFooter/>
      </main>
    </>
  );
}

export default HomePage;
