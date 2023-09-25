import React, { useCallback, useEffect, useRef } from "react"
import { TableMenuScrollbarContainer, TableMenuScrollbarItem } from "../styled/TableMain-styled"

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
	getScrollMaxOffsetLeft: number
	getScrollMaxOffsetTop: number
}

type ScrollCallbackParam = {
	currentOffsetLeft: number
	currentOffsetTop: number
	maxOffsetLeft: number
	maxOffsetTop: number
	offsetPercent: number
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

const TableMenuScrollbar: React.FC<TableMenuScrollbarProps> = ({ direction, scrollCallback }) => {
	const scrollbatItemRef = useRef<HTMLDivElement>(null)
	const scrollbarContainerRef = useRef<HTMLDivElement>(null)

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
		getScrollMaxOffsetLeft: 0,
		getScrollMaxOffsetTop: 0,
	})

	const execScrollCallback = useCallback(() => {
		const { offsetLeft, offsetTop, startOffsetLeft, startOffsetTop, currentOffsetLeft, currentOffsetTop } = record.current

		const offsetPercent = direction === "horizontal" ? currentOffsetLeft / (getScrollMaxOffsetLeft() ?? 0) : currentOffsetTop / (getScrollMaxOffsetTop() ?? 0)

		scrollCallback &&
			scrollCallback({
				currentOffsetLeft,
				currentOffsetTop,
				maxOffsetLeft: getScrollMaxOffsetLeft() ?? 0,
				maxOffsetTop: getScrollMaxOffsetTop() ?? 0,
				offsetPercent,
				nativeRecord: {
					direction,
					offsetTop,
					offsetLeft,
				},
			})
	}, [direction, scrollCallback])

	const getScrollMaxOffsetLeft = () => {
		if (!scrollbatItemRef.current || !scrollbarContainerRef.current) return null
		const itemWidth = scrollbatItemRef.current.clientWidth

		return (
			(Number(window.getComputedStyle(scrollbarContainerRef.current).width.replace("px", "")) -
				2 * Number(window.getComputedStyle(scrollbarContainerRef.current).padding.replace("px", "")) -
				itemWidth) *
			window.devicePixelRatio
		)
	}

	const getScrollMaxOffsetTop = () => {
		if (!scrollbatItemRef.current || !scrollbarContainerRef.current) return null
		const itemHeight = scrollbatItemRef.current.clientHeight

		return (
			(Number(window.getComputedStyle(scrollbarContainerRef.current).height.replace("px", "")) -
				2 * Number(window.getComputedStyle(scrollbarContainerRef.current).padding.replace("px", "")) -
				itemHeight) *
			window.devicePixelRatio
		)
	}

	// 计算并设置最新的滑块位置
	const calcOffset = useCallback(() => {
		const dpr = window.devicePixelRatio
		const { startScreenPosition, endScreenPosition } = record.current

		record.current.offsetLeft = endScreenPosition.x - startScreenPosition.x
		record.current.offsetTop = endScreenPosition.y - startScreenPosition.y

		if (!scrollbatItemRef.current || !scrollbarContainerRef.current) return null

		if (direction === "horizontal") {
			const maxOffset = getScrollMaxOffsetLeft() ?? 0
			const currentOffsetLeft = record.current.startOffsetLeft + record.current.offsetLeft
			record.current.currentOffsetLeft = currentOffsetLeft < 0 ? 0 : currentOffsetLeft > maxOffset ? maxOffset : currentOffsetLeft

			const targetTranslateX = record.current.currentOffsetLeft

			scrollbatItemRef.current.setAttribute("style", `transform:translateX(${targetTranslateX / dpr}px);`)
		} else {
			record.current.currentOffsetTop = record.current.startOffsetTop + record.current.offsetTop
			const maxOffset = getScrollMaxOffsetTop() ?? 0
			const currentOffsetTop = record.current.startOffsetTop + record.current.offsetTop
			record.current.currentOffsetTop = currentOffsetTop < 0 ? 0 : currentOffsetTop > maxOffset ? maxOffset : currentOffsetTop

			const targetTranslateY = currentOffsetTop < 0 ? 0 : currentOffsetTop > maxOffset ? maxOffset : currentOffsetTop
			scrollbatItemRef.current.setAttribute("style", `transform:translateY(${targetTranslateY / dpr}px);`)
		}

		execScrollCallback()
	}, [direction, execScrollCallback])

	const recordStartPosition = useCallback(
		(screenX: number, screenY: number) => {
			if (direction === "horizontal") {
				const maxOffset = getScrollMaxOffsetLeft() ?? 0

				const currentOffset = record.current.startOffsetLeft + record.current.offsetLeft

				if (currentOffset < 0) {
					record.current.startOffsetLeft = 0
				} else if (currentOffset > maxOffset) {
					record.current.startOffsetLeft = maxOffset
				} else {
					record.current.startOffsetLeft = record.current.startOffsetLeft + record.current.offsetLeft
				}
			} else {
				const maxOffset = getScrollMaxOffsetTop() ?? 0
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

	const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
		record.current.isTouchStart = true
		recordStartPosition(e.targetTouches[0].screenX, e.targetTouches[0].screenY)
	}

	const handleMouseUp = () => {
		if (record.current.isMouseDown) record.current.isMouseDown = false
	}

	const handleTouchEnd = () => {
		if (record.current.isTouchStart) record.current.isTouchStart = false
	}

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

	useEffect(() => {
		window.addEventListener("mouseup", handleMouseUp)
		window.addEventListener("touchend", handleTouchEnd)
		window.addEventListener("mousemove", handleMouseMove)
		window.addEventListener("touchmove", handleTouchMove)

		window.addEventListener("resize", calcOffset)
		return () => {
			window.removeEventListener("mouseup", handleMouseUp)
			window.removeEventListener("touchend", handleTouchEnd)
			window.removeEventListener("mousemove", handleMouseMove)
			window.removeEventListener("touchmove", handleTouchMove)
			window.removeEventListener("resize", calcOffset)
		}
	}, [calcOffset, handleMouseDown, handleMouseMove, handleTouchMove])

	return (
		<TableMenuScrollbarContainer dirction={direction} ref={scrollbarContainerRef}>
			<TableMenuScrollbarItem dirction={direction} ref={scrollbatItemRef} onTouchStart={(e) => handleTouchStart(e)} onMouseDown={(e) => handleMouseDown(e)} />
		</TableMenuScrollbarContainer>
	)
}

export default TableMenuScrollbar
