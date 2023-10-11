import styled from "styled-components"
import { MENU_ITEM_BORDER_RADIUS, MENU_ITEM_COLOR } from "../../../configs/header-menu"

export const ItemFontSizeInput = styled.input`
	outline: none;
	min-width: 20px;
	max-width: 80px;
	border: 2px solid ${MENU_ITEM_COLOR};
	border-radius: ${MENU_ITEM_BORDER_RADIUS};
	height: 28px;
	overflow: hidden;
	text-align: center;
`
