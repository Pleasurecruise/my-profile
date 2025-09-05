"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { toast } from "sonner";

const BLUR_FADE_DELAY = 0.04;

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const resetPassword = async () => {
        setLoading(true);

        if (password !== checkPassword) {
            toast.error("Passwords do not match", {
                description: "Please make sure both passwords are identical.",
            });
            setLoading(false);
            return;
        }

        if (!token) {
            toast.error("Invalid or missing token", {
                description: "The reset link might be invalid or expired.",
            });
            setLoading(false);
            return;
        }

        await authClient.resetPassword({
            token,
            newPassword: password,
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Password reset successfully", {
                        description: "You can now log in with your new password.",
                    });
                    router.push("/login");
                },
                onError: (ctx) => {
                    toast.error("Error", {
                        description: ctx.error.message,
                    });
                },
                onResponse: () => {
                    setLoading(false);
                },
            },
        });
    };

    return (
        <BlurFade delay={BLUR_FADE_DELAY}>
            <Card className="max-w-md w-full h-fit mx-auto my-auto">
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Reset Password</CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                        Enter your new password below
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter new password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                required
                                onChange={(e) => setCheckPassword(e.target.value)}
                                value={checkPassword}
                                autoComplete="new-password"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading || password.length === 0 || checkPassword.length === 0}
                            onClick={resetPassword}
                        >
                            {loading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </BlurFade>
    );
}
