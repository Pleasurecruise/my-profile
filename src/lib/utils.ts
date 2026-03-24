import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const dateInputSchema = z.string().trim().min(1);
const isoDateSchema = z.iso.date();
const normalizedDateSchema = z.coerce.date();

export function formatDate(date: string) {
	const parsedInput = dateInputSchema.safeParse(date);
	if (!parsedInput.success) {
		return "Invalid date";
	}

	const normalizedInput = isoDateSchema.safeParse(parsedInput.data).success
		? `${parsedInput.data}T00:00:00`
		: parsedInput.data;
	const parsedDate = normalizedDateSchema.safeParse(normalizedInput);
	if (!parsedDate.success || Number.isNaN(parsedDate.data.getTime())) {
		return "Invalid date";
	}

	const currentDate = Date.now();
	const targetDate = parsedDate.data.getTime();
	const timeDifference = Math.abs(currentDate - targetDate);
	const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

	const fullDate = parsedDate.data.toLocaleString("en-us", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	if (daysAgo < 1) return "Today";
	if (daysAgo < 7) return `${fullDate} (${daysAgo}d ago)`;
	if (daysAgo < 30) return `${fullDate} (${Math.floor(daysAgo / 7)}w ago)`;
	if (daysAgo < 365) return `${fullDate} (${Math.floor(daysAgo / 30)}mo ago)`;
	return `${fullDate} (${Math.floor(daysAgo / 365)}y ago)`;
}

export function formatTime(date?: Date): string {
	if (!date) return "";
	return date.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
}
