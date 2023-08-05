import { createEmptyCellData } from "../cellDataHandler"

test("m * n matrix", () => {
	const result = createEmptyCellData({
		rowNum: 2,
		columnNum: 3,
	})

	expect(result).toEqual([
		[null, null, null],
		[null, null, null],
	])

	expect(result).toMatchSnapshot()
})

export {}
