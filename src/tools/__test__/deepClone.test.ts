import deepClone from "../deepClone"

describe("deep clone", () => {
	test("Not object datatype", () => {
		expect(deepClone(null)).toBeNull()
		expect(deepClone(undefined)).toBeUndefined()
		expect(deepClone(false)).toBeFalsy()
		expect(deepClone(1)).toBe(1)
		expect(deepClone("test")).toBe("test")
	})

	test("Object datatype", () => {
		const a = {
			test: "Test",
			testObj: {
				testObj: {
					b: "12321",
				},
			},
		}
		const c = a
		const b = deepClone(a)
		expect(a).toBe(c)
		expect(a).toMatchObject(b)
	})
})
