import ResetPassword from "./_components/ResetPassword";

export default function ResetPasswordPage({
                                              searchParams,
                                          }: {
    searchParams: { token?: string };
}) {
    return <ResetPassword token={searchParams.token} />;
}
