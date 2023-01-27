import Nav from "~/components/Nav";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="flex">{children}</main>
    </>
  );
}
