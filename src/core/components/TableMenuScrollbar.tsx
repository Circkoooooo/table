import React, { useCallback, useEffect, useRef } from "react"
import { TableMenuScrollbarContainer, TableMenuScrollbarItem } from "../styled/TableMain-styled"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { updateContainerOffsetDispatch } from "../redux/canvas/canvasSlice"
import { debounce } from "../../tools/debounce"
import useDebounce from "../../hooks/useDebounce"

type ScrollbarRecord = {
	isMouseDown: boolean
	isTouchStart: boolean
	startScreenPosition: {
		x: number
		y: number
	}
	endScreenPosition: {
		x: number
		y: number
	}
	currentOffsetLeft: number
	currentOffsetTop: number
	offsetLeft: number //右 -> 正
	offsetTop: number //下 -> 正
	startOffsetLeft: number
	startOffsetTop: number
	offsetPercent: number
	ratio: number
}

type ScrollCallbackParam = {
	currentOffsetLeft: number
	currentOffsetTop: number
	maxOffsetLeft: number
	maxOffsetTop: number
	currentOffsetPercent: number
	nativeRecord: {
		direction: string
		offsetTop: number
		offsetLeft: number
	}
}
interface TableMenuScrollbarProps {
	direction: "vertical" | "horizontal"
	scrollCallback?: (param: ScrollCallbackParam) => void
}

const MIN_SCROLLITEM_SIZE = 50

