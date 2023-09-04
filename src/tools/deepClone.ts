const deepClone = (target: any, visited = new WeakMap()) => {
	if (target === null || target === undefined || !(typeof target === "object")) return target

	//array
	if (target instanceof Array) {
		const tempArr: any = []

		target.forEach((item) => {
			tempArr.push(deepClone(item))
		})

		return tempArr
	}

	if (visited.has(target)) {
		return visited.get(target)
	}

	//object
	const tempObject: any = {}
	const weakMap = new WeakMap()
	for (const [key, value] of Object.entries(target)) {
		weakMap.set(target, value)

		tempObject[key] = deepClone(value, weakMap)
	}
	return tempObject
}

export default deepClone
