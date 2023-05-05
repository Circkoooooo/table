import styled from "styled-components";

const RowFrame = styled.input`
  padding: 2px;
  width: 100px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  outline: none;
`;

const Row = () => {
  return <RowFrame defaultValue={123} />;
};

export default Row;
