import MainFooter from "../../components/IU/footers/MainFooter";
import MainHeader from "../../components/IU/headers/Main";
import ProductCatalog from "../../components/catalog/ProductCatalog";

export default function CatalogLayout() {
  return (
    <main className="flex min-h-screen flex-col">
      <MainHeader />
      <ProductCatalog />
      <MainFooter />
    </main>
  );
}
