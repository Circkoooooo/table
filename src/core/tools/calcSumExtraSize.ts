import { TableRowColumnCellConfig } from "../redux/canvas/canvasSlice.types"
import { CalcSumExtraSize } from "./types"

/**
 *根据rowColumnExtraSize的config数组，来分别输出row和column的额外渲染尺寸
 */
export const calcSumExtraSize: CalcSumExtraSize = (extraSizeConfig: TableRowColumnCellConfig, dpr: number) => {
	const { rowHeight, columnWidth } = extraSizeConfig

	/**
	 * 所有偏移量之和，即作为额外渲染尺寸
	 */
	const sumLeftExtra = Math.round(columnWidth.map((item) => item.value).reduce((pre, cur) => pre + cur, 0) * dpr)
	const sumTopExtra = Math.round(rowHeight.map((item) => item.value).reduce((pre, cur) => pre + cur, 0) * dpr)
	return {
		sumLeftExtra,
		sumTopExtra,
	}
}
