import LoginDialog from '@/components/ui/LoginDialog'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      {children}
      <LoginDialog />
    </main>
  );
}
