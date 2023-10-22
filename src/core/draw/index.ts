export type Coordinate = {
	x: number
	y: number
}

export type DrawLineProperty = {
	lineColor?: string
	lineWidth?: number
	maxRenderRowCount?: number
	maxRenderColumnCount?: number
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
			renderWidth?: number
		) => {
			if (!context) return

			const offset = getPixelOffset(canvasState.canvasLineWidth) ?? 0
			context.font = `${fontSize}px Microsoft Yahei`
			context.textAlign = textAlign
			context.textBaseline = textBaseline

			const measureFillText = measureText(text)
			//换行
			const splitTextArr = []
			if (renderWidth && text !== "") {
				// renderWidth来作为最大的渲染宽度，实现换行
				let currentIndex = 0
				let currentSplitStartIndex = 0

				while (currentIndex < text.length) {
					const currentText = text.slice(currentSplitStartIndex, currentIndex + 1)

					const measureCurrentText = measureText(currentText)
					const currentMeasureWidth = measureCurrentText?.width || 0

					if (currentMeasureWidth > renderWidth) {
						const splitText = text.slice(currentSplitStartIndex, currentIndex)
						splitTextArr.push(splitText)
						currentSplitStartIndex = currentIndex
					}

					if (currentIndex === text.length - 1) {
						splitTextArr.push(text.slice(currentSplitStartIndex))
					}

					currentIndex++
				}
			} else {
				splitTextArr.push(text)
			}

			//渲染每一行
			splitTextArr.forEach((text, index) => {
				/**
				 * (measureFillText?.actualBoundingBoxAscent || 0) + (measureFillText?.actualBoundingBoxDescent || 0) 计算出文字高度
				 * 单纯用文字高度来做偏移，文字显示可能会重叠，所以增加2个像素的额外偏移
				 */
				const extraOffsetToPreLine = 2
				const textOffset = index * (extraOffsetToPreLine + (measureFillText?.actualBoundingBoxAscent || 0) + (measureFillText?.actualBoundingBoxDescent || 0))
				context.fillText(text, x + offset, y + offset + textOffset)
			})
		}

		return { fillText }
	}

	/**
	 * 绘制矩形
	 */
	const fillRect = (x: number, y: number, endX: number, endY: number, color: string = "#000000") => {
		const context = getCanvasContext()
		if (!context) return

		const oldFillStyle = context.fillStyle
		context.fillStyle = color
		context.fillRect(x, y, endX, endY)
		context.fillStyle = oldFillStyle
	}

	const clipRect = (startX: number, startY: number, width: number, height: number) => {
		const context = getCanvasContext()
		if (!context) return
		context.save()
		context.beginPath()
		context.rect(startX, startY, width, height)
		context.clip()
	}

	const restoreClip = () => {
		const context = getCanvasContext()
		context?.restore()
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
		clipRect,
		restoreClip,
		fillRect,
	}
}

export { CustomCanvas }
export type CustomCanvasType = ReturnType<typeof CustomCanvas>
