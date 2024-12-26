"use client";
import { RecordsProvider } from '@/providers/RecordsProvider'
export default function MyRecordsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <RecordsProvider>{children}</RecordsProvider>;
}