import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { DispatchUpdateContainerSize, DispatchUpdateMaxSize, DispatchUpdateOffsetSize } from "./canvasSlice.types"

export type CanvasRecord = {
	containerWidth: number
	containerHeight: number
	containerMaxWidth: number
	containerMaxHeight: number
	containerOffsetLeft: number
	containerOffsetTop: number
	containerMaxOffsetLeft: number
	containerMaxOffsetTop: number
}

const initialState: CanvasRecord = {
	containerWidth: 0,
	containerHeight: 0,
	containerOffsetLeft: 0,
	containerOffsetTop: 0,
	containerMaxWidth: 0,
	containerMaxHeight: 0,
	containerMaxOffsetLeft: 0,
	containerMaxOffsetTop: 0,
}

const calcMaxOffset = (width: number, height: number, maxWidth: number, maxHeight: number) => {
	return {
		containerMaxOffsetLeft: maxWidth - width,
		containerMaxOffsetTop: maxHeight - height,
	}
}

const canvasSlice = createSlice({
	name: "canvas",
	initialState,
	reducers: {
		updateContainerSizeDispatch: (state, action: PayloadAction<DispatchUpdateContainerSize>) => {
			const { containerWidth, containerHeight } = action.payload
			state.containerWidth = containerWidth
			state.containerHeight = containerHeight

			const { containerMaxOffsetLeft, containerMaxOffsetTop } = calcMaxOffset(state.containerWidth, state.containerHeight, state.containerMaxWidth, state.containerMaxHeight)
			state.containerMaxOffsetLeft = containerMaxOffsetLeft
			state.containerMaxOffsetTop = containerMaxOffsetTop
		},
		updateContainerMaxSizeDispatch: (state, action: PayloadAction<DispatchUpdateMaxSize>) => {
			const { maxWidth, maxHeight } = action.payload
			state.containerMaxWidth = maxWidth
			state.containerMaxHeight = maxHeight

			const { containerMaxOffsetLeft, containerMaxOffsetTop } = calcMaxOffset(state.containerWidth, state.containerHeight, state.containerMaxWidth, state.containerMaxHeight)
			state.containerMaxOffsetLeft = containerMaxOffsetLeft
			state.containerMaxOffsetTop = containerMaxOffsetTop
		},
		updateContainerOffsetDispatch: (state, action: PayloadAction<DispatchUpdateOffsetSize>) => {
			const { offsetLeft, offsetTop } = action.payload

			offsetLeft !== undefined && (state.containerOffsetLeft = offsetLeft)
			offsetTop !== undefined && (state.containerOffsetTop = offsetTop)
		},
	},
})

export const { updateContainerSizeDispatch, updateContainerMaxSizeDispatch, updateContainerOffsetDispatch } = canvasSlice.actions

export default canvasSlice.reducer
