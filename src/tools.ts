import { useState, useEffect } from "react";

export const useWindowSize = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const handleWindowSize = () => {
    const { availWidth, availHeight } = window.screen;
    setWidth(availWidth);
    setHeight(availHeight);
  };

  useEffect(() => {
    handleWindowSize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleWindowSize, false);
    return () => window.removeEventListener("resize", handleWindowSize, false);
  }, []);

  return [width, height];
};

export const useKeyDowm = (props: number[]) => {
  const [keyCode, setKeyCode] = useState(0);
  const changeDirection = (evt: KeyboardEvent) => {
    setKeyCode(evt.keyCode - 37);
  };

  useEffect(() => {
    document.addEventListener("keydown", changeDirection, false);
    return () =>
      document.removeEventListener("keydown", changeDirection, false);
  });

  return [props[keyCode]];
};

export default {
  useWindowSize
};
