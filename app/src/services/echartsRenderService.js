const EChart = require("../echarts-ssr");

class EchartsRenderService {
  static async renderChart(width, height, option) {
    const chart = new EChart(width, height);

    const buffer = await chart.renderToBuffer(option);

    return buffer;
  }
}

module.exports = EchartsRenderService;
