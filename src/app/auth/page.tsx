"use client";

import React, { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthForm from "@/components/AuthForm";

const AuthPageContent: React.FC = () => {
	const router = useRouter();

	const [errors, setErrors] = useState<object>();

	const searchParams = useSearchParams();

	const mode = searchParams.get("mode") || "login";

    const scrambleString = (input: string) => {
		const characters = input.split(""); // get each individual character
		const scrambled = characters.sort(() => Math.random() - 0.5);
		return scrambled.join("");
	};

	const submitHandler = async (values: {
		username: string;
		password: string;
	}) => {
		if (mode === "login") {
			// result will resolve to an object with { error: , status: , ok: , url:  } for CredentialsProvider
			// if an error or null was thrown in authorize(), it (or CredentialsSignIn for null) will be "placed" as a string in 'error'
			const result = await signIn("login", {
				...values,
				redirect: false, // to handle any errors (invalid credentials) on the same page
			});

			// signIn() does return some response (should alw be the case I think?)
			if(result?.error) {
				setErrors({ credentials: "Invalid username or password." });
			} else {
				router.push('/');
			}
		} else {    // signup
            const alias = scrambleString(values.username); // get a randomized alias based on username

            const response = await fetch(`/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...values,
                    alias,
                }),
            });
            const resData = await response.json();

			console.log(resData);
            if(resData.errors) {
				setErrors(resData.errors);
			} else {
				console.log(resData.message);
				router.push('/auth/?mode=login');
			}
		}
	};

	return <AuthForm authErrors={errors} mode={mode} onSubmit={submitHandler} />;
};

const AuthPage: React.FC = () => {
	return (
		<Suspense>
			<AuthPageContent />
		</Suspense>
	);
};

export default AuthPage;
