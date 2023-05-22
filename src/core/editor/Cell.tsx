import React, { ReactNode } from "react"
import { CellStyled } from "./Table-styled"

interface CellProps {
	children?: ReactNode
	attrs?: Record<string, any> & React.HTMLAttributes<HTMLElement>
}

const Cell: React.FC<CellProps> = ({ children, attrs }) => {
	return <CellStyled {...attrs}>{children}</CellStyled>
}

export default Cell
