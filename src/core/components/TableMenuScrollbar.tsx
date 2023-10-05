import React, { useCallback, useEffect, useRef } from "react"
import { TableMenuScrollbarContainer, TableMenuScrollbarItem } from "../styled/TableMain-styled"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { updateContainerOffsetDispatch } from "../redux/canvas/canvasSlice"
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
}

interface TableMenuScrollbarProps {
	direction: "vertical" | "horizontal"
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
	})

	const canvasContainerRef = useRef({
		canvasContainerWidth: 0,
		canvasContainerHeight: 0,
		canvasContainerMaxWidth: 0,
		canvasContainerMaxHeight: 0,
		canvasContainerOffsetLeft: 0,
		canvasContainerOffsetTop: 0,
		canvasContainerMaxOffsetLeft: 0,
		canvasContainerMaxOffsetTop: 0,
	})

	const getDpr = () => {
		return window.devicePixelRatio
	}

	/**
	 * 滚动条容器的总滚动长度
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
	}, [canvasStore, direction, scrollbarContainerLength])

	/**
	 * 滚动条最大偏移量
	 */
	const scrollbarMaxScroll = useCallback(() => {
		return scrollbarContainerLength() - scrollbarItemLength()
	}, [scrollbarItemLength, scrollbarContainerLength])

	const scrollbarOffset = useCallback(() => {
		return direction === "horizontal" ? record.current.startOffsetLeft * getDpr() : record.current.startOffsetTop * getDpr()
	}, [direction])

	const updateScrollbarTranslate = useCallback(
		(translate: number) => {
			if (!scrollbarItemRef.current) return

			if (direction === "horizontal") {
				scrollbarItemRef.current.setAttribute("style", `transform:translateX(${translate}px);`)
			} else {
				scrollbarItemRef.current.setAttribute("style", `transform:translateY(${translate}px);`)
			}
		},
		[direction]
	)

	// 计算并设置最新的滑块位置
	const calcOffset = useCallback(
		(isMobile?: boolean) => {
			if (!scrollbarItemRef.current) return null
			const { startScreenPosition, endScreenPosition } = record.current

			const maxScrollLength = scrollbarMaxScroll()
			const startScrollbarOffset = scrollbarOffset()

			const newMouseOffsetLeft = isMobile ? startScreenPosition.x - endScreenPosition.x : endScreenPosition.x - startScreenPosition.x
			const newMouseoffsetTop = isMobile ? startScreenPosition.y - endScreenPosition.y : endScreenPosition.y - startScreenPosition.y

			if (direction === "horizontal") {
				// 计算当前滑块的偏移量
				const currentScrollbarOffsetLeft = Math.min(Math.max(0, startScrollbarOffset + newMouseOffsetLeft) / getDpr(), maxScrollLength)

				updateScrollbarTranslate(currentScrollbarOffsetLeft)

				record.current.currentOffsetLeft = currentScrollbarOffsetLeft

				// 计算并记录当前偏移量
				const currentOffsetLeft = (record.current.currentOffsetLeft / maxScrollLength) * canvasContainerRef.current.canvasContainerMaxOffsetLeft

				// 提交最新容器偏移
				dispatch(
					updateContainerOffsetDispatch({
						offsetLeft: isNaN(currentOffsetLeft) ? 0 : currentOffsetLeft,
					})
				)
			} else {
				const currentScrollbarOffsetTop = Math.min(Math.max(0, startScrollbarOffset + newMouseoffsetTop) / getDpr(), maxScrollLength)
				updateScrollbarTranslate(currentScrollbarOffsetTop)
				record.current.currentOffsetTop = currentScrollbarOffsetTop
				const currentOffsetTop = (record.current.currentOffsetTop / maxScrollLength) * canvasContainerRef.current.canvasContainerMaxOffsetTop

				dispatch(
					updateContainerOffsetDispatch({
						offsetTop: isNaN(currentOffsetTop) ? 0 : currentOffsetTop,
					})
				)
			}
		},
		[direction, scrollbarMaxScroll, dispatch, scrollbarOffset, updateScrollbarTranslate]
	)

	useEffect(() => {
		canvasContainerRef.current = {
			canvasContainerWidth: canvasStore.containerWidth,
			canvasContainerHeight: canvasStore.containerHeight,
			canvasContainerMaxWidth: canvasStore.containerMaxWidth,
			canvasContainerMaxHeight: canvasStore.containerMaxHeight,
			canvasContainerOffsetLeft: canvasStore.containerOffsetLeft,
			canvasContainerOffsetTop: canvasStore.containerOffsetTop,
			canvasContainerMaxOffsetLeft: canvasStore.containerMaxOffsetLeft,
			canvasContainerMaxOffsetTop: canvasStore.containerMaxOffsetTop,
		}
	}, [scrollbarItemLength, direction, canvasStore])

	const recordStartPosition = useCallback(
		(screenX: number, screenY: number) => {
			if (direction === "horizontal") {
				record.current.startOffsetLeft = record.current.currentOffsetLeft
			} else {
				record.current.startOffsetTop = record.current.currentOffsetTop
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
	}, [])

	const handleTouchEnd = useCallback(() => {
		if (record.current.isTouchStart) return
		record.current.isTouchStart = false
	}, [])

	const handleTouchMove = useCallback(
		(e: TouchEvent) => {
			e.preventDefault()
			if (!record.current.isTouchStart) return
			const targetTouch = e.targetTouches[0]
			recordEndPosition(targetTouch.screenX, targetTouch.screenY)
			calcOffset(true)
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
	}, 50)

	useEffect(() => {
		window.addEventListener("mouseup", handleMouseUp)
		window.addEventListener("touchend", handleTouchEnd)
		window.addEventListener("mousemove", handleMouseMove)
		window.addEventListener("touchmove", handleTouchMove, { passive: false })
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
