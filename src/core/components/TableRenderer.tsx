import React from "react"
import calcBorderProperty from "../calcBorderProperty"
import { CellData } from "../cellDataHandler"
import { CellStyled } from "../styled/Table-styled"
import { TableMouseItemCallback } from "../types/types"

interface TableRendererProps {
	cellData: CellData
	mousedownItemCallback?: (params: TableMouseItemCallback.TableMousedownItemCallbackParams) => void
	mousemoveItemCallback?: (params: TableMouseItemCallback.TableMousemoveItemCallbackParams) => void
	mouseupItemCallback?: (params: TableMouseItemCallback.TableMousemoveItemCallbackParams) => void
}

const TableRenderer: React.FC<TableRendererProps> = ({ cellData, mousedownItemCallback, mousemoveItemCallback, mouseupItemCallback }) => {
	const borderProperty = calcBorderProperty(cellData, cellData.length, cellData[0] && cellData[0].length)

	const mousedownItem = (params: TableMouseItemCallback.TableMousedownItemCallbackParams) => {
		mousedownItemCallback && mousedownItemCallback(params)
	}

	const mousemoveItem = (params: TableMouseItemCallback.TableMousemoveItemCallbackParams) => {
		mousemoveItemCallback && mousemoveItemCallback(params)
	}

	const mouseupItem = (params: TableMouseItemCallback.TableMousemoveItemCallbackParams) => {
		mouseupItemCallback && mouseupItemCallback(params)
	}

	return (
		<>
			{cellData &&
				cellData.map((item, rowIndex) => (
					<div key={`${rowIndex}`}>
						{item.map((item, columnIndex) => (
							<CellStyled
								{...borderProperty[rowIndex][columnIndex]}
								key={`${rowIndex}-${columnIndex}`}
								onMouseDown={() =>
									mousedownItem({
										rowIndex,
										columnIndex,
									})
								}
								onMouseMove={() => {
									mousemoveItem({
										rowIndex,
										columnIndex,
									})
								}}
								onMouseUp={() => {
									mouseupItem({
										rowIndex,
										columnIndex,
									})
								}}
							>
								{item}
							</CellStyled>
						))}
					</div>
				))}
		</>
	)
}

export default TableRenderer
