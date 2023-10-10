import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { CellData, createEmptyCellData } from "../../cellDataHandler"
import { DispatchInput } from "./tableDataSlice.types"

type CellDataState = {
	cellData: CellData
}

const initialState: CellDataState = {
	cellData: createEmptyCellData({
		rowNum: 27,
		columnNum: 27,
	}),
}

export const tableDataSlice = createSlice({
	name: "table-data",
	initialState,
	reducers: {
		inputDispatch: (state, action: PayloadAction<DispatchInput>) => {
			const { cellIndex, newValue } = action.payload

			// +1 是为了让起始索引从body开始
			state.cellData[cellIndex.rowIndex + 1][cellIndex.columnIndex + 1] = newValue
		},
	},
})

export const { inputDispatch } = tableDataSlice.actions
export default tableDataSlice.reducer
