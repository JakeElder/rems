"use client";
import { useEffect } from "react";
import { removeCookie } from "typescript-cookie";

type Props = {};

const RefererClearer = ({}: Props) => {
  useEffect(() => {
    removeCookie("referer");
  });
  return null;
};

export default RefererClearer;
