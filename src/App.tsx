import * as React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
//@ts-ignore
import { Button, Space, message, Modal } from "antd";
import "antd/dist/antd.css";
//@ts-ignore
import Hammer from "hammerjs";
import "./styles.css";
import { drawGrid, drawRect } from "./draw";
import { useWindowSize, useKeyDowm } from "./tools";

// useState导致重新渲染， useRef没有。
// 它们之间的共同点是， useState和useRef都可以在重新渲染后记住它们的数据。
// 因此，如果您的变量是决定视图层渲染的内容，请使用useState 。 否则使用useRef

export default function App() {
  const snakeRef = useRef<HTMLCanvasElement>(null);
  const snake = useRef([41, 40]); //snake队列表示蛇身，初始节点存在但不显示
  const direction = useRef(1); //1表示向右，-1表示向左，20表示向下，-20表示向上
  const food = useRef(43); //食物的位置
  const n = useRef(1); //与下次移动的位置有关
  const [status, setStatus] = useState(false);
  // 触摸对象
  const [hammer, setHammer]: [
    HammerManager | undefined,
    React.Dispatch<any>
  ] = useState();

  const [width, height] = useWindowSize();
  const [nextDirection] = useKeyDowm([-1, -20, 1, 20]);

  useEffect(() => {
    let timer = setInterval(refresh, 150);
    return () => clearInterval(timer);
  });

  //初始化hammer
  useEffect(() => {
    const hammer: HammerManager = new Hammer(snakeRef.current!);
    hammer.get("swipe").set({
      direction: Hammer.DIRECTION_ALL,
      time: 300
    });
    setHammer(hammer);
    return () => hammer.destroy();
  }, []);

  const onSwipe = useCallback(ev => {
    // @ts-ignore
    const swipeKey = {
      swipeleft: -1,
      swiperight: 1,
      swipeup: -20,
      swipedown: 20
    }[ev.type];
    changeDirection(swipeKey);
  }, []);

  //绑定swipe事件
  useEffect(() => {
    if (!hammer) return;
    hammer.on("swipeleft swiperight swipeup swipedown", ev => onSwipe(ev));
  }, [hammer, onSwipe]);

  const changeDirection = (nextDirection: number) => {
    const o1 = snake.current[1] - snake.current[0];
    n.current = nextDirection || direction.current;
    direction.current = o1 === n.current ? direction.current : n.current;
  };

  useEffect(() => {
    changeDirection(nextDirection);
  }, [nextDirection]);

  const handleGame = (status: boolean, tips: string) => {
    message.info(tips);
    init();
    setStatus(status);
  };

  const init = useCallback(() => {
    snake.current = [41, 40];
    direction.current = 1;
    food.current = 43;
    n.current = 1;
    drawGrid(width, height, 20, "lightgray", 0.5, snakeRef.current!);
  }, [width, height]);

  useEffect(() => {
    init();
  }, [init]);

  const refresh = () => {
    if (status) {
      n.current = snake.current[0] + direction.current;
      snake.current.unshift(n.current);

      //此时的n为下次蛇头出现的位置，n进入队列
      if (
        snake.current.indexOf(n.current, 1) > 0 ||
        n.current < 0 ||
        n.current > Math.floor(height / (width / 20)) * 20 ||
        (direction.current === 1 && n.current % 20 === 0) ||
        (direction.current === -1 && n.current % 20 === 19)
      ) {
        //if语句判断贪吃蛇是否撞到自己或者墙壁，碰到时返回，结束程序
        handleGame(false, "GAME OVER!");
        return;
      }

      drawRect(n.current, "lime", 20, 1.5, width, snakeRef.current!); //画出蛇头下次出现的位置

      if (n.current === food.current) {
        //如果吃到食物时，产生一个蛇身以外的随机的点，不会去掉蛇尾
        food.current = ~~(Math.random() * 400);
        while (snake.current.indexOf(food.current) > 0) {
          break;
        }
        drawRect(food.current, "yellow", 20, 1, width, snakeRef.current!);
      } else {
        //没有吃到食物时正常移动，蛇尾出队列
        const _snake = snake.current.pop();
        drawRect(_snake!, "white", 20, 1, width, snakeRef.current!);
      }
    }
  };
  return (
    <>
      <canvas ref={snakeRef}>对不起，您的浏览器不支持canvas</canvas>

      <Modal
        visible={!status}
        width={width * 0.8}
        closable={false}
        centered
        footer={null}
        bodyStyle={{ textAlign: "center" }}
      >
        <Space direction="vertical">
          <Button
            type="primary"
            onClick={() => handleGame(true, "GAME START!")}
          >
            开始游戏
          </Button>
          <Button
            type="primary"
            onClick={() => handleGame(false, "GAME OVER!")}
          >
            结束游戏
          </Button>
        </Space>
      </Modal>
    </>
  );
}
