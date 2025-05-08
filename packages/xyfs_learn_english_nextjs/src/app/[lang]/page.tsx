import { ModeToggle } from "../../componentsMy/themes";
import { getDictionary } from "./dictionaries";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: 'en' | 'nl'; }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang); // en
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <ModeToggle></ModeToggle>

        <button>{dict.products.cart}</button> // Add to Cart
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
