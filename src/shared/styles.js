import styled from "styled-components";


export const BigButton = styled.button`
  background-color: var(--primary);
  color: var(--background);
  outline: none;
  border: 1px solid var(--primary);
  border-radius: 4px;
  font-size: 18px;
  font-weight: bold;
  padding: 0px 20px;
  transition: .3s;
  height: 50px;
  white-space: nowrap;

  &:hover {
    background-color: var(--background);
    color: var(--primary);
  }
`
