import { arrToObject } from "../arrToObject"

describe("arrToObject", () => {
	test("arrToObject", () => {
		expect(
			arrToObject([
				"test",
				{
					param: "test",
				},
			])
		).toMatchObject({
			test: true,
			param: "test",
		})
	})

	test("Unexpected type of params", () => {
		expect(() => arrToObject([false])).toThrow(new Error("Need to receive a valid variable."))
	})

	test("empty arr", () => {
		expect(arrToObject([])).toMatchObject({})
	})
})
