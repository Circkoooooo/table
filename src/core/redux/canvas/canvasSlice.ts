import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { DispatchUpdateContainerSize, DispatchUpdateDrawConfigFontSize, DispatchUpdateMaxSize, DispatchUpdateOffsetSize } from "./canvasSlice.types"

/**
 * 表格绘制中动态修改的配置
 */
export type DrawConfig = {
	fontSize: number
}

/**
 * 表格绘制中默认不修改内容的配置
 */
export type StaticConfig = {
	headerFontSize: number
}

export type CanvasRecord = {
	containerWidth: number
	containerHeight: number
	containerMaxWidth: number
	containerMaxHeight: number
	containerOffsetLeft: number
	containerOffsetTop: number
	containerMaxOffsetLeft: number
	containerMaxOffsetTop: number
	tableStaticConfig: StaticConfig
	drawConfig: DrawConfig
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
	tableStaticConfig: {
		//不可修改的配置
		headerFontSize: 16, //头部文字的字体大小
	},
	drawConfig: {
		fontSize: 16,
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
