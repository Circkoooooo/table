import styled from "styled-components"

export const HeaderItemContainer = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
`

export const HeaderItem = styled.div`
	height: 28px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: auto;
	margin-left: 4px;
	margin-right: 4px;

	& > div {
		height: 100%;
		width: 100%;
		padding: 4px;
		width: 28px;

		& > img {
			height: 100%;
			width: 100%;
		}
	}
`
