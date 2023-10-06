import { useRef } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { InteractionPanelContainer } from "../styled/InteractionPanel-styled"
import { mousedownDispatch, mousemoveDispatch, mouseupDispatch } from "../redux/interaction/interactionSlice"

/**
 * 尺寸和canvas画布容器尺寸一致，用来监听鼠标事件来更新边框的属性
 * @returns
 */
const InteractionPanel = () => {
	const stateCanvas = useAppSelector((state) => state.canvas)
	const dispatch = useAppDispatch()

	const interactionRecord = useRef({
		isMosuedown: false,
		isMousemove: false,
	})

	/**
	 * 第一个单元格包含边框，所以全逻辑宽度以内都为该单元格的索引
	 * 后面所有单元格之间由于重叠了边框，所以需要以逻辑宽度减去边框宽度
	 * @param num
	 * @param logicSize
	 * @returns
	 */
	const getIndex = (num: number, lineWidth: number, logicSize: number) => {
		let ofsLeftTemp = num
		let index = 0
		while (ofsLeftTemp >= logicSize) {
			ofsLeftTemp -= index === 0 ? logicSize : logicSize - lineWidth
			index++
		}
		return index
	}

	const InteractionMousedown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		interactionRecord.current.isMosuedown = true

		const containerTargetRect = (e.target as HTMLDivElement).getBoundingClientRect()
		const containerPositon = {
			left: containerTargetRect.left,
			top: containerTargetRect.top,
		}
		const mousePositon = {
			left: e.clientX - containerPositon.left,
			top: e.clientY - containerPositon.top,
		}

		const lineWidth = 1
		const logicWidth = 102
		const logicHeight = 32

		const ofsLeft = mousePositon.left < logicWidth ? mousePositon.left : Math.round(mousePositon.left + stateCanvas.containerOffsetLeft)
		const ofsTop = mousePositon.top < logicHeight ? mousePositon.top : Math.round(mousePositon.top + stateCanvas.containerOffsetTop)

		const index = {
			xIndex: getIndex(ofsLeft, lineWidth, logicWidth),
			yIndex: getIndex(ofsTop, lineWidth, logicHeight),
		}

		dispatch(
			mousedownDispatch({
				cellIndex: {
					rowIndex: index.xIndex,
					columnIndex: index.yIndex,
				},
			})
		)
	}

	const InteractionMousemove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (!interactionRecord.current.isMosuedown) return
		interactionRecord.current.isMousemove = true

		const containerTargetRect = (e.target as HTMLDivElement).getBoundingClientRect()
		const containerPositon = {
			left: containerTargetRect.left,
			top: containerTargetRect.top,
		}
		const mousePositon = {
			left: e.clientX - containerPositon.left,
			top: e.clientY - containerPositon.top,
		}

		const lineWidth = 1
		const logicWidth = 102
		const logicHeight = 32
		const ofsLeft = Math.round(mousePositon.left + stateCanvas.containerOffsetLeft)
		const ofsTop = Math.round(mousePositon.top + stateCanvas.containerOffsetTop)

		const index = {
			xIndex: getIndex(ofsLeft, lineWidth, logicWidth),
			yIndex: getIndex(ofsTop, lineWidth, logicHeight),
		}

		dispatch(
			mousemoveDispatch({
				cellIndex: {
					rowIndex: index.xIndex,
					columnIndex: index.yIndex,
				},
			})
		)
	}

	const InteractionMouseup = () => {
		interactionRecord.current = {
			...interactionRecord.current,
			isMosuedown: false,
			isMousemove: false,
		}
		dispatch(mouseupDispatch())
	}

	return <InteractionPanelContainer onMouseDown={(e) => InteractionMousedown(e)} onMouseMove={(e) => InteractionMousemove(e)} onMouseUp={() => InteractionMouseup()} />
}

export { InteractionPanel }
