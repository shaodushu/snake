/**
 * 绘制网格
 * @param width 屏宽
 * @param height 屏高
 * @param seeds 初始种子数
 * @param color 网格颜色
 * @param lineWidth 线宽
 * @param ctx
 */
export const drawGrid = (
  width: number,
  height: number,
  seeds: number,
  color: string | CanvasGradient | CanvasPattern,
  lineWidth: number,
  ctx: HTMLCanvasElement
) => {
  if (!width || !height) return;

  const _width = width;
  console.log(height, width / seeds);
  const _height = height - seeds * lineWidth;

  ctx.width = _width;
  ctx.height = _height;
  const snake2D = ctx.getContext("2d");

  snake2D!.clearRect(0, 0, _width, _height);

  const stepX = _width / seeds;
  const stepY = _width / seeds;

  // 创建垂直格网线路径
  for (let i = lineWidth + stepX; i < _width; i += stepX) {
    snake2D!.moveTo(i, 0);
    snake2D!.lineTo(i, _height);
  }

  // 创建水平格网线路径
  for (let j = lineWidth + stepY; j < _height; j += stepY) {
    snake2D!.moveTo(0, j);
    snake2D!.lineTo(_width, j);
  }
  // 设置绘制颜色
  snake2D!.strokeStyle = color;
  // 设置绘制线段的宽度
  snake2D!.lineWidth = lineWidth;
  // 绘制格网
  snake2D!.stroke();
  // 清除路径
  snake2D!.beginPath();
};

/**
 * 绘制矩形
 * @param seat 座位
 * @param color 矩形颜色
 * @param seeds 初始种子数
 * @param screenWidth
 * @param ctx
 */
export const drawRect = (
  seat: number,
  color: string | CanvasGradient | CanvasPattern,
  seeds: number,
  border: number,
  screenWidth: number,
  ctx: HTMLCanvasElement
) => {
  const snake2D = ctx.getContext("2d");
  //用color填充一个矩形，以前两个参数为x，y坐标，后两个参数为宽和高。
  snake2D!.fillStyle = color;
  // seat % 20列
  snake2D!.fillRect(
    (seat % seeds) * (screenWidth / seeds) + border,
    ~~(seat / seeds) * (screenWidth / seeds) + border,
    screenWidth / seeds - 2 * border,
    screenWidth / seeds - 2 * border
  );
};
