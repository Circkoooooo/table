import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IndexType } from "../../types/table.type"
import { DispatchMousedown, DispatchMousemove, DispatchMousemoveHeader } from "./interactionSlice.types"
import { isTableHeader } from "../../tools/isIndexHeader"

export type InteractionRecord = {
	isMousedown: boolean
	isMousemove: boolean
	isEdit: boolean
	mousedownIndex: IndexType | null
	mousemoveIndex: IndexType | null
	mousemoveHeader: IndexType | null //区别于MousemoveIndex,此变量在鼠标在头部的时候都会记录,用来获取鼠标悬浮的头部单元格
	editIndex: IndexType | null
}

const initialState: InteractionRecord = {
	isMousedown: false,
	isMousemove: false,
	isEdit: false,
	mousedownIndex: null,
	mousemoveIndex: null,
	mousemoveHeader: null,
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
		mousemoveHeaderDispatch: (state, action: PayloadAction<DispatchMousemoveHeader>) => {
			const { cellIndex } = action.payload

			if (!cellIndex) return
			const { rowIndex, columnIndex } = cellIndex

			//位于头部索引的时候
			if (rowIndex === 0 || columnIndex === 0) {
				state.mousemoveHeader = cellIndex
				return
			}

			// 不位于头部的时候
			if (state.mousemoveHeader !== null) {
				state.mousemoveHeader = null
			}
		},
		mousemoveDispatch: (state, action: PayloadAction<DispatchMousemove>) => {
			const { cellIndex } = action.payload
			const { isMousedown, editIndex } = state

			if (!isMousedown) return
			if (editIndex !== null) return

			state.mousemoveIndex = cellIndex
		},
		mouseupDispatch: (state) => {
			const tempInteractionInfo = {
				...state,
			}
			tempInteractionInfo.isMousedown = false
			tempInteractionInfo.isMousemove = false

			return tempInteractionInfo
		},
		cancelEditDispatch: (state) => {
			state.isEdit = false
		},
	},
})

export const { mousedownDispatch, mousemoveDispatch, mouseupDispatch, cancelEditDispatch, mousemoveHeaderDispatch } = interactionSlice.actions

export default interactionSlice.reducer
