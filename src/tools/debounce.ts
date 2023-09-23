export function debounce(func: Function, ms: number) {
	let timer: NodeJS.Timer | null = null

	return (...args: any[]) => {
		if (timer) {
			clearTimeout(timer)
			timer = null
		}

		timer = setTimeout(() => {
			func(args)
		}, ms)
	}
}
