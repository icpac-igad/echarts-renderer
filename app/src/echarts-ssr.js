const fs = require("fs");
const echarts = require("echarts");
const { createCanvas } = require("canvas");
const { JSDOM } = require("jsdom");

class Chart {
  width = 800;
  height = 600;
  canvas = null;
  chart = null;

  constructor(width, height) {
    const { window } = new JSDOM();
    global["window"] = window;
    global["navigator"] = window.navigator;
    global["document"] = window.document;

    this.width = width;
    this.height = height;

    this.canvas = createCanvas(width, height);
    this.canvas.width = width;
    this.canvas.height = height;

    this.chart = echarts.init(this.canvas);
  }

  getChartSize() {
    return { width: this.width, height: this.height };
  }

  renderChart(option) {
    this.chart.setOption(option);
  }

  renderToStream(option, type = "png", autoDispose = true) {
    this.chart.setOption(option);
    if (autoDispose) this.chart.dispose();
    switch (type) {
      case "png":
        return this.canvas.createPNGStream();
      case "jpg":
        return this.canvas.createJPEGStream();
      case "pdf":
        return this.canvas.createPDFStream();
    }
  }

  renderToBuffer(option, autoDispose = true) {
    this.renderChart(option);

    return new Promise((resolve, reject) => {
      this.canvas.toBuffer((error, buffer) => {
        if (autoDispose) this.chart.dispose();
        if (error) return reject(error);
        return resolve(buffer);
      });
    });
  }

  renderToBufferSync(option, autoDispose = true) {
    this.renderChart(option);
    const buffer = this.canvas.toBuffer();
    if (autoDispose) this.chart.dispose();
    return buffer;
  }

  renderToFile(option, filename, autoDispose = true) {
    return new Promise()((resolve, reject) => {
      fs.writeFile(filename, this.renderToBufferSync(option), (error) => {
        if (autoDispose) this.chart.dispose();
        if (error) return reject(error);
        return resolve();
      });
    });
  }

  renderToFileSync(option, filename, autoDispose = true) {
    fs.writeFileSync(filename, this.renderToBufferSync(option));
    if (autoDispose) this.chart.dispose();
  }

  dispose() {
    this.chart.dispose();
  }
}

module.exports = Chart;
