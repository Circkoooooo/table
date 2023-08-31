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
			<Body data-testid="body" onContextMenu={(event) => onContextMenu(event)}>
				<Header>{HeaderSlot}</Header>
				<Main>
					{AsideSlot && <Aside>{AsideSlot}</Aside>}
					<Content>{MainSlot}</Content>
				</Main>
			</Body>
		</>
	)
}

export default Background
