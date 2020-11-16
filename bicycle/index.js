/*
 * @Description: 
 * @version: 1.1.0
 * @Author: wqq
 * @Date: 2020-10-28 11:01:16
 * @LastEditors: wqq
 * @LastEditTime: 2020-10-28 14:53:19
 */
window.onload = function () {
  var Bike = new CanvasBike();
  Bike.init();

}

function CanvasBike(props) {
  this.options = {
    width: 540,
    height: 420,
    proportion: 4,
    canvasBg: '#f9f8ee',//背景色
    gearColor: '#160a13',//齿轮的颜色
    color: '#301926'
  }
  if (props) {
    for (var key in props) {
      this.options[key] = options[key];
    }
  }
  this.ele = null;
  this.ctx = null;
  this.wheelPos = [];//记录两个车轮的位置
  this.oneCent = this.options.width * 0.245;
  this.wheelRadius = this.options.height * .1814;
  this.animateNum = 0;//动画计数
  this.edge = 360;//this.canvasW - this.oneCent; //最大值
  this.wheelBorder = 14;

}

CanvasBike.prototype.init = function () {
  this.ele = document.createElement("canvas");
  this.ele.width = this.options.width;
  this.ele.height = this.options.height;
  this.ele.style.backgroundColor = this.options.canvasBg;
  document.body.appendChild(this.ele);
  this.ctx = this.ele.getContext("2d");
  this.run();
  return this.ctx;
}

CanvasBike.prototype.run = function () {
  var self = this;
  this.horizon();
  this.ctx.restore();
  //动画
  var _requestAnimationFrame_ = window.requestAnimationFrame || window.WebkitRequestAnimationFrame;
  this.animateNum += 3;
  _requestAnimationFrame_(function () {
    // self.run();
  });
  this.animateNum = this.animateNum > this.edge ? 6 : this.animateNum;

}

