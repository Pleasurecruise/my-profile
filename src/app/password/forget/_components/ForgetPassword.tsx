"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import BlurFade from "@/components/magicui/blur-fade";
import { toast } from "sonner";

const BLUR_FADE_DELAY = 0.04;

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const forgetPassword = async () => {
        setLoading(true);
        await authClient.forgetPassword({
            email,
            redirectTo: "/password/reset",
            fetchOptions: {
                onSuccess: () => {
                    toast.success("The email has been sent.", {
                        description: "I have sent you an email to reset your password. Please check your inbox.",
                    });
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
        <>
            <BlurFade delay={BLUR_FADE_DELAY}>
                <Card className="max-w-md w-full h-fit mx-auto my-auto">
                    <CardHeader>
                        <CardTitle className="text-lg md:text-xl">Forget Password</CardTitle>
                        <CardDescription className="text-xs md:text-sm">
                            Enter your email below to reset your password
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    value={email}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading || email.length === 0}
                                onClick={forgetPassword}
                            >
                                {loading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    "Send Reset Email"
                                )}
                            </Button>

                            <div className="text-center text-sm">
                                Remember your password? <Link href="/login" className="underline">Sign In</Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </BlurFade>
        </>
    );
}
