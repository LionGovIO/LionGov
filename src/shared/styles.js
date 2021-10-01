import styled from "styled-components";


export const BigButton = styled.button`
  background-color: var(--million);
  color: var(--background);
  outline: none;
  border: 1px solid var(--million);
  border-radius: 4px;
  font-size: 18px;
  font-weight: bold;
  padding: 0px 20px;
  transition: .3s;
  height: 50px;
  white-space: nowrap;

  &:hover {
    background-color: var(--background);
    color: var(--million);
  }
`

export const Input = styled.input`
  border: none;
  background-color: var(--light-gray);
  color: black;
  padding: 5px 10px;
  border-radius: 4px;
  display: block;
  transition: .3s;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px var(--background);
  }
`

export const Textarea = styled.textarea`
  border: none;
  background-color: var(--light-gray);
  color: black;
  padding: 5px 10px;
  border-radius: 4px;
  display: block;
  transition: .3s box-shadow;
  outline: none;
  max-width: 90%;
  min-width: 80%;
  min-height: 100px;
  resize: both;

  &:focus {
    box-shadow: 0 0 0 2px var(--background);
  }
`
