import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { LineFlexibleContainer, LineFlexibleControls, LineFlexiblePanel, LineFlexibleTipsBar } from "../../styled/highlight/lineFlexible-styled"
import { IndexType } from "../../types/table.types"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { lineFlexibleCurrentIndexDispatch, lineFlexibleCurrentOffsetDispatch } from "../../redux/interaction/lineFlexible/lineFlexibleSlice"
import { updateRowColumnCellConfigDispatch } from "../../redux/canvas/canvasSlice"

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

	const flexRecord = useRef({
		currentTopFlex: 0,
		currentLeftFlex: 0,
	})

	/**
	 * 每次触发拖动或者完成都要清空
	 */
	const clearCurrentRecord = () => {
		currentOfs.current = {
			...currentOfs.current,
			ofsLeft: 0,
			ofsTop: 0,
		}

		flexRecord.current = {
			...flexRecord.current,
			currentLeftFlex: 0,
			currentTopFlex: 0,
		}
	}

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
		clearCurrentRecord()
	}

	/**
	 * 取消拖动状态，将拖动索引清零
	 */
	const onItemMouseCancel = useCallback(() => {
		// 执行伸缩记录
		const currentIndex = lineFlexibleStore.lineFlexibleCurrentIndex
		if (currentIndex) {
			dispatch(
				updateRowColumnCellConfigDispatch({
					type: "row",
					index: currentIndex.rowIndex - 1,
					value: flexRecord.current.currentTopFlex,
				})
			)
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
	}, [dispatch, lineFlexibleStore])

	const onMousemove = useCallback(
		(e: MouseEvent) => {
			const startMouseScreenX = lineFlexibleStore.lineFlexibleCurrentScreenPosition.screenX
			const startMouseScreenY = lineFlexibleStore.lineFlexibleCurrentScreenPosition.screenY

			currentOfs.current.ofsLeft = e.screenY - startMouseScreenX
			currentOfs.current.ofsTop = e.screenY - startMouseScreenY

			// 记录执行flex
			flexRecord.current.currentTopFlex = currentOfs.current.ofsTop <= 1 ? 1 : currentOfs.current.ofsTop
		},
		[lineFlexibleStore]
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

	const offsetTopAfterFlex = cellLogicHeight + lineFlexibleStore.lineFlexibleCurrentOffset.offsetTop + flexRecord.current.currentTopFlex
	const offsetLeftAfterFlex = cellLogicHeight + lineFlexibleStore.lineFlexibleCurrentOffset.offsetTop + flexRecord.current.currentLeftFlex

	return (
		<LineFlexiblePanel data-testid="lineflexible">
			<LineFlexibleTipsBar $isTipsBarShow={isTipsBarShow} $ofsLeft={lineFlexibleStore.lineFlexibleCurrentOffset.offsetLeft} $ofsTop={offsetTopAfterFlex}>
				{flexRecord.current.currentTopFlex}
			</LineFlexibleTipsBar>

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
					{!isTipsBarShow && !(index.rowIndex === 0 && index.columnIndex === 0) && <LineFlexibleControls onMouseDown={(e) => onItemMousedown(e)} />}
				</LineFlexibleContainer>
			)}
		</LineFlexiblePanel>
	)
}

export { LineFlexible }
