import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { CanvasRecord, DispatchUpdateContainerSize, DispatchUpdateDrawConfigFontSize, DispatchUpdateMaxSize, DispatchUpdateOffsetSize } from "./canvasSlice.types"

const initialState: CanvasRecord = {
	containerWidth: 0,
	containerHeight: 0,
	containerOffsetLeft: 0,
	containerOffsetTop: 0,
	containerMaxWidth: 0,
	containerMaxHeight: 0,
	containerMaxOffsetLeft: 0,
	containerMaxOffsetTop: 0,
	tableStaticConfig: {
		//不可修改的配置
		headerFontSize: 16, //头部文字的字体大小
	},
	drawConfig: {
		fontSize: 16,
	},
	tableRowColumnCellConfig: {
		rowHeight: [
			{
				index: 0,
				value: 10,
			},
			{
				index: 4,
				value: 60,
			},
		],
		columnWidth: [
			{
				index: 0,
				value: 10,
			},
			{
				index: 4,
				value: 60,
			},
		],
	},
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
		// 更新字体配置
		updateDrawConfigFontSize: (state, action: PayloadAction<DispatchUpdateDrawConfigFontSize>) => {
			const { value } = action.payload

			state.drawConfig.fontSize = value
		},
	},
})

export const { updateContainerSizeDispatch, updateContainerMaxSizeDispatch, updateContainerOffsetDispatch, updateDrawConfigFontSize } = canvasSlice.actions

export default canvasSlice.reducer
