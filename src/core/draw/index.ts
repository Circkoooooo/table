export type Coordinate = {
	x: number
	y: number
}

export type DrawLineProperty = {
	lineColor?: string
	lineWidth?: number
}
/**
 *
 * @param canvasId id of canvas target
 * @param initialWidth canvas width the first render
 * @param initialHeight canvas height the first render
 * @returns
 */
const CustomCanvas = (_canvasTarget: HTMLCanvasElement) => {
	const canvasState = {
		canvasTarget: _canvasTarget,
		_canvasContext: _canvasTarget.getContext("2d"),
		canvasLineWidth: 1,
		canvasStrokeColor: "#000000",
		devicePixelRatio: 1,
		pixelOffset: 0.5,
		fontSize: 16,
	}

	const getCanvasContext = () => {
		return canvasState._canvasContext
	}

	const updateStrokeColor = (lineColor?: DrawLineProperty["lineColor"]) => {
		if (!lineColor || lineColor === canvasState.canvasStrokeColor) return
		const ctx = getCanvasContext()
		ctx && (ctx.strokeStyle = lineColor)

		canvasState.canvasStrokeColor = lineColor
	}

	const updateCanvasLineWidth = (lineWidth?: DrawLineProperty["lineWidth"]) => {
		if (!lineWidth) return
		const ctx = getCanvasContext()

		canvasState.canvasLineWidth = lineWidth
		ctx && (ctx.lineWidth = canvasState.canvasLineWidth)

		return canvasState.canvasLineWidth
	}

	const recordDpr = () => {
		canvasState.devicePixelRatio = window.devicePixelRatio
		return canvasState.devicePixelRatio
	}

	const getDpr = () => {
		return canvasState.devicePixelRatio
	}

	const getPixelOffset = (lineWidth: number) => {
		const ctx = getCanvasContext()
		if (!ctx) return null
		return lineWidth % 2 === 0 ? 0 : 0.5
	}

	const measureText = (text: string) => {
		const ctx = getCanvasContext()
		if (!ctx) return null
		return ctx.measureText(text)
	}

	const getTextHeight = (fontSize: number = canvasState.fontSize) => {
		const ctx = getCanvasContext()
		if (!ctx) return null

		let size = fontSize
		if (ctx.textBaseline === "hanging" || ctx.textBaseline === "top") {
			size = fontSize
		} else if (ctx.textBaseline === "middle") {
			size = fontSize / 2
		}

		return size
	}

	/**
	 * 调用来实现线条的绘制。
	 *
	 * @returns
	 * beginPath: 线条绘制前调用
	 *
	 * markLine: 在指定位置标记线条来为渲染做准备
	 *
	 * strokeLine：渲染标记好的线条
	 */
	const drawLine = () => {
		const context = getCanvasContext()

		const beginPath = () => {
			if (!context) return
			context.beginPath()
		}

		const markLine = (start: Coordinate, end: Coordinate) => {
			if (!context) return

			const offset = getPixelOffset(canvasState.canvasLineWidth) ?? 0

			context.moveTo(start.x + offset, start.y + offset)
			context.lineTo(end.x + offset, end.y + offset)
		}

		const strokeLine = () => {
			if (!context) return
			context.stroke()
		}

		const closePath = () => {
			if (!context) return
			context.closePath()
		}

		return {
			beginPath,
			markLine,
			strokeLine,
			closePath,
		}
	}

	/**
	 * 调用来绘制一个文本
	 * 默认对齐为横向：start 纵向top
	 * 默认字体为16
	 * @returns
	 */
	const drawText = () => {
		const context = getCanvasContext()

		const fillText = (
			text: string,
			x: number,
			y: number,
			fontSize: number = canvasState.fontSize,
			textAlign: CanvasTextAlign = "start",
			textBaseline: CanvasTextBaseline = "top",
			maxWidth?: number
		) => {
			if (!context) return

			context.font = `${fontSize}px Microsoft Yahei`
			context.textAlign = textAlign
			context.textBaseline = textBaseline

			context.fillText(text, x, y, maxWidth)
		}

		return { fillText }
	}

	/**
	 * 接受宽度和高度，刷新当前绑定canvas的宽度和高度，【适配dpr缩放】
	 * @param initialWidth
	 * @param initialHeight
	 * @returns
	 */
	const updateSize = (initialWidth: number, initialHeight: number) => {
		const canvas = canvasState.canvasTarget
		canvas.width = initialWidth
		canvas.height = initialHeight

		const ctx = getCanvasContext()
		if (!canvas || !ctx) return

		const dpr = recordDpr()

		canvas.style.width = `${initialWidth / dpr}px`
		canvas.style.height = `${initialHeight / dpr}px`
	}

	return {
		drawLine,
		drawText,
		updateSize,
		getDpr,
		getPixelOffset,
		measureText,
		getTextHeight,
		updateStrokeColor,
		updateCanvasLineWidth,
	}
}

export { CustomCanvas }
export type CustomCanvasType = ReturnType<typeof CustomCanvas>
