import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { DispatchUpdateContainerSize, DispatchUpdateOverflowSize } from "./canvasSlice.types"

type CanvasRecord = {
	containerWidth: number
	containerHeight: number
	containerMaxWidth: number
	containerMaxHeight: number
}

const initialState: CanvasRecord = {
	containerWidth: 0,
	containerHeight: 0,
	containerMaxWidth: 4000,
	containerMaxHeight: 4000,
}

const canvasSlice = createSlice({
	name: "canvas",
	initialState,
	reducers: {
		updateContainerSizeDispatch: (state, action: PayloadAction<DispatchUpdateContainerSize>) => {
			const { containerWidth, containerHeight } = action.payload
			state.containerWidth = containerWidth
			state.containerHeight = containerHeight
		},
		updateMaxSizeDispatch: (state, action: PayloadAction<DispatchUpdateOverflowSize>) => {
			const { overflowWidth, overflowHeight } = action.payload
			state.containerMaxWidth = overflowWidth
			state.containerMaxHeight = overflowHeight
		},
	},
})

export const { updateContainerSizeDispatch } = canvasSlice.actions

export default canvasSlice.reducer