CanvasBike.prototype.horizon = function () {
  this.wheelPos = [];
  this.ctx.save();
  this.ctx.clearRect(0, 0, this.options.width, this.options.height);

  // 绘制地平线
  var horizonX = 0, horizonY = this.options.height - 100;
  this.ctx.beginPath();
  this.ctx.moveTo(horizonX, horizonY);
  this.ctx.lineTo(this.options.width, horizonY);
  this.ctx.lineWidth = 6;
  this.ctx.strokeStyle = this.options.color;
  this.ctx.closePath();
  this.ctx.stroke();
  // 绘制地平线上的标识
  for (var i = 0; i < 5; i++) {
    var dotProportion = (this.options.width * 0.49) * i - this.oneCent;
    this.wheelPos.push({ x: dotProportion, y: horizonY - this.wheelRadius });
    var startX = dotProportion - (this.animateNum * 2); //用于动画滚动移动
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#f9f8ef";
    this.ctx.lineWidth = 6;
    this.ctx.moveTo(startX, horizonY);
    this.ctx.lineTo(startX + 5, horizonY);
    this.ctx.closePath();
    this.ctx.stroke();
  }
  this.ctx.restore();
  this.shuttle();
  this.wheel();
}
CanvasBike.prototype.shuttle = function () {
  var shuttleX = this.options.width + 100,
    shuttleY = this.options.height / 6;
  var shuttleW = shuttleX + 100;
  var lines = [0, 40, 0];
  for (var v = 0; v < 3; v++) {
    var k = lines[v];
    var random = Math.random() + 2;
    var x = shuttleX + k - (this.animateNum * (2.2 * random));
    var y = shuttleY + v * 24;
    var w = shuttleW + k - (this.animateNum * (2.2 * random));
    var grd = this.ctx.createLinearGradient(x, y, w, y);
    grd.addColorStop(0, "#30212c");
    grd.addColorStop(1, "#fff");
    this.ctx.beginPath();
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = grd;
    this.ctx.lineWidth = 3;
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(w, y);
    this.ctx.stroke();
    this.ctx.closePath();
  }
}
CanvasBike.prototype.wheel = function () {
  this.wheelPos = this.wheelPos.slice(1, 3);
  var len = this.wheelPos.length;
  for (var i = 0; i < len; i++) {
    var wheelItem = this.wheelPos[i];
    var wheelItemX = wheelItem.x;
    var wheelItemY = wheelItem.y - this.wheelBorder / 1.5;

    //外胎
    this.ctx.beginPath();
    this.ctx.lineWidth = this.wheelBorder;
    this.ctx.fillStyle = "#f5f5f0";
    this.ctx.strokeStyle = this.color;
    this.ctx.arc(wheelItemX, wheelItemY, this.wheelRadius, 0, Math.PI * 2, false);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fill();
    var scaleMultiple = this.wheelRadius * .94;
    var speed1 = this.animateNum * 2; //外圈半圆速度
    var speed2 = this.animateNum * 3; //内小圈半圆速度
    //后轮
    if (i == 0) {
      //内圆
      this.ctx.beginPath();
      var circleGrd = this.ctx.createRadialGradient(wheelItemX, wheelItemY, 18, wheelItemX, wheelItemY, scaleMultiple);
      circleGrd.addColorStop(0, "#584a51");
      circleGrd.addColorStop(1, "#11090d");
      this.ctx.fillStyle = circleGrd;
      this.ctx.arc(wheelItemX, wheelItemY, scaleMultiple, 0, Math.PI * 2, false);
      this.ctx.fill();
      this.ctx.closePath();

      //两个半圆线

      [
        { lineW: 2, radius: scaleMultiple * .6, sAngle: getRads(-135 + speed1), eAngle: getRads(110 + speed1) },
        { lineW: 1.2, radius: scaleMultiple * .45, sAngle: getRads(45 + speed2), eAngle: getRads(-50 + speed2) }
      ].map((k, v) => {
        this.ctx.beginPath();
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = "#fff";
        this.ctx.lineWidth = k.lineW;
        this.ctx.arc(wheelItemX, wheelItemY, k.radius, k.sAngle, k.eAngle, true);
        this.ctx.stroke();
        this.ctx.closePath();

      });
      this.ctx.restore();

    } else {
      this.ctx.beginPath();
      let innerRingLineW = this.wheelBorder * .357, innerRingR = scaleMultiple * .95;
      this.ctx.strokeStyle = "#341e2b";
      this.ctx.lineWidth = innerRingLineW;
      this.ctx.arc(wheelItemX, wheelItemY, innerRingR, 0, Math.PI * 2, false);
      this.ctx.stroke();
      this.ctx.closePath();
      //两个圆，再缩小一圈，画线圆
      Array.from({ length: 3 }).map((k, v) => {
        let prevIndex = v - 1 <= 0 ? 0 : v - 1;
        let eAngle = v * 135, sAngle = -45 + (prevIndex * 45) + v * 90;
        let radius = scaleMultiple * .75;
        let _color_ = "#120008";
        this.ctx.beginPath();
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = _color_;
        this.ctx.lineWidth = 3.5;
        this.ctx.arc(wheelItemX, wheelItemY, radius, getRads(sAngle + speed1), getRads(eAngle + speed1), false);
        this.ctx.stroke();
        this.ctx.closePath();

        if (v < 2) {
          //再缩小一圈
          let eAngleSmaller = 15 + v * 210, sAngleSmaller = -30 + v * 90;
          let radiusSmaller = scaleMultiple * .45;
          this.ctx.beginPath();
          this.ctx.lineCap = "round";
          this.ctx.strokeStyle = _color_;
          this.ctx.lineWidth = 3;
          this.ctx.arc(wheelItemX, wheelItemY, radiusSmaller, getRads(sAngleSmaller + speed2), getRads(eAngleSmaller + speed2), false);
          this.ctx.stroke();
          this.ctx.closePath();
        }
        this.ctx.restore();
      });
    }
  }
  // this.ctx.restore();
  // this.carBracket();
}

function getRads(degrees) { return (Math.PI * degrees) / 180; } 