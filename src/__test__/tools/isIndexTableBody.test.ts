import isIndexTableBody from "../../core/Tools/Table/isIndexTableBody"
import { createEmptyCellData, createRulerCellData } from "../../core/cellDataHandler"

test("indexes should not be 0 or out of max index", () => {
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
