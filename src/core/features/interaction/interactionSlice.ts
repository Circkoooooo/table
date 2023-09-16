import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IndexType } from "../../types/table.type"
import { DispatchMousedown, DispatchMousemove } from "./interactionSlice.types"
import { isTableHeader } from "../../tools/isIndexHeader"

export type InteractionRecord = {
	isMousedown: boolean
	isMousemove: boolean
	isEdit: boolean
	mousedownIndex: IndexType | null
	mousemoveIndex: IndexType | null
	editIndex: IndexType | null
}

const initialState: InteractionRecord = {
	isMousedown: false,
	isMousemove: false,
	isEdit: false,
	mousedownIndex: null,
	mousemoveIndex: null,
	editIndex: null,
}

const interactionSlice = createSlice({
	name: "interaction",
	initialState,
	reducers: {
		mousedownDispatch: (state, action: PayloadAction<DispatchMousedown>) => {
			const { cellIndex } = action.payload

			const { rowIndex, columnIndex } = cellIndex
			const { mousedownIndex } = state
			const tempInteractionInfo: typeof state = {
				...state,
				isMousedown: true,
				isEdit: false,
				editIndex: null,
				mousedownIndex: {
					rowIndex,
					columnIndex,
				},
				mousemoveIndex: {
					rowIndex,
					columnIndex,
				},
			}

			if (mousedownIndex && mousedownIndex.rowIndex === rowIndex && mousedownIndex.columnIndex === columnIndex) {
				if (!isTableHeader(rowIndex, columnIndex)) {
					tempInteractionInfo.isEdit = true
					tempInteractionInfo.editIndex = {
						rowIndex,
						columnIndex,
					}
				}
			} else {
				tempInteractionInfo.isEdit = false
				tempInteractionInfo.editIndex = null
			}

			return tempInteractionInfo
		},
		mousemoveDispatch: (state, action: PayloadAction<DispatchMousemove>) => {
			const { cellIndex } = action.payload
			const { isMousedown, editIndex } = state

			if (!isMousedown) return
			if (editIndex !== null) return

			const tempInteractionInfo: typeof state = {
				...state,
				mousemoveIndex: {
					rowIndex: cellIndex.rowIndex,
					columnIndex: cellIndex.columnIndex,
				},
			}

			return tempInteractionInfo
		},
		mouseupDispatch: (state) => {
			const tempInteractionInfo = {
				...state,
			}
			tempInteractionInfo.isMousedown = false
			tempInteractionInfo.isMousemove = false

			return tempInteractionInfo
		},
	},
})

export const { mousedownDispatch, mousemoveDispatch, mouseupDispatch } = interactionSlice.actions

export default interactionSlice.reducer
