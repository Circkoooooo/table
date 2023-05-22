import { arrToObject } from "../arrToObject"

describe("arrToObject", () => {
	test("empty arr to empty object", () => {
		const received: string[] = []
		const expected = {}
		expect(arrToObject(received)).toEqual(expected)
	})

	test("empty object in arr to empty object", () => {
		const received = [{}]
		const expected = {}
		expect(arrToObject(received)).toEqual(expected)
	})

	test("string arr to object { key:true }", () => {
		const received = ["test", "test2"]
		const expected = {
			test: true,
			test2: true,
		}
		expect(arrToObject(received)).toEqual(expected)
	})

	test("single object array to object", () => {
		const received = [
			{
				test: "test-value",
			},
		]
		const expected = {
			test: "test-value",
		}
		expect(arrToObject(received)).toEqual(expected)
	})

	test("Array that has object and string to object", () => {
		const received = [
			{
				test: "test-value",
			},
			"test2",
			"test3",
		]
		const expected = {
			test: "test-value",
			test2: true,
			test3: true,
		}
		expect(arrToObject(received)).toEqual(expected)
	})

	test("received is not a valid type, should throw a error", () => {
		const received = [() => {}]
		expect(() => arrToObject(received)).toThrow("Need to receive a valid variable.")
	})
})

export {}
