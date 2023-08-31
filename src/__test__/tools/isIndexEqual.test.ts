import isIndexEqual from "../../core/Tools/Table/isIndexEqual"
import { IndexType } from "../../core/types/table"

test("row index and column index equal", () => {
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
