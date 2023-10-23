import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IndexType } from "../../../types/table.types"
import { DispatchLineFlexibleCurrentIndex, DispatchLineFlexibleCurrentOffset } from "./lineFlexibleSlice.types"

interface InitialState {
	lineFlexibleCurrentIndex: IndexType | null
	lineFlexibleCurrentOffset: {
		offsetLeft: number
		offsetTop: number
	}
	lineFlexibleCurrentScreenPosition: {
		screenX: number
		screenY: number
	}
}

const initialState: InitialState = {
	lineFlexibleCurrentOffset: {
		offsetLeft: 0,
		offsetTop: 0,
	}, //起始处于点击拖动条时记录的单元格索引
	lineFlexibleCurrentScreenPosition: {
		screenX: 0,
		screenY: 0,
	}, //起始处于点击拖动条时记录的单元格索引
	lineFlexibleCurrentIndex: null, //处于点击拖动条时记录的单元格索引
}

const lineFlexibleSlice = createSlice({
	name: "lineflexible",
	initialState,
	reducers: {
		lineFlexibleCurrentIndexDispatch: (state, action: PayloadAction<DispatchLineFlexibleCurrentIndex>) => {
			const { index } = action.payload
			state.lineFlexibleCurrentIndex = index
		},
		lineFlexibleCurrentOffsetDispatch: (state, action: PayloadAction<DispatchLineFlexibleCurrentOffset>) => {
			const { offset, mouseScreenPosition } = action.payload
			state.lineFlexibleCurrentOffset = offset
			state.lineFlexibleCurrentScreenPosition = mouseScreenPosition
		},
	},
})

export const { lineFlexibleCurrentIndexDispatch, lineFlexibleCurrentOffsetDispatch } = lineFlexibleSlice.actions
export default lineFlexibleSlice.reducer
