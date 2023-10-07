import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { CellData, createEmptyCellData } from "../../cellDataHandler"
import { DispatchInput } from "./tableDataSlice.types"

type CellDataState = {
	cellData: CellData
}

const initialState: CellDataState = {
	cellData: createEmptyCellData({
		rowNum: 26,
		columnNum: 26,
	}),
}

export const tableDataSlice = createSlice({
	name: "table-data",
	initialState,
	reducers: {
		inputDispatch: (state, action: PayloadAction<DispatchInput>) => {
			const {
				cellIndex: { rowIndex, columnIndex },
				newValue,
			} = action.payload

			state.cellData[rowIndex][columnIndex] = newValue
		},
	},
})

export const { inputDispatch } = tableDataSlice.actions
export default tableDataSlice.reducer
