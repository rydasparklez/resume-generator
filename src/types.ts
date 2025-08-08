import React, { JSX } from "react";

export interface ButtonInterface {
  text: string;
  filled?: boolean;
type:string;
href: string;
icon?: JSX.Element;
 download?: boolean;
  target?: string;}

export interface cardInterface {
  title: string;
  description: React.ReactNode;
   description2: string;
  // downloadLink: string;
  // btn: ButtonInterface;
}
