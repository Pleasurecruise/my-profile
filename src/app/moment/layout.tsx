export default function MomentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-[100vw] ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    );
}
