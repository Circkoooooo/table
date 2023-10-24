import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { LineFlexibleContainer, LineFlexibleControls, LineFlexiblePanel, LineFlexibleTipsBar } from "../../styled/highlight/lineFlexible-styled"
import { IndexType } from "../../types/table.types"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { lineFlexibleActiveOffset, lineFlexibleCurrentIndexDispatch, lineFlexibleCurrentOffsetDispatch } from "../../redux/interaction/lineFlexible/lineFlexibleSlice"
import { updateRowColumnCellConfigDispatch } from "../../redux/canvas/canvasSlice"
import { mousedownDispatch, mouseupDispatch } from "../../redux/interaction/interactionSlice"

interface LineFlexibleProps {
	index: IndexType | null
	cellLogicWidth: number
	cellLogicHeight: number
	ofsLeft: number
	ofsTop: number
	borderWidth: number
}

const LineFlexible: React.FC<LineFlexibleProps> = ({ index, cellLogicHeight, cellLogicWidth, ofsLeft, ofsTop, borderWidth }) => {
	const dispatch = useAppDispatch()
	const lineFlexibleStore = useAppSelector((state) => state.lineFlexible)
	const canvasStore = useAppSelector((state) => state.canvas)

	// 记录滑块拖动的偏移量
	const currentOfs = useRef({
		ofsLeft: 0,
		ofsTop: 0,
	})

	// 当前的flexible激活态的索引记录
	const flexibleActiveIndexType = useMemo(() => {
		let indexMouseOnType: "row" | "column" | null = null //鼠标所处行还是列

		const currentIndex = lineFlexibleStore.lineFlexibleCurrentIndex
		// 如果当前索引没有记录，则为null
		if (!currentIndex) {
			indexMouseOnType = null
			return indexMouseOnType
		}

		const { rowIndex, columnIndex } = currentIndex
		//如果行列都为0，则不记录
		if (rowIndex === 0 && columnIndex === 0) {
			indexMouseOnType = null
			return indexMouseOnType
		}

		if (rowIndex === 0) {
			indexMouseOnType = "row"
		} else if (columnIndex === 0) indexMouseOnType = "column"

		return indexMouseOnType
	}, [lineFlexibleStore.lineFlexibleCurrentIndex])

	// 处于头部区域，记录索引是处于行还是列
	const currentFlexibleHoverIndexType = useMemo(() => {
		if (!index) return null
		let indexMouseOnType: "row" | "column" | null = null

		const { rowIndex, columnIndex } = index
		if (rowIndex === 0) {
			indexMouseOnType = "row"
		} else if (columnIndex === 0) {
			indexMouseOnType = "column"
		}

		return indexMouseOnType
	}, [index])

	/**
	 * 每次触发拖动或者完成都要清空
	 */
	const clearCurrentRecord = useCallback(() => {
		currentOfs.current = {
			...currentOfs.current,
			ofsLeft: 0,
			ofsTop: 0,
		}
	}, [])

	/**
	 * 记录拖动状态的索引
	 */
	const onItemMousedown = (e: React.MouseEvent<HTMLDivElement>) => {
		const mouseScreenPosition = {
			screenX: e.screenX,
			screenY: e.screenY,
		}

		const offset = {
			offsetLeft: ofsLeft,
			offsetTop: ofsTop,
		}

		// 记录第一次点击时候的偏移量
		dispatch(
			lineFlexibleCurrentOffsetDispatch({
				mouseScreenPosition,
				offset,
			})
		)

		//记录第一次点击的时候记录的索引
		dispatch(
			lineFlexibleCurrentIndexDispatch({
				index,
			})
		)

		dispatch(
			lineFlexibleActiveOffset({
				offset: {
					offsetLeft: 0,
					offsetTop: 0,
				},
			})
		)

		dispatch(
			mousedownDispatch({
				cellIndex: {
					rowIndex: index?.rowIndex || 0,
					columnIndex: index?.columnIndex || 0,
				},
			})
		)
		dispatch(mouseupDispatch())
		clearCurrentRecord()
	}

	/**
	 * 取消拖动状态，将拖动索引清零
	 */
	const onItemMouseCancel = useCallback(() => {
		// 执行伸缩记录
		const currentIndex = lineFlexibleStore.lineFlexibleCurrentIndex
		const { offsetLeft, offsetTop } = lineFlexibleStore.activeOffect

		if (currentIndex) {
			const { rowIndex, columnIndex } = currentIndex
			if (rowIndex === 0) {
				dispatch(
					updateRowColumnCellConfigDispatch({
						type: "column",
						index: currentIndex.columnIndex - 1,
						value: offsetLeft,
					})
				)
			} else if (columnIndex === 0) {
				dispatch(
					updateRowColumnCellConfigDispatch({
						type: "row",
						index: currentIndex.rowIndex - 1,
						value: offsetTop,
					})
				)
			}
		}

		const mouseScreenPosition = {
			screenX: 0,
			screenY: 0,
		}

		const offset = {
			offsetLeft: 0,
			offsetTop: 0,
		}

		dispatch(
			lineFlexibleCurrentOffsetDispatch({
				mouseScreenPosition,
				offset,
			})
		)
		dispatch(
			lineFlexibleCurrentIndexDispatch({
				index: null,
			})
		)

		clearCurrentRecord()
	}, [dispatch, lineFlexibleStore, clearCurrentRecord])

	const onMousemove = useCallback(
		(e: MouseEvent) => {
			if (!flexibleActiveIndexType) return

			const startMouseScreenX = lineFlexibleStore.lineFlexibleCurrentScreenPosition.screenX
			const startMouseScreenY = lineFlexibleStore.lineFlexibleCurrentScreenPosition.screenY

			currentOfs.current.ofsTop = e.screenY - startMouseScreenY
			currentOfs.current.ofsLeft = e.screenX - startMouseScreenX

			const lineFlexCurrentRowIndex = lineFlexibleStore.lineFlexibleCurrentIndex?.rowIndex || 0
			const lineFlexCurrentColumnIndex = lineFlexibleStore.lineFlexibleCurrentIndex?.columnIndex || 0

			const currentRowHeight = canvasStore.tableRowColumnCellConfig.rowHeight.find((item) => item.index === lineFlexCurrentRowIndex - 1)?.value || 0
			const currentColumnWidth = canvasStore.tableRowColumnCellConfig.columnWidth.find((item) => item.index === lineFlexCurrentColumnIndex - 1)?.value || 0

			// 记录执行flex
			if (flexibleActiveIndexType === "row") {
				const flexMin = -currentColumnWidth - cellLogicWidth + canvasStore.drawConfig.fontSize
				dispatch(
					lineFlexibleActiveOffset({
						offset: {
							offsetLeft: currentOfs.current.ofsLeft <= flexMin ? flexMin : currentOfs.current.ofsLeft,
						},
					})
				)
			} else if (flexibleActiveIndexType === "column") {
				const flexMin = -currentRowHeight - cellLogicHeight + canvasStore.drawConfig.fontSize
				dispatch(
					lineFlexibleActiveOffset({
						offset: {
							offsetTop: currentOfs.current.ofsTop <= flexMin ? flexMin : currentOfs.current.ofsTop,
						},
					})
				)
			}
		},
		[lineFlexibleStore, canvasStore, flexibleActiveIndexType, cellLogicHeight, cellLogicWidth, dispatch]
	)

	/**
	 * 是否显示尺寸变化拖动条
	 * 当有当前索引的时候需要显示拖动条，而不显示悬浮提示条
	 */
	const isTipsBarShow = useMemo(() => {
		const currentIndex = lineFlexibleStore.lineFlexibleCurrentIndex

		if (currentIndex === null) return false

		// 如果鼠标在（0，0），不显示
		const { rowIndex, columnIndex } = currentIndex
		if (rowIndex === 0 && columnIndex === 0) return false

		return true
	}, [lineFlexibleStore])

	useEffect(() => {
		window.addEventListener("mouseup", onItemMouseCancel)
		window.addEventListener("mousemove", onMousemove)
		return () => {
			window.removeEventListener("mouseup", onItemMouseCancel)
			window.removeEventListener("mousemove", onMousemove)
		}
	}, [onItemMouseCancel, ofsLeft, ofsTop, onMousemove])

	// 伸缩距离后计算的偏移量
	const offsetTopAfterFlex = flexibleActiveIndexType === "row" ? 0 : cellLogicHeight + lineFlexibleStore.lineFlexibleCurrentOffset.offsetTop + lineFlexibleStore.activeOffect.offsetTop
	const offsetLeftAfterFlex = flexibleActiveIndexType === "column" ? 0 : cellLogicWidth + lineFlexibleStore.lineFlexibleCurrentOffset.offsetLeft + lineFlexibleStore.activeOffect.offsetLeft

	return (
		<LineFlexiblePanel data-testid="lineflexible">
			{flexibleActiveIndexType && isTipsBarShow && (
				<LineFlexibleTipsBar $ofsLeft={offsetLeftAfterFlex} $ofsTop={offsetTopAfterFlex} $flexibleActiveIndexType={flexibleActiveIndexType}>
					<span>
						{flexibleActiveIndexType === "column" ? lineFlexibleStore.activeOffect.offsetTop : flexibleActiveIndexType === "row" ? lineFlexibleStore.activeOffect.offsetLeft : null}
					</span>
				</LineFlexibleTipsBar>
			)}
			{index && (
				<LineFlexibleContainer
					{...{
						$rowIndex: index.rowIndex,
						$columnIndex: index.columnIndex,
						$cellLogicHeight: cellLogicHeight,
						$cellLogicWidth: cellLogicWidth,
						$borderWidth: borderWidth,
						$ofsLeft: ofsLeft,
						$ofsTop: ofsTop,
					}}
				>
					{!isTipsBarShow && !(index.rowIndex === 0 && index.columnIndex === 0) && (
						<LineFlexibleControls $currentIndexType={currentFlexibleHoverIndexType} onMouseDown={(e) => onItemMousedown(e)} />
					)}
				</LineFlexibleContainer>
			)}
		</LineFlexiblePanel>
	)
}

export { LineFlexible }
