import React, { useState, useEffect, useCallback } from "react";
import styled, { ThemeProvider } from "styled-components";
import axios from "axios";

const DefaultButton = styled.button`
  border-radius: 3px;
  margin: 0 1em;
  padding: 0.25em 1em;
  &:hover {
    background-color: yellow;
  }
`;

const BlueButton = styled(DefaultButton)`
  color: blue;
`;

const RedButton = styled(DefaultButton)`
  color: red;
`;

const BigButton = styled(DefaultButton)`
  border-radius: 100px;
`;

interface Props {
  primary?: boolean;
  secondary?: boolean;
  children: any;
  onClick?: any;
}

const Button = (props: Props) => {
  return props.primary ? (
    <RedButton onClick={props.onClick}>{props.children}</RedButton>
  ) : props.secondary ? (
    <BlueButton onClick={props.onClick}>{props.children}</BlueButton>
  ) : (
    <DefaultButton onClick={props.onClick}>{props.children}</DefaultButton>
  );
};

function useGetDataOnLoad(url: string, initalValue: any, parseBy?: string) {
  const [data, setData] = useState(initalValue);

  const getData = async () => {
    const { data } = await axios(url);

    let parsedResult = parseBy
      ? () => {
          const { [parseBy]: value } = data;
          return value;
        }
      : data;
    setData(parsedResult);
  };

  useEffect(() => {
    getData();
  }, []);

  return [data, useCallback(() => getData(), [])];
}

function App() {
  const [quote, refreshData] = useGetDataOnLoad(
    "https://api.kanye.rest/",
    null,
    "quote"
  );
  const [dcList] = useGetDataOnLoad(
    "https://gresupplychainrecoveriesapi.dev.target.com/get_dc_list",
    []
  );

  const onButtonClick = () => refreshData();
  return (
    <div>
      {dcList ? (
        <>
          {dcList.map(({ number }: any, i: number) => (
            <div key={i}>
              <Button onClick={onButtonClick}>{number + " " + quote}</Button>
            </div>
          ))}
        </>
      ) : (
        <p>'Loading'</p>
      )}
    </div>
  );
}

export default App;

