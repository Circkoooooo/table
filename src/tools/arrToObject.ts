/**
 * ['test'] => {'test':true}
 * {'key':'value'} => {'key':'value'}
 */
export function arrToObject(arr: any[]) {
	if (arr.length === 0) return {}

	const objetArray = arr.map((item) => {
		if (typeof item === "string" || item === "number") {
			return {
				[item]: true,
			}
		}

		if (Object.prototype.toString.call(item) === "[object Object]") {
			return {
				...item,
			}
		}

		throw new Error("Need to receive a valid variable.")
	})

	const flatedObject = objetArray.reduce((pre, val) => {
		return {
			...pre,
			...val,
		}
	})

	return flatedObject
}
