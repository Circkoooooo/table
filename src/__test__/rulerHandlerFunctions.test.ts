import { getColumnLabel, getRowLabel, resolvePrefixArray } from "../core/ruler"

describe("ruler", () => {
	const resultA2Z = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

	it("prefix generator", () => {
		expect(getColumnLabel(26)).toMatchObject(resultA2Z)
		expect(getColumnLabel(26, 65, 90)).toMatchObject(resultA2Z)
		expect(getColumnLabel(27, 65, 90)).toMatchObject([...resultA2Z, "AA"])
		expect(getColumnLabel(26, "A", "Z")).toMatchObject(resultA2Z)
	})

	it("typeof asciiMin is valid type", () => {
		function validType() {
			getColumnLabel(26, null as unknown as any, "Z")
		}
		expect(validType).toThrow(new Error("Type of null is not a valid type"))
	})

	it("typeof asciiMax is valid type", () => {
		function validType() {
			getColumnLabel(26, 90, null as unknown as any)
		}
		expect(validType).toThrow(new Error("Type of null is not a valid type"))
	})

	it("snapshot", () => {
		expect(getColumnLabel(26)).toMatchSnapshot()
	})
})

describe("prefix array", () => {
	it("Empty prefix Array. Returns a array includes a min code.", () => {
		const targetPrefixArray = resolvePrefixArray([], 65, 90)
		expect(targetPrefixArray).toMatchObject([65])
	})

	it("Prefix array [mincode]. Returns [mincode + 1]", () => {
		const targetPrefixArray = resolvePrefixArray([65], 65, 90)
		expect(targetPrefixArray).toMatchObject([66])
	})

	it("Prefix array [maxcode]. Returns [mincode, mincode]", () => {
		const targetPrefixArray = resolvePrefixArray([90], 65, 90)
		expect(targetPrefixArray).toMatchObject([65, 65])
	})

	it("Prefix array [code, code(!maxcode)]. Returns [code, code + 1]", () => {
		const targetPrefixArray = resolvePrefixArray([90, 66], 65, 90)
		expect(targetPrefixArray).toMatchObject([90, 67])
	})

	it("Prefix array [code, maxcode]. the first and the last need carry", () => {
		const targetPrefixArray = resolvePrefixArray([90, 90], 65, 90)
		expect(targetPrefixArray).toMatchObject([65, 65, 65])
	})

	it("Prefix array [code, maxcode-1]. the first not carry", () => {
		const targetPrefixArray = resolvePrefixArray([65, 90], 65, 90)
		expect(targetPrefixArray).toMatchObject([66, 65])
	})
})

describe("getRowLabel", () => {
	const expectedRowLabel = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26"]
	const expectedRowLabelOffset2 = ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"]

	it("row label", () => {
		const rowLable = getRowLabel(26)
		expect(rowLable).toMatchObject(expectedRowLabel)

		expect(rowLable).toMatchSnapshot()
	})

	it("not default offset", () => {
		const rowLable = getRowLabel(26, 2)
		expect(rowLable).toMatchObject(expectedRowLabelOffset2)

		expect(rowLable).toMatchSnapshot()
	})
})
