import * as React from "react";
import { Main, Item } from "@webcarrot/multi-lan-controller/admin/components";
import { Component as ComponentInt } from "./types";
import { List } from "./list";

const Component: ComponentInt = ({ output }) => {
  return (
    <Main>
      <Item>
        <List title={output.title} />
      </Item>
    </Main>
  );
};

export default Component;
