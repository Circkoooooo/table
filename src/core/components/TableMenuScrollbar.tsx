import React, { useEffect, useRef } from "react"
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
	offsetX: number //右 -> 正
	offsetY: number //下 -> 正
	currentOffsetLeft: number
	currentOffsetTop: number
	getScrollMaxOffsetLeft: number
	getScrollMaxOffsetTop: number
}

interface TableMenuScrollbarProps {
	direction: "vertical" | "horizontal"
}

const TableMenuScrollbar: React.FC<TableMenuScrollbarProps> = ({ direction }) => {
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
		offsetX: 0,
		offsetY: 0,
		currentOffsetLeft: 0,
		currentOffsetTop: 0,
		getScrollMaxOffsetLeft: 0,
		getScrollMaxOffsetTop: 0,
	})

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
	const calcOffset = () => {
		const dpr = window.devicePixelRatio
		const { startScreenPosition, endScreenPosition } = record.current

		record.current.offsetX = endScreenPosition.x - startScreenPosition.x
		record.current.offsetY = endScreenPosition.y - startScreenPosition.y

		if (!scrollbatItemRef.current || !scrollbarContainerRef.current) return null

		if (direction === "horizontal") {
			const translateX = record.current.currentOffsetLeft + record.current.offsetX

			const maxOffset = getScrollMaxOffsetLeft() ?? 0
			const targetTranslateX = translateX < 0 ? 0 : translateX > maxOffset ? maxOffset : translateX

			scrollbatItemRef.current.setAttribute("style", `transform:translateX(${targetTranslateX / dpr}px);`)
		} else {
			const translateY = record.current.currentOffsetTop + record.current.offsetY

			const maxOffset = getScrollMaxOffsetTop() ?? 0
			const targetTranslateY = translateY < 0 ? 0 : translateY > maxOffset ? maxOffset : translateY

			scrollbatItemRef.current.setAttribute("style", `transform:translateY(${targetTranslateY / dpr}px);`)
		}
	}

	const recordStartPosition = (screenX: number, screenY: number) => {
		if (direction === "horizontal") {
			const maxOffset = getScrollMaxOffsetLeft() ?? 0
			const currentOffset = record.current.currentOffsetLeft + record.current.offsetX
			if (currentOffset < 0) {
				record.current.currentOffsetLeft = 0
			} else if (currentOffset > maxOffset) {
				record.current.currentOffsetLeft = maxOffset
			} else {
				record.current.currentOffsetLeft = record.current.currentOffsetLeft + record.current.offsetX
			}
		} else {
			const maxOffset = getScrollMaxOffsetTop() ?? 0
			const currentOffset = record.current.currentOffsetTop + record.current.offsetY
			if (currentOffset < 0) {
				record.current.currentOffsetTop = 0
			} else if (currentOffset > maxOffset) {
				record.current.currentOffsetTop = maxOffset
			} else {
				record.current.currentOffsetTop = record.current.currentOffsetTop + record.current.offsetY
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
	}

	const recordEndPosition = (screenX: number, screenY: number) => {
		record.current.endScreenPosition = {
			x: screenX,
			y: screenY,
		}
	}

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		record.current.isMouseDown = true
		recordStartPosition(e.screenX, e.screenY)
	}

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

	const handleTouchMove = (e: TouchEvent) => {
		if (!record.current.isTouchStart) return
		const targetTouch = e.targetTouches[0]
		recordEndPosition(targetTouch.screenX, targetTouch.screenY)
		calcOffset()
	}

	const handleMouseMove = (e: MouseEvent) => {
		if (!record.current.isMouseDown) return
		recordEndPosition(e.screenX, e.screenY)
		calcOffset()
	}

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
