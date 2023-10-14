import { useRef } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { InteractionPanelContainer } from "../styled/InteractionPanel-styled"
import { mousedownDispatch, mousemoveDispatch, mouseupDispatch } from "../redux/interaction/interactionSlice"
import isIndexEqual from "../tools/isIndexEqual"

/**
 * 尺寸和canvas画布容器尺寸一致，用来监听鼠标事件来更新边框的属性
 * @returns
 */
const InteractionPanel = () => {
	const canvasStore = useAppSelector((state) => state.canvas)
	const interactionStore = useAppSelector((state) => state.interaction)
	const tableDataStore = useAppSelector((state) => state.tableData)
	const dispatch = useAppDispatch()

	const interactionRecord = useRef({
		isMosuedown: false,
		isMousemove: false,
		isEdit: false,
	})

	/**
	 * 第一个单元格包含边框，所以全逻辑宽度以内都为该单元格的索引
	 * 后面所有单元格之间由于重叠了边框，所以需要以逻辑宽度减去边框宽度
	 * @param num
	 * @param logicSize
	 * @returns
	 */
	const getIndex = (num: number, lineWidth: number, logicSize: number, direction: "row" | "column") => {
		let ofsStartTemp = num
		let index = 0

		const lengthConfigArr = direction === "row" ? canvasStore.tableRowColumnCellConfig.rowHeight : canvasStore.tableRowColumnCellConfig.columnWidth
		while (ofsStartTemp >= logicSize) {
			const currentIndex = index
			ofsStartTemp -= logicSize - lineWidth + (lengthConfigArr.find((item) => item.index === currentIndex)?.value || 0)
			index++
		}

		return index
	}

	const InteractionMousedown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault() //防止触发使输入框失焦

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

		const ofsLeft = mousePositon.left < logicWidth ? mousePositon.left : Math.round(mousePositon.left + canvasStore.containerOffsetLeft)
		const ofsTop = mousePositon.top < logicHeight ? mousePositon.top : Math.round(mousePositon.top + canvasStore.containerOffsetTop)

		const index = {
			rowIndex: Math.min(getIndex(ofsTop, lineWidth, logicHeight, "row"), tableDataStore.cellDataInfo.rowNum),
			columnIndex: Math.min(getIndex(ofsLeft, lineWidth, logicWidth, "column"), tableDataStore.cellDataInfo.columnNum),
		}

		// 记录组件内部维护的点击值
		interactionRecord.current.isMosuedown = true

		// 正在处于编辑状态，则不触发点击
		if (isIndexEqual(interactionStore.mousedownIndex, index) && interactionStore.isEdit) return

		dispatch(
			mousedownDispatch({
				cellIndex: {
					rowIndex: index.rowIndex,
					columnIndex: index.columnIndex,
				},
			})
		)
	}

	const InteractionMousemove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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

		const ofsLeft = Math.round(mousePositon.left + canvasStore.containerOffsetLeft)
		const ofsTop = Math.round(mousePositon.top + canvasStore.containerOffsetTop)

		const index = {
			rowIndex: Math.min(getIndex(ofsTop, lineWidth, logicHeight, "row"), tableDataStore.cellDataInfo.rowNum),
			columnIndex: Math.min(getIndex(ofsLeft, lineWidth, logicWidth, "column"), tableDataStore.cellDataInfo.columnNum),
		}

		// 记录组件内部维护的移动值
		interactionRecord.current.isMousemove = true

		if (!interactionRecord.current.isMosuedown) return
		dispatch(
			mousemoveDispatch({
				cellIndex: {
					rowIndex: index.rowIndex,
					columnIndex: index.columnIndex,
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

	return (
		<InteractionPanelContainer data-testid="interaction-panel" onMouseDown={(e) => InteractionMousedown(e)} onMouseMove={(e) => InteractionMousemove(e)} onMouseUp={() => InteractionMouseup()} />
	)
}

export { InteractionPanel }
