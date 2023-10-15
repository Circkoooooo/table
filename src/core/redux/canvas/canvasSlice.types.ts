export type DispatchUpdateContainerSize = {
	containerWidth: number
	containerHeight: number
}

export type DispatchUpdateMaxSize = {
	maxWidth: number
	maxHeight: number
}

export type DispatchUpdateOffsetSize = {
	offsetLeft?: number
	offsetTop?: number
}

export type DispatchUpdateDrawConfigFontSize = {
	value: number
}

/**
 * 表格绘制中动态修改的配置
 */
export type CanvasDrawConfig = {
	fontSize: number
}

/**
 * 表格绘制中默认不修改内容的配置
 */
export type CanvasStaticConfig = {
	headerFontSize: number
}

export type TableRowColumnCellConfigExtraSizeConfig = Array<{
	index: number
	value: number
}>
export type TableRowColumnCellConfig = {
	rowHeight: TableRowColumnCellConfigExtraSizeConfig
	columnWidth: TableRowColumnCellConfigExtraSizeConfig
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
	tableStaticConfig: CanvasStaticConfig
	drawConfig: CanvasDrawConfig
	tableRowColumnCellConfig: TableRowColumnCellConfig
}
