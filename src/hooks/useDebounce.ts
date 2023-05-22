import { useCallback, useRef } from "react"

export interface UseDebounceInputEvent<T> {
	event: React.FormEvent<T>
}

function useDebounce(func: Function, wait: number) {
	const timerRef = useRef<NodeJS.Timer | null>(null)

	return useCallback(
		(...args: any[]) => {
			if (timerRef.current !== null) {
				clearTimeout(timerRef.current)
			}

			timerRef.current = setTimeout(() => {
				func(...args)
				timerRef.current = null
			}, wait)
		},
		[func, wait]
	)
}

export default useDebounce
