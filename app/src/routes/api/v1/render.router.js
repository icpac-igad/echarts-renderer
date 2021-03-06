const config = require("config");
const Router = require("koa-router");
const EchartsRenderService = require("services/echartsRenderService");

const router = new Router();

const MAX_DIMENSION_VAL = 1000;

const echartsConfig = config.get("echarts");
class EchartsRenderRouter {
  static async renderEcharts(ctx) {
    let width =
      parseInt(Number(ctx.query.width)) || parseInt(echartsConfig.defaultWidth);
    let height =
      parseInt(Number(ctx.query.height)) ||
      parseInt(echartsConfig.defaultHeight);

    // do validation
    if (isNaN(width)) {
      ctx.throw(`invalid width parameter ${ctx.query.width}`);
    }

    if (isNaN(height)) {
      ctx.throw(`invalid height parameter ${ctx.query.height}`);
    }

    if (width > MAX_DIMENSION_VAL) {
      ctx.throw(`max allowed width is ${MAX_DIMENSION_VAL}`);
    }

    if (height > MAX_DIMENSION_VAL) {
      ctx.throw(`max allowed height is ${MAX_DIMENSION_VAL}`);
    }

    // generate chart image
    const imageBuffer = await EchartsRenderService.renderChart(
      width,
      height,
      ctx.request.body
    );

    ctx.set({
      "content-type": "image/png",
      "Content-Length": imageBuffer.length,
    });

    ctx.body = imageBuffer;
  }
}

router.post("/render", EchartsRenderRouter.renderEcharts);

module.exports = router;
