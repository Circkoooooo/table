import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IndexType } from "../../../types/table.types"
import { DispatchLineFlexibleActiveOffect, DispatchLineFlexibleCurrentIndex, DispatchLineFlexibleCurrentOffset } from "./lineFlexibleSlice.types"

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
	activeOffect: {
		offsetLeft: number
		offsetTop: number
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
	activeOffect: {
		//激活状态下，记录伸缩条滑动的偏移量
		offsetLeft: 0,
		offsetTop: 0,
	},
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
		lineFlexibleActiveOffset: (state, action: PayloadAction<DispatchLineFlexibleActiveOffect>) => {
			const { offset } = action.payload
			offset.offsetLeft !== undefined && (state.activeOffect.offsetLeft = offset.offsetLeft)
			offset.offsetTop !== undefined && (state.activeOffect.offsetTop = offset.offsetTop)
		},
	},
})

export const { lineFlexibleCurrentIndexDispatch, lineFlexibleCurrentOffsetDispatch, lineFlexibleActiveOffset } = lineFlexibleSlice.actions
export default lineFlexibleSlice.reducer
