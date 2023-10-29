import { CellData } from "../cellDataHandler"
import { CanvasDrawConfig, CanvasStaticConfig, TableRowColumnCellConfig } from "../redux/canvas/canvasSlice.types"
import { CellDataInfoNumConfig } from "../redux/table-data/tableDataSlice"

/**
 * 坐标
 */
export type Coordinate = {
	x: number
	y: number
}

/**
 * 绘制线条的参数
 */
export type DrawLineProperty = {
	lineColor?: string
	lineWidth?: number
	maxRenderRowCount?: number
	maxRenderColumnCount?: number
}

/**
 *
 */
export type CanvasRenderProperty = {
	renderHeight: number //可视区域尺寸
	renderWidth: number
}

export type TableCanvas = (canvas: HTMLCanvasElement) => {
	updateCanvasSize: (width: number, height: number) => void
	drawTableFrame: (
		_cellWidth: number,
		_cellHeight: number,
		tableCellData: CellData,
		_tableCellDataInfo: CellDataInfoNumConfig,
		_staticConfig: CanvasStaticConfig,
		_tableRowColumnCellConfig: TableRowColumnCellConfig,
		_canvasRenderProperty: CanvasRenderProperty,
		_drawLineProperty?: DrawLineProperty
	) => {
		drawAll: (drawConfig: CanvasDrawConfig, offsetLeft?: number, offsetTop?: number) => void
		drawHorizontalHeader: () => void
		drawVerticalHeader: () => void
		drawBodyHorizontal: () => void
		drawBodyVertical: () => void
		drawHeaderText: () => void
		drawBodyText: () => void
	}
}
