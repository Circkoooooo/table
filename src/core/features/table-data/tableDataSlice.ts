import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { WithRulerCellData, createEmptyCellData, createRulerCellData } from "../../cellDataHandler"
import { DispatchInput } from "./tableDataSlice.types"

type CellDataState = {
	cellData: WithRulerCellData
}

const initialState: CellDataState = {
	cellData: createRulerCellData(
		createEmptyCellData({
			rowNum: 100,
			columnNum: 100,
		})
	),
}

export const tableDataSlice = createSlice({
	name: "table-data",
	initialState,
	reducers: {
		inputDispatch: (state, action: PayloadAction<DispatchInput>) => {
			const { cellIndex, newValue } = action.payload
			const { rowIndex, columnIndex } = cellIndex

			const newCellData = state.cellData.data.map((row, rowIdx) => {
				if (rowIdx === rowIndex) {
					return row.map((column, columnIdx) => {
						if (columnIdx === columnIndex) {
							return newValue
						}
						return column
					})
				}
				return row
			})

			state.cellData.data = newCellData
			return state
		},
	},
})

export const { inputDispatch } = tableDataSlice.actions
export default tableDataSlice.reducer
