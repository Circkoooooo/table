import { useRef } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { InteractionPanelContainer } from "../styled/InteractionPanel-styled"
import { mousedownDispatch, mousemoveDispatch, mousemoveHeaderDispatch, mouseupDispatch } from "../redux/interaction/interactionSlice"
import isIndexEqual from "../tools/isIndexEqual"
import { getIndexByOffsetStart } from "../getIndexByOffsetStart"
import changeBodyCursor from "../tools/changeBodyCursor"
import changeBodyPointerByIndex from "../changeBodyPointerByIndex"

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
	 * 获取表格线条和逻辑尺寸的固定默认值
	 */
	const { cellDefaultLogicSize, cellDefaultLineWidth } = canvasStore.tableStaticConfig
	const lineWidth = cellDefaultLineWidth
	const logicWidth = cellDefaultLogicSize.width
	const logicHeight = cellDefaultLogicSize.height

	const interactionMousedown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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

		// 鼠标的偏移量。如果小于逻辑尺寸，则在头部，否则在body。如果在body上移动，则值需要加上滚动条偏移
		const ofsLeft = mousePositon.left < logicWidth ? mousePositon.left : mousePositon.left + canvasStore.containerOffsetLeft
		const ofsTop = mousePositon.top < logicHeight ? mousePositon.top : mousePositon.top + canvasStore.containerOffsetTop

		const { rowHeight, columnWidth } = canvasStore.tableRowColumnCellConfig

		const currentRowIndex = getIndexByOffsetStart(ofsTop, lineWidth, logicHeight, rowHeight)
		const currentColumnIndex = getIndexByOffsetStart(ofsLeft, lineWidth, logicWidth, columnWidth)
		const maxRowIndex = tableDataStore.cellDataInfo.rowNum
		const maxColumnIndex = tableDataStore.cellDataInfo.columnNum
		if (currentRowIndex > maxRowIndex || currentColumnIndex > maxColumnIndex) return

		const index = {
			rowIndex: currentRowIndex,
			columnIndex: currentColumnIndex,
		}

		changeBodyPointerByIndex("calc", index)

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

	const interactionMousemove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const containerTargetRect = (e.target as HTMLDivElement).getBoundingClientRect()
		const containerPositon = {
			left: containerTargetRect.left,
			top: containerTargetRect.top,
		}
		const mousePositon = {
			left: e.clientX - containerPositon.left,
			top: e.clientY - containerPositon.top,
		}

		const ofsLeft = Math.round(mousePositon.left + canvasStore.containerOffsetLeft)
		const ofsTop = Math.round(mousePositon.top + canvasStore.containerOffsetTop)

		const { rowHeight, columnWidth } = canvasStore.tableRowColumnCellConfig
		const index = {
			rowIndex: Math.min(getIndexByOffsetStart(ofsTop, lineWidth, logicHeight, rowHeight), tableDataStore.cellDataInfo.rowNum),
			columnIndex: Math.min(getIndexByOffsetStart(ofsLeft, lineWidth, logicWidth, columnWidth), tableDataStore.cellDataInfo.columnNum),
		}

		//mousemoveDispatch 当鼠标按下时候记录的索引
		function dispatchMove() {
			dispatch(
				mousemoveDispatch({
					cellIndex: {
						rowIndex: index.rowIndex,
						columnIndex: index.columnIndex,
					},
				})
			)
		}
		/****************************鼠标在头部时，直接记录move索引。在非头部时候，mousedown的时候记录move索引*********************************************** */
		//只要鼠标在头部,就会记录mousemoveHeader索引,不在头部的时候就会记录为null
		dispatch(
			mousemoveHeaderDispatch({
				cellIndex: index,
			})
		)

		// 鼠标在头部索引时的交互事件
		if (index.columnIndex === 0 || index.rowIndex === 0) {
			changeBodyCursor("pointer")
			dispatchMove()
		} else {
			changeBodyCursor("auto")
		}

		// 记录组件内部维护的移动值
		// interactionRecord.current.isMousemove = true

		if (!interactionRecord.current.isMosuedown) return
		dispatchMove()
	}

	const interactionMouseup = () => {
		interactionRecord.current = {
			...interactionRecord.current,
			isMosuedown: false,
			isMousemove: false,
		}
		dispatch(mouseupDispatch())
	}

	const interactionMouseout = () => {
		changeBodyPointerByIndex("reset")
	}

	return (
		<InteractionPanelContainer
			onMouseOut={() => interactionMouseout()}
			data-testid="interaction-panel"
			onMouseDown={(e) => interactionMousedown(e)}
			onMouseMove={(e) => interactionMousemove(e)}
			onMouseUp={() => interactionMouseup()}
		/>
	)
}

export { InteractionPanel }
