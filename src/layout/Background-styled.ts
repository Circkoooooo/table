import styled from "styled-components";
import { blue } from "@ant-design/colors";

const BackgroundConfig = {
  headerHeight: "64px",
};

export const Body = styled.div`
  width: 100%;
  height: 100%;
`;

export const Header = styled.div`
  width: 100%;
  height: ${BackgroundConfig.headerHeight};
  background-color: ${blue.primary};
`;

export const Main = styled.div`
  width: 100%;
  height: calc(100% - ${BackgroundConfig.headerHeight});
`;
