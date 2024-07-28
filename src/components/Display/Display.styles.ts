import styled from 'styled-components';

type Props = {
  gameOver?: boolean;
};

export const StyledDisplay = styled.div<Props>`
  box-sizing: border-box;
  display: flex;
  align-items: space-between;
  margin: 0 0 20px 0;
  padding: 20px;
  border: 2px solid #fff;
  min-height: 20px;
  width: 120px;
  border-radius: 10px;
  color: ${props => (props.gameOver ? 'red' : '#fff')};
  background: #000;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.2rem;
`;
