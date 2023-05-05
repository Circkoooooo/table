import React, { ReactNode } from "react";
import { Header, Main, Body, Aside, Content } from "./Background-styled";

interface BackgroundProps {
  HeaderSlot?: ReactNode;
  MainSlot?: ReactNode;
  AsideSlot?: ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ HeaderSlot, MainSlot, AsideSlot }) => {
  return (
    <>
      <Body>
        <Header>{HeaderSlot}</Header>
        <Main>
          {AsideSlot && <Aside>{AsideSlot}</Aside>}
          <Content>{MainSlot}</Content>
        </Main>
      </Body>
    </>
  );
};

export default Background;
