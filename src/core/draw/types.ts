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

export type CustomCanvas = (_canvasTarget: HTMLCanvasElement) => {
	/**绘制线条 */
	drawLine: () => {
		beginPath: () => void
		markLine: (start: Coordinate, end: Coordinate) => void
		strokeLine: () => void
		closePath: () => void
	}
	/**绘制文字 */
	drawText: () => {
		fillText: (text: string, x: number, y: number, fontSize: number, textAlign: CanvasTextAlign, textBaseline: CanvasTextBaseline, renderWidth?: number) => void
	}
	/**更新Canvas元素的尺寸。（内部会调用recordDpr来更新dpr） */
	updateSize: (initialWidth: number, initialHeight: number) => void
	/**获取当前dpr */
	getDpr: () => number
	_recordDpr: () => void
	/**获取当前线条所需的默认偏移，来解决线条绘制变粗。最大只偏移0.5px */
	_getPixelOffset: (lineWidth: number) => void
	/**获取文字的信息，调用context的measureText的方法。 */
	measureText: (text: string) => void
	/**获取文字的文字大小下的理论高度。 */
	getTextHeight: (fontSize: number) => void
	/**更新线条的颜色 */
	updateCanvasStrokeColor: (lineColor?: DrawLineProperty["lineColor"]) => void
	/**更新线条绘制的尺寸 */
	updateCanvasLineWidth: (lineWidth?: DrawLineProperty["lineWidth"]) => void
	/**裁切一个区域，用来限制绘制区域 */
	clipRect: (startX: number, startY: number, width: number, height: number) => void
	/**还原裁切的区域*/
	restoreClip: () => void
	/**用颜色填充一个矩形 */
	fillRect: (x: number, y: number, endX: number, endY: number, color: string) => void
}
