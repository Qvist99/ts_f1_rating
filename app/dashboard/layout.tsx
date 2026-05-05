
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="pt-[76px] min-h-screen">
      {children}
    </main>
  );
}
