import { TableColumnHeader, TableDataFrame, TableDataRow, TableFrame, TableRowAndDataFrame, TableRowAndDataRowFlex, TableRowHeader } from "./Table-styled"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { getLabel, getRowLabel } from "./Ruler"
import { arrToObject } from "../../tools/arrToObject"
import Cell from "./Cell"
import HintBorder, { HintBorderRef } from "./HintBorder"

interface ColumnRulerProps {
	columnCount?: number
}

interface CurrentSelectCellInfo {
	selectRowIndex: number
	selectColumnIndex: number
	pointerRowIndex?: number
	pointerColumnIndex?: number
	oldSelectSell?: HTMLDivElement
	newTargetTable?: AbstractTableElementType[][]
}

interface MouseEventRecord {
	isMouseDown: boolean
}

type AbstractTableElementType = string | number | undefined | null

const [EDIT_ATTRIBUTE, EDIT_ATTRIBUTE_VALUE] = ["contentEditable", "true"]

const tables: AbstractTableElementType[][] = [[]]

const Table: React.FC<ColumnRulerProps> = () => {
	const [tableAddition, setTableAddition] = useState<{
		rowLabels: string[]
		columnLabels: string[]
	}>({ rowLabels: [], columnLabels: [] })

	const [targetTables, setTargetTables] = useState<AbstractTableElementType[][]>()
	const currentSelectCell = useRef<CurrentSelectCellInfo | null>(null) //click后记录
	const hintBorder = useRef<HintBorderRef>(null)
	const mouseEventRecord = useRef<MouseEventRecord>({
		isMouseDown: false,
	})

	/**
	 * 获取当前数据状态下的的label
	 */
	const getCurrentTableAddition = () => {
		return {
			rowLabels: getRowLabel(26 < tables.length ? tables.length : 26, 0),
			columnLabels: tables[0] !== undefined ? getLabel(26 < tables[0].length ? tables[0].length : 26, "A", "Z") : [],
		}
	}

	/**
	 * 根据table的行数和列数生成填充0的表格，然后把table中的内容复制过来
	 */
	const buildMaskTables = useCallback(() => {
		return Array.from({ length: tableAddition.rowLabels.length }, (v, row) => {
			return Array.from({ length: tableAddition.columnLabels.length }, (v, column) => {
				if (row < tables.length && column < tables[row].length) {
					return tables[row][column]
				}
				return undefined
			})
		})
	}, [tableAddition.rowLabels.length, tableAddition.columnLabels.length])

	const handleMouseEventRecord = {
		setMouseDown: () => {
			mouseEventRecord.current.isMouseDown = true
		},
		cancelMouseDown: () => {
			mouseEventRecord.current.isMouseDown = false
		},
	}

	const handleCellEventFunction = function () {
		return {
			handleCellMouseDown: ({ event, row, column, isContinue = false }: { event: React.MouseEvent<HTMLDivElement>; row: number; column: number; isContinue?: boolean }) => {
				event.preventDefault()
				handleMouseEventRecord.setMouseDown()

				if (!targetTables || targetTables.length <= row || targetTables[row].length <= column) {
					throw new Error("Error, it seems that the table has not been rendered.")
				}

				if (!isContinue || currentSelectCell.current?.selectRowIndex === undefined || !currentSelectCell.current?.selectColumnIndex === undefined) {
					//focus target

					const target = event.currentTarget

					if (currentSelectCell.current?.selectRowIndex === row && currentSelectCell.current.selectColumnIndex === column) {
						target.setAttribute(EDIT_ATTRIBUTE, EDIT_ATTRIBUTE_VALUE)
						target.focus()
					} else {
						currentSelectCell.current?.oldSelectSell?.blur()
					}
					currentSelectCell.current && (currentSelectCell.current.oldSelectSell = target)

					//record current selected target cell without updating.
					currentSelectCell.current = {
						...currentSelectCell.current,
						selectRowIndex: row,
						selectColumnIndex: column,
						pointerRowIndex: row,
						pointerColumnIndex: column,
					}
					//update hintBorder without updating of current component.
					hintBorder.current?.changeIndex(row, column)
				} else {
					//record current selected target cell without updating.
					currentSelectCell.current = {
						...currentSelectCell.current,
						pointerRowIndex: row,
						pointerColumnIndex: column,
					}
					hintBorder.current?.changePointerIndex(row, column)
				}
			},
			handleCellBlur: (event: React.FocusEvent<HTMLDivElement>, rowIndex: number, columnIndex: number) => {
				const target = currentSelectCell.current?.oldSelectSell

				if (target && target.hasAttribute(EDIT_ATTRIBUTE)) {
					const target = event.currentTarget
					target.removeAttribute(EDIT_ATTRIBUTE)
				}

				currentSelectCell.current?.newTargetTable && updateTargetTable(currentSelectCell.current.newTargetTable)
			},
			handleCellInput: (target: HTMLElement) => {
				if (!currentSelectCell.current || !targetTables) return

				const { selectRowIndex, selectColumnIndex } = currentSelectCell.current
				const tempTargetTables = [...targetTables] //对所有数组重新改变引用，引起useState的更新

				tempTargetTables[selectRowIndex][selectColumnIndex] = target.innerText
				currentSelectCell.current.newTargetTable = tempTargetTables //记录最新修改的值
			},
			handleCellMouseEnter: (row: number, column: number) => {
				const { isMouseDown } = mouseEventRecord.current
				if (!isMouseDown || currentSelectCell.current === null) return

				const { pointerRowIndex, pointerColumnIndex } = currentSelectCell.current
				if (row === pointerRowIndex && pointerColumnIndex === column) return

				currentSelectCell.current.pointerRowIndex = row
				currentSelectCell.current.pointerColumnIndex = column

				hintBorder.current?.changePointerIndex(row, column)
				//trigger blur if select multiple cells.
				currentSelectCell.current.oldSelectSell?.blur()
			},
		}
	}

	/**
	 * 对表格内容进行更新
	 * 1. 更新state
	 * 2. 清除ref为null
	 */
	const updateTargetTable = (newTargetTable: AbstractTableElementType[][]) => {
		setTargetTables(newTargetTable)
		currentSelectCell.current = null
		console.log("update", newTargetTable)
	}

	useEffect(() => {
		setTargetTables(buildMaskTables())

		if (tableAddition.rowLabels.length !== tables.length || tableAddition.columnLabels.length !== tables[0].length) {
			setTableAddition(getCurrentTableAddition())
		}

		window.addEventListener("contextmenu", (event) => {
			event.preventDefault()
		})

		return () => {
			window.removeEventListener("contextmenu", (event) => {
				event.preventDefault()
			})
		}
	}, [buildMaskTables, tableAddition.columnLabels.length, tableAddition.rowLabels.length])

	//列表头
	const RenderColumnHeader = useCallback(() => {
		return (
			<>
				<Cell attrs={{ ...arrToObject(["top", "left", "lineRight"]) }}></Cell>
				{tableAddition.columnLabels.map((value, index) => {
					const props = ["left", "rop", "top", "dark", "lineRight"]

					if (index === tableAddition.columnLabels.length - 1) {
						props.push("right")
					}

					return (
						<Cell attrs={{ ...arrToObject(props) }} key={value}>
							{value}
						</Cell>
					)
				})}
			</>
		)
	}, [tableAddition.columnLabels])

	//行表头和行列功能格
	const RenderRowHeader = useCallback(() => {
		return (
			<>
				{tableAddition.rowLabels.map((value, index) => {
					const props = []
					if (index !== tableAddition.rowLabels.length - 1) {
						props.push("left", "dark")
					} else {
						props.push("left", "bottom", "dark")
					}

					props.push("top")

					return (
						<Cell attrs={{ ...arrToObject(props) }} key={value}>
							{value}
						</Cell>
					)
				})}
			</>
		)
	}, [tableAddition.rowLabels])

	const RenderTableData = () => {
		if (!targetTables) return null

		const { handleCellMouseDown, handleCellMouseEnter, handleCellInput, handleCellBlur } = handleCellEventFunction()

		return (
			<>
				{/* {targetTables && */}
				{targetTables.map((item, row) => {
					return (
						<TableDataRow key={tableAddition.rowLabels[row]}>
							{item.map((value, column) => {
								const key = `${tableAddition.columnLabels[column]}${tableAddition.rowLabels[row]}`
								const props = []

								//bind events to Cell
								const eventProps = {
									onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => {
										const { button, buttons, shiftKey } = event.nativeEvent
										let isShift = false

										//return if not is left mouse.
										if (button !== 0 && buttons !== 1) {
											return
										}

										if (shiftKey) {
											isShift = true
										}

										handleCellMouseDown({
											event,
											row,
											column,
											isContinue: isShift,
										})
									},

									onInput: (event: React.FormEvent<HTMLDivElement>) => handleCellInput(event.currentTarget),
									onBlur: (event: React.FocusEvent<HTMLDivElement>) => handleCellBlur(event, row, column),
									onMouseEnter: () => handleCellMouseEnter(row, column),
								}

								if (row !== tableAddition.rowLabels.length - 1) {
									props.push("left")
								} else {
									props.push("left", "bottom")
								}

								if (column === item.length - 1) {
									props.push("right")
								}

								props.push("top")

								return (
									<Cell
										attrs={{
											...arrToObject(props),
											...eventProps,
										}}
										key={key}
									>
										{value}
									</Cell>
								)
							})}
						</TableDataRow>
					)
				})}
			</>
		)
	}

	return (
		<>
			<TableFrame onMouseUp={handleMouseEventRecord.cancelMouseDown}>
				<TableColumnHeader>
					<RenderColumnHeader />
				</TableColumnHeader>

				<TableRowAndDataFrame>
					<TableRowAndDataRowFlex>
						<TableRowHeader>
							<RenderRowHeader />
						</TableRowHeader>
						<TableDataFrame>
							<RenderTableData />
							<HintBorder
								ref={hintBorder}
								{...{
									maxRowIndex: tableAddition.rowLabels.length,
									maxColumnIndex: tableAddition.columnLabels.length,
								}}
							/>
						</TableDataFrame>
					</TableRowAndDataRowFlex>
				</TableRowAndDataFrame>
			</TableFrame>
		</>
	)
}

export default Table
