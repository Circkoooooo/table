import React, { ReactNode } from "react"
import { Header, Main, Body, Aside, Content } from "./Background-styled"

interface BackgroundProps {
	HeaderSlot?: ReactNode
	MainSlot?: ReactNode
	AsideSlot?: ReactNode
	onContextMenu: (mouseEvent: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const Background: React.FC<BackgroundProps> = ({ HeaderSlot, MainSlot, AsideSlot, onContextMenu }) => {
	return (
		<>
			<Body role="body" onContextMenu={(event) => onContextMenu(event)}>
				<Header role="header">{HeaderSlot}</Header>
				<Main role="main">
					{AsideSlot && <Aside>{AsideSlot}</Aside>}
					<Content role="content">{MainSlot}</Content>
				</Main>
			</Body>
		</>
	)
}

export default Background
