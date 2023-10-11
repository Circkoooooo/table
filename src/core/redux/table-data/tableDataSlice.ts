import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { CellData, createEmptyCellData } from "../../cellDataHandler"
import { DispatchCellData, DispatchInput } from "./tableDataSlice.types"

type CellDataState = {
	cellData: CellData
	cellDataInfo: {
		rowNum: number
		columnNum: number
	}
}

const initialState: CellDataState = {
	cellData: createEmptyCellData({
		rowNum: 27,
		columnNum: 27,
	}),
	cellDataInfo: {
		rowNum: 26,
		columnNum: 26,
	},
}

export const tableDataSlice = createSlice({
	name: "table-data",
	initialState,
	reducers: {
		/**
		 * num数量从非头部索引区第一个索引开始计算。
		 * @param state
		 * @param action
		 */
		updateCellDataInfo: (state, action: PayloadAction<DispatchCellData>) => {
			const { cellDataColumn, cellDataRow } = action.payload

			state.cellDataInfo = {
				rowNum: cellDataRow,
				columnNum: cellDataColumn,
			}

			const newEmptyCellData = createEmptyCellData({
				rowNum: cellDataRow + 1,
				columnNum: cellDataColumn + 1,
			})

			// copy
			for (let row = 0; row < cellDataRow; row++) {
				for (let column = 0; column < cellDataColumn; column++) {
					if (state.cellData[row] && state.cellData[row][column]) {
						newEmptyCellData[row][column] = state.cellData[row][column]
					}
				}
			}

			state.cellData = newEmptyCellData
		},
		inputDispatch: (state, action: PayloadAction<DispatchInput>) => {
			const { cellIndex, newValue } = action.payload

			// +1 是为了让起始索引从body开始
			state.cellData[cellIndex.rowIndex + 1][cellIndex.columnIndex + 1] = newValue
		},
	},
})

export const { inputDispatch, updateCellDataInfo } = tableDataSlice.actions
export default tableDataSlice.reducer
