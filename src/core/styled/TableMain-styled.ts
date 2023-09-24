import styled from "styled-components"

export const TableMainContainer = styled.div`
	height: 100%;
	width: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
`

export const TableRowContainer = styled.div`
	flex: 1;
	position: relative;
	display: flex;
	overflow: hidden;
`

export const TableCanvasContainer = styled.div`
	flex: 1;
	overflow: hidden;
`

export const TableVerticalScrollbarContainer = styled.div`
	width: 18px;
`

export const TableMenu = styled.div`
	width: 100%;
	height: 50px;
	background-color: #fff;
	position: relative;
`

type Dircion = {
	dirction: "vertical" | "horizontal"
}

export const TableMenuScrollbarContainer = styled.div<Dircion>`
	position: absolute;
	width: ${(props) => (props.dirction === "horizontal" ? "100%" : "18px")};
	height: ${(props) => (props.dirction === "horizontal" ? "18px" : "100%")};
	background-color: #f0f0f0;
	bottom: 0;
	padding: 4px;
	border-radius: 2px;
	cursor: pointer;
	user-select: none;
`

export const TableMenuScrollbarItem = styled.div<Dircion>`
	width: ${(props) => (props.dirction === "horizontal" ? "40px" : "100%")};
	height: ${(props) => (props.dirction === "horizontal" ? "100%" : "40px")};

	border-radius: 4px;
	background-color: rgba(0, 0, 0, 0.5);

	&:hover {
		opacity: 0.8;
	}
`
