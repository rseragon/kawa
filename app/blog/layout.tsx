export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col place-items-center">
      <div className="inline-block w-full max-w-4xl text-pretty justify-center">
        {children}
      </div>
    </section>
  );
}
