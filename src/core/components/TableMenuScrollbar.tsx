import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { TableMenuScrollbarContainer, TableMenuScrollbarItem } from "../styled/TableMain-styled"
import { useAppSelector } from "../redux/hooks"

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
	canvasContainerWidth: number
	canvasContainerHeight: number
	canvasContainerMaxWidth: number // 容器宽度 + 容器外的宽度。理论上大于canvasContainerWidth
	canvasContainerMaxHeight: number
	currentOffsetLeft: number
	currentOffsetTop: number
	offsetLeft: number //右 -> 正
	offsetTop: number //下 -> 正
	startOffsetLeft: number
	startOffsetTop: number
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
	const canvasStore = useAppSelector((state) => state.canvas)

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
		canvasContainerWidth: 0,
		canvasContainerHeight: 0,
		canvasContainerMaxWidth: 0,
		canvasContainerMaxHeight: 0,
		currentOffsetLeft: 0,
		currentOffsetTop: 0,
		offsetLeft: 0, //记录过程中产生的偏移量
		offsetTop: 0,
		startOffsetLeft: 0, //开始记录时滑块的便宜
		startOffsetTop: 0,
	})

	const scrollBarLength = useMemo(() => {
		if (!scrollbarContainerRef.current) return 0
		const containerMaxWidth = canvasStore.containerMaxWidth
		const containerMaxHeight = canvasStore.containerMaxHeight
		const containerWidth = canvasStore.containerWidth
		const containerHeight = canvasStore.containerHeight

		let scroll = 0

		const boxOuterWidth =
			Number(window.getComputedStyle(scrollbarContainerRef.current).borderWidth.replace("px", "")) + Number(window.getComputedStyle(scrollbarContainerRef.current).padding.replace("px", ""))

		if (direction === "horizontal") {
			scroll = scrollbarContainerRef.current.clientWidth * ((containerMaxWidth - containerWidth) / containerMaxWidth)
			return scrollbarContainerRef.current.clientWidth - boxOuterWidth * 2 - scroll
		} else {
			scroll = scrollbarContainerRef.current.clientHeight * ((containerMaxHeight - containerHeight) / containerMaxHeight)
			return scrollbarContainerRef.current.clientHeight - boxOuterWidth * 2 - scroll
		}
	}, [canvasStore, direction])

	const execScrollCallback = useCallback(() => {
		const { offsetLeft, offsetTop, currentOffsetLeft, currentOffsetTop, canvasContainerMaxWidth, canvasContainerMaxHeight, canvasContainerWidth, canvasContainerHeight } = record.current

		const maxOffsetLeft = canvasContainerMaxWidth - canvasContainerWidth
		const maxOffsetTop = canvasContainerMaxHeight - canvasContainerHeight
		const offsetPercent = direction === "horizontal" ? currentOffsetLeft / maxOffsetLeft : currentOffsetTop / maxOffsetTop

		scrollCallback &&
			scrollCallback({
				currentOffsetLeft,
				currentOffsetTop,
				maxOffsetLeft,
				maxOffsetTop,
				offsetPercent,
				nativeRecord: {
					direction,
					offsetTop,
					offsetLeft,
				},
			})
	}, [direction, scrollCallback])

	// 计算并设置最新的滑块位置
	const calcOffset = useCallback(() => {
		const dpr = window.devicePixelRatio
		const { startScreenPosition, endScreenPosition, canvasContainerWidth, canvasContainerHeight, canvasContainerMaxWidth, canvasContainerMaxHeight } = record.current

		record.current.offsetLeft = endScreenPosition.x - startScreenPosition.x
		record.current.offsetTop = endScreenPosition.y - startScreenPosition.y

		if (!scrollbarContainerRef.current || !scrollbatItemRef.current) return null

		if (direction === "horizontal") {
			const maxScrollBarOffset = scrollbarContainerRef.current.clientWidth * ((canvasContainerMaxWidth - canvasContainerWidth) / canvasContainerMaxWidth)
			const currentOffsetLeft = record.current.startOffsetLeft + record.current.offsetLeft
			const targetTranslateX = currentOffsetLeft < 0 ? 0 : currentOffsetLeft > maxScrollBarOffset ? maxScrollBarOffset : currentOffsetLeft

			record.current.currentOffsetLeft = targetTranslateX
			scrollbatItemRef.current.setAttribute("style", `transform:translateX(${targetTranslateX / dpr}px);`)
		} else {
			const maxScrollBarOffset = scrollbarContainerRef.current.clientHeight * ((canvasContainerMaxHeight - canvasContainerHeight) / canvasContainerMaxHeight)
			const currentOffsetTop = record.current.startOffsetTop + record.current.offsetTop
			const targetTranslateY = currentOffsetTop < 0 ? 0 : currentOffsetTop > maxScrollBarOffset ? maxScrollBarOffset : currentOffsetTop

			record.current.currentOffsetTop = targetTranslateY
			scrollbatItemRef.current.setAttribute("style", `transform:translateY(${targetTranslateY / dpr}px);`)
		}

		execScrollCallback()
	}, [direction, execScrollCallback])

	useEffect(() => {
		record.current.canvasContainerWidth = canvasStore.containerWidth
		record.current.canvasContainerHeight = canvasStore.containerHeight
		record.current.canvasContainerMaxWidth = canvasStore.containerMaxWidth
		record.current.canvasContainerMaxHeight = canvasStore.containerMaxHeight
		calcOffset()
	}, [canvasStore, calcOffset])

	const recordStartPosition = useCallback(
		(screenX: number, screenY: number) => {
			const { canvasContainerMaxWidth, canvasContainerMaxHeight, canvasContainerWidth, canvasContainerHeight } = record.current
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
			<TableMenuScrollbarItem $scrollBarLength={scrollBarLength} dirction={direction} ref={scrollbatItemRef} onTouchStart={(e) => handleTouchStart(e)} onMouseDown={(e) => handleMouseDown(e)} />
		</TableMenuScrollbarContainer>
	)
}

export default TableMenuScrollbar
