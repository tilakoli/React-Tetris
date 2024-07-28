import styled from 'styled-components';

export const StyledTetrisWrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  outline: none;
`;

export const StyledTetris = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 40px;
  margin: 0 auto;
  gap:50px;

  .display {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 380px;
  }
`;
