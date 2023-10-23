import React from "react"
import { LineFlexibleContainer, LineFlexibleItem, LineFlexiblePanel } from "../../styled/highlight/lineFlexible-styled"
import { IndexType } from "../../types/table"

interface LineFlexibleProps {
	index: IndexType | null
	cellLogicWidth: number
	cellLogicHeight: number
	ofsLeft: number
	ofsTop: number
	borderWidth: number
}

const LineFlexible: React.FC<LineFlexibleProps> = ({ index, cellLogicHeight, cellLogicWidth, ofsLeft, ofsTop, borderWidth }) => {
	return (
		<LineFlexiblePanel data-testid="lineflexible">
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
					<LineFlexibleItem />
				</LineFlexibleContainer>
			)}
		</LineFlexiblePanel>
	)
}

export { LineFlexible }
