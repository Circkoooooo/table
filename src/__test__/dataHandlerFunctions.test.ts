import isIndexEqual from "../core/tools/Table/isIndexEqual"
import isIndexTableBody from "../core/tools/Table/isIndexTableBody"
import { createEmptyCellData, createRulerCellData } from "../core/cellDataHandler"
import { IndexType } from "../core/types/table.type"

describe("functions of table data", () => {
	it("Provide a emptyCellData. Data should includes ruler data and length of info object should equals the length of data.", () => {
		const cellData = createRulerCellData(
			createEmptyCellData({
				rowNum: 1,
				columnNum: 1,
			})
		)

		expect(cellData).toMatchObject({
			data: [
				[null, "A"],
				["1", null],
			],
			info: { columnLength: 2, rowLength: 2 },
		})
	})

	it("Provide a empty array. Data should be empty and length of info object should equals 0", () => {
		const cellData = createRulerCellData([])

		expect(cellData).toMatchObject({
			data: [],
			info: { columnLength: 0, rowLength: 0 },
		})
	})
})

describe("Data handler function tools", () => {
	it("indexes should not be 0 or out of max index", () => {
		const cellData = createRulerCellData(
			createEmptyCellData({
				rowNum: 10,
				columnNum: 10,
			})
		)
		const falseResult = isIndexTableBody(cellData.data, 0, 0)
		const falseResult2 = isIndexTableBody(cellData.data, 11, 11)
		const trueResult = isIndexTableBody(cellData.data, 1, 1)
		expect(falseResult).toBeFalsy()
		expect(falseResult2).toBeFalsy()
		expect(trueResult).toBeTruthy()
	})

	it("row index and column index equal", () => {
		const indexOrigin: IndexType = {
			rowIndex: 0,
			columnIndex: 0,
		}

		const indexTarget: IndexType = {
			rowIndex: 0,
			columnIndex: 0,
		}

		const indexTarget2: IndexType = {
			rowIndex: 0,
			columnIndex: 1,
		}
		const equal = isIndexEqual(indexOrigin, indexTarget)
		const notEqual = isIndexEqual(indexOrigin, indexTarget2)

		expect(equal).toBeTruthy()
		expect(notEqual).toBeFalsy()
	})
})
