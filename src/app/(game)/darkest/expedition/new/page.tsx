"use client"

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ExpeditionLogForm from "@/components/Darkest/ExpeditionLogForm";
import { Suspense } from "react";

const NewExpeditionPageInner = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const saveId = searchParams.get("saveId");

    if (!saveId) {
        return (
            <div className="flex flex-col p-2 gap-4">
                <Link href="/darkest/expedition" className="text-cool-gray-20 hover:text-white text-sm">← Back</Link>
                <p className="text-red-400">No save selected. Please go back and select a save.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col p-2 gap-4">
            <Link href="/darkest/expedition" className="text-cool-gray-20 hover:text-white text-sm">← Back</Link>
            <h1 className="font-bold text-xl">New Expedition Entry</h1>
            <ExpeditionLogForm
                gameSaveId={saveId}
                onSuccess={() => router.push("/darkest/expedition")}
            />
        </div>
    );
};

const NewExpeditionPage = () => (
    <Suspense fallback={<p className="text-cool-gray-20 p-2">Loading…</p>}>
        <NewExpeditionPageInner />
    </Suspense>
);

export default NewExpeditionPage;
