import ResetPassword from "./_components/ResetPassword";

export default async function ResetPasswordPage({
	searchParams,
}: {
	searchParams: Promise<{ token?: string }>;
}) {
	const { token } = await searchParams;
	return <ResetPassword token={token} />;
}
