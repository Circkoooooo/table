import { useRef } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { InteractionPanelContainer } from "../styled/InteractionPanel-styled"
import { mousedownDispatch, mousemoveDispatch, mouseupDispatch } from "../redux/interaction/interactionSlice"
import isIndexEqual from "../tools/isIndexEqual"
import { getIndexByOffsetStart } from "../getIndexByOffsetStart"

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

		// 鼠标的偏移量。如果小于逻辑尺寸，则在头部，否则在body。如果在body上移动，则值需要加上滚动条偏移
		const ofsLeft = mousePositon.left < logicWidth ? mousePositon.left : Math.round(mousePositon.left + canvasStore.containerOffsetLeft)
		const ofsTop = mousePositon.top < logicHeight ? mousePositon.top : Math.round(mousePositon.top + canvasStore.containerOffsetTop)

		const { rowHeight, columnWidth } = canvasStore.tableRowColumnCellConfig
		const index = {
			rowIndex: Math.min(getIndexByOffsetStart(ofsTop, lineWidth, logicHeight, rowHeight), tableDataStore.cellDataInfo.rowNum),
			columnIndex: Math.min(getIndexByOffsetStart(ofsLeft, lineWidth, logicWidth, columnWidth), tableDataStore.cellDataInfo.columnNum),
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

		const { rowHeight, columnWidth } = canvasStore.tableRowColumnCellConfig
		const index = {
			rowIndex: Math.min(getIndexByOffsetStart(ofsTop, lineWidth, logicHeight, rowHeight), tableDataStore.cellDataInfo.rowNum),
			columnIndex: Math.min(getIndexByOffsetStart(ofsLeft, lineWidth, logicWidth, columnWidth), tableDataStore.cellDataInfo.columnNum),
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
