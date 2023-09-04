const deepClone = (target: any) => {
	if (target === null || target === undefined || !(typeof target === "object")) return target

	//array
	if (target instanceof Array) {
		const tempArr: any = []

		target.forEach((item) => {
			tempArr.push(deepClone(item))
		})

		return tempArr
	}

	//object
	const tempObject: any = {}
	const propertySet = new Set()
	for (const [key, value] of Object.entries(target)) {
		propertySet.add(value)

		if (propertySet.has(value)) {
			tempObject[key] = value
		}
		tempObject[key] = deepClone(value)
	}
	return tempObject
}

export default deepClone