const TableMenuScrollbar: React.FC<TableMenuScrollbarProps> = ({ direction }) => {
	const scrollbarItemRef = useRef<HTMLDivElement>(null)
	const scrollbarContainerRef = useRef<HTMLDivElement>(null)
	const canvasStore = useAppSelector((state) => state.canvas)

	const dispatch = useAppDispatch()

	const record = useRef<ScrollbarRecord>({
		isMouseDown: false,
		isTouchStart: false,
		startScreenPosition: {
			x: 0,
			y: 0,
		},
		endScreenPosition: {
			x: 0,
			y: 0,
		},
		currentOffsetLeft: 0,
		currentOffsetTop: 0,
		offsetLeft: 0, //记录过程中产生的偏移量
		offsetTop: 0,
		startOffsetLeft: 0, //开始记录时滑块的便宜
		startOffsetTop: 0,
		offsetPercent: 0,
		ratio: 0,
	})

	const canvasContainerRef = useRef({
		canvasContainerWidth: 0,
		canvasContainerHeight: 0,
		canvasContainerMaxWidth: 0,
		canvasContainerMaxHeight: 0,
		canvasContainerOffsetLeft: 0,
		canvasContainerOffsetTop: 0,
	})

	/**
	 * 滚动条容器中body部分的长度
	 */
	const scrollbarContainerLength = useCallback(() => {
		const container = scrollbarContainerRef.current
		if (!container) return 0

		const boxOuterWidth = Number(window.getComputedStyle(container).borderWidth.replace("px", "")) + Number(window.getComputedStyle(container).padding.replace("px", ""))

		if (direction === "horizontal") {
			return container.clientWidth - boxOuterWidth * 2
		} else {
			return container.clientHeight - boxOuterWidth * 2
		}
	}, [direction])

	/**
	 * 滚动条滑块长度
	 */
	const scrollbarItemLength = useCallback(() => {
		const container = scrollbarContainerRef.current
		if (!container) return 0
		const containerMaxWidth = canvasStore.containerMaxWidth
		const containerMaxHeight = canvasStore.containerMaxHeight
		const containerWidth = canvasStore.containerWidth
		const containerHeight = canvasStore.containerHeight

		let restScroll = 0

		if (direction === "horizontal") {
			const containerLength = scrollbarContainerLength()
			restScroll = containerLength * ((containerMaxWidth - containerWidth) / containerMaxWidth)

			return Math.min(Math.max(MIN_SCROLLITEM_SIZE, containerLength - restScroll), containerLength)
		} else {
			const containerLength = scrollbarContainerLength()
			restScroll = container.clientHeight * ((containerMaxHeight - containerHeight) / containerMaxHeight)
			return Math.min(Math.max(MIN_SCROLLITEM_SIZE, containerLength - restScroll), containerLength)
		}
	}, [canvasStore.containerWidth, canvasStore.containerHeight, canvasStore.containerMaxHeight, canvasStore.containerMaxWidth, direction, scrollbarContainerLength])

	const scrollbarMaxScroll = useCallback(() => {
		return scrollbarContainerLength() - scrollbarItemLength()
	}, [scrollbarItemLength, scrollbarContainerLength])

	const scrollPercent = useCallback(() => {
		//最大偏移量
		const maxScrollLength = scrollbarMaxScroll()
		const { startScreenPosition, endScreenPosition, offsetPercent } = record.current
		//1. 获取滑块初始位移
		const newScrollbarOffset = Math.max(0, Math.min(offsetPercent * maxScrollLength, maxScrollLength))

		if (direction === "horizontal") {
			const offsetLeft = endScreenPosition.x - startScreenPosition.x
			const newOffsetLeft = Math.min(Math.max(0, newScrollbarOffset + offsetLeft), maxScrollLength)
			return isNaN(newOffsetLeft / maxScrollLength) ? 0 : newOffsetLeft / maxScrollLength
		} else {
			const offsetTop = endScreenPosition.y - startScreenPosition.y
			const newOffsetTop = Math.min(Math.max(0, newScrollbarOffset + offsetTop), maxScrollLength)
			return isNaN(newOffsetTop / maxScrollLength) ? 0 : newOffsetTop / maxScrollLength
		}
	}, [scrollbarMaxScroll, direction])

	// 计算并设置最新的滑块位置
	const calcOffset = useCallback(() => {
		if (!scrollbarItemRef.current) return null

		//最大偏移量
		const maxScrollLength = scrollbarMaxScroll()

		const { startScreenPosition, endScreenPosition, offsetPercent } = record.current
		//1. 获取滑块初始位移
		const newScrollbarOffset = Math.max(0, Math.min(offsetPercent * maxScrollLength, maxScrollLength))

		// 获取最新偏移
		const offsetLeft = endScreenPosition.x - startScreenPosition.x
		const offsetTop = endScreenPosition.y - startScreenPosition.y

		if (direction === "horizontal") {
			// 计算当前滑块的偏移量
			const newOffsetLeft = Math.min(Math.max(0, newScrollbarOffset + offsetLeft), maxScrollLength)

			scrollbarItemRef.current.setAttribute("style", `transform:translateX(${newOffsetLeft}px);}px`)
			record.current.currentOffsetLeft = newOffsetLeft

			// 计算并记录当前偏移量
			const currentOffsetLeft = (record.current.currentOffsetLeft / maxScrollLength) * canvasStore.containerMaxOffsetLeft
			dispatch(
				updateContainerOffsetDispatch({
					offsetLeft: isNaN(currentOffsetLeft) ? 0 : currentOffsetLeft,
				})
			)
		} else {
			const newOffsetTop = Math.min(Math.max(0, newScrollbarOffset + offsetTop), maxScrollLength)
			scrollbarItemRef.current.setAttribute("style", `transform:translateY(${newOffsetTop}px);}px`)
			record.current.currentOffsetTop = newOffsetTop

			const currentOffsetTop = (record.current.currentOffsetTop / maxScrollLength) * canvasStore.containerMaxOffsetTop

			dispatch(
				updateContainerOffsetDispatch({
					offsetTop: isNaN(currentOffsetTop) ? 0 : currentOffsetTop,
				})
			)
		}
	}, [direction, scrollbarMaxScroll])

	useEffect(() => {
		canvasContainerRef.current = {
			canvasContainerWidth: canvasStore.containerWidth,
			canvasContainerHeight: canvasStore.containerHeight,
			canvasContainerMaxWidth: canvasStore.containerMaxWidth,
			canvasContainerMaxHeight: canvasStore.containerMaxHeight,
			canvasContainerOffsetLeft: canvasStore.containerOffsetLeft,
			canvasContainerOffsetTop: canvasStore.containerOffsetTop,
		}

		if (direction === "horizontal") {
			const ratio = scrollbarItemLength() / canvasStore.containerMaxWidth
			record.current.ratio = ratio
		} else {
			const ratio = scrollbarItemLength() / canvasStore.containerMaxHeight
			record.current.ratio = ratio
		}
	}, [scrollbarItemLength, direction])

	const recordStartPosition = useCallback(
		(screenX: number, screenY: number) => {
			const { canvasContainerMaxWidth, canvasContainerMaxHeight, canvasContainerWidth, canvasContainerHeight } = canvasContainerRef.current

			if (direction === "horizontal") {
				const maxOffset = canvasContainerMaxWidth - canvasContainerWidth
				const currentOffset = record.current.startOffsetLeft + record.current.offsetLeft

				if (currentOffset < 0) {
					record.current.startOffsetLeft = 0
				} else if (currentOffset > maxOffset) {
					record.current.startOffsetLeft = maxOffset
				} else {
					record.current.startOffsetLeft = record.current.startOffsetLeft + record.current.offsetLeft
				}
			} else {
				const maxOffset = canvasContainerMaxHeight - canvasContainerHeight
				const currentOffset = record.current.startOffsetTop + record.current.offsetTop
				if (currentOffset < 0) {
					record.current.startOffsetTop = 0
				} else if (currentOffset > maxOffset) {
					record.current.startOffsetTop = maxOffset
				} else {
					record.current.startOffsetTop = record.current.startOffsetTop + record.current.offsetTop
				}
			}

			record.current.startScreenPosition = {
				x: screenX,
				y: screenY,
			}
			record.current.endScreenPosition = {
				x: screenX,
				y: screenY,
			}
		},
		[direction]
	)

	const recordEndPosition = (screenX: number, screenY: number) => {
		record.current.endScreenPosition = {
			x: screenX,
			y: screenY,
		}
	}

	const handleMouseDown = useCallback(
		(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			record.current.isMouseDown = true
			recordStartPosition(e.screenX, e.screenY)
		},
		[recordStartPosition]
	)

	const handleTouchStart = useCallback(
		(e: TouchEvent) => {
			record.current.isTouchStart = true
			recordStartPosition(e.targetTouches[0].screenX, e.targetTouches[0].screenY)
		},
		[recordStartPosition]
	)

	const handleMouseUp = useCallback(() => {
		if (!record.current.isMouseDown) return
		record.current.isMouseDown = false

		record.current.offsetPercent = scrollPercent()
	}, [scrollPercent])

	const handleTouchEnd = useCallback(() => {
		if (record.current.isTouchStart) return
		record.current.isTouchStart = false

		record.current.offsetPercent = scrollPercent()
	}, [scrollPercent])

	const handleTouchMove = useCallback(
		(e: TouchEvent) => {
			if (!record.current.isTouchStart) return
			const targetTouch = e.targetTouches[0]
			recordEndPosition(targetTouch.screenX, targetTouch.screenY)
			calcOffset()
		},
		[calcOffset]
	)

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!record.current.isMouseDown) return
			recordEndPosition(e.screenX, e.screenY)
			calcOffset()
		},
		[calcOffset]
	)

	const handleResize = useDebounce(() => {
		calcOffset()
	}, 100)

	useEffect(() => {
		window.addEventListener("mouseup", handleMouseUp)
		window.addEventListener("touchend", handleTouchEnd)
		window.addEventListener("mousemove", handleMouseMove)
		window.addEventListener("touchmove", handleTouchMove)
		window.addEventListener("touchstart", handleTouchStart)
		return () => {
			window.removeEventListener("mouseup", handleMouseUp)
			window.removeEventListener("touchend", handleTouchEnd)
			window.removeEventListener("mousemove", handleMouseMove)
			window.removeEventListener("touchmove", handleTouchMove)
		}
	}, [handleMouseUp, handleTouchEnd, handleMouseMove, handleTouchMove, handleTouchStart])

	useEffect(() => {
		window.addEventListener("resize", handleResize)
	}, [handleResize])

	return (
		<TableMenuScrollbarContainer dirction={direction} ref={scrollbarContainerRef}>
			<TableMenuScrollbarItem $scrollBarLength={scrollbarItemLength()} dirction={direction} ref={scrollbarItemRef} onTouchStart={(e) => {}} onMouseDown={(e) => handleMouseDown(e)} />
		</TableMenuScrollbarContainer>
	)
}

export default TableMenuScrollbar
