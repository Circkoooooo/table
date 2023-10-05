import { useAppSelector } from "../../redux/hooks"
import { HighlightBorderContainer, HighlightBorderItem } from "../../styled/HighlightBorder-styled"

const HighlightBorder = () => {
	const stateCanvas = useAppSelector((state) => state.canvas)

	return (
		<HighlightBorderContainer>
			<HighlightBorderItem $rowIndex={1} $columnIndex={4} $offsetLeft={stateCanvas.containerOffsetLeft} $offsetTop={stateCanvas.containerOffsetTop} />
		</HighlightBorderContainer>
	)
}

export { HighlightBorder as HighlightBorderNew }
