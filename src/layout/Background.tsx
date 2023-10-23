import React from "react"
import { Header, Main, Body, Content } from "./Background-styled"
import { HeaderItemContainer } from "../core/styled/header/Header-styled"
import { ItemFontsize } from "../core/components/HeaderComponents/ItemFontSize"
import { ConfigProvider } from "antd"
import { ANTD_THEME } from "../configs/antd-theme"
import { Provider } from "react-redux"
import store from "../core/redux/store"
import { TableMain } from "../core/components/TableMain"
import { HeaderTitle } from "../core/components/HeaderComponents/HeaderTitle"

interface BackgroundProps {
	onContextMenu: (mouseEvent: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const Background: React.FC<BackgroundProps> = ({ onContextMenu }) => {
	return (
		<ConfigProvider theme={ANTD_THEME}>
			<Provider store={store}>
				<Body data-testid="body" onContextMenu={(event) => onContextMenu(event)}>
					<Header>
						<HeaderTitle />
						<HeaderItemContainer>
							<ItemFontsize />
						</HeaderItemContainer>
					</Header>
					<Main>
						<Content>
							<TableMain />
						</Content>
					</Main>
				</Body>
			</Provider>
		</ConfigProvider>
	)
}

export default Background
