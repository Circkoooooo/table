import { TableRowColumnCellConfigExtraSizeConfig } from "../redux/canvas/canvasSlice.types"
import { CalcIndexExtraRenderSize } from "./types"

/**
 * 根据每行和列的额外渲染尺寸，以及当前单元格的索引，
 * 获取当前索引前方所有行或者列的额外渲染尺寸总和
 */
export const calcIndexExtraRenderSize: CalcIndexExtraRenderSize = (
	rowHeightArrs: TableRowColumnCellConfigExtraSizeConfig,
	columnWidthArrs: TableRowColumnCellConfigExtraSizeConfig,
	startRowIndex: number,
	startColumnIndex: number
) => {
	//额外的上方偏移。选中单元格上方非默认高度的额外高度之和。
	let extraOffsetTop = rowHeightArrs
		.filter(({ index }) => index < startRowIndex)
		.map((item) => item.value)
		.reduce((pre, cur) => pre + cur, 0)

	let extraOffsetLeft = columnWidthArrs
		.filter(({ index }) => index < startColumnIndex)
		.map((item) => item.value)
		.reduce((pre, cur) => pre + cur, 0)

	return {
		extraOffsetLeft,
		extraOffsetTop,
	}
}
