import type React from "react";
import { useEffect, useRef } from "react";

export const useOutsideClick = (
	ref: React.RefObject<HTMLDivElement | null>,
	callback: (...args: never[]) => unknown,
) => {
	const callbackRef = useRef(callback);
	callbackRef.current = callback;

	useEffect(() => {
		const listener = (event: MouseEvent | TouchEvent) => {
			if (!ref.current || ref.current.contains(event.target as Node)) {
				return;
			}
			callbackRef.current();
		};

		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);

		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [ref]);
};
