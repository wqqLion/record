/*
		* @authors :@IT·平头哥联盟-首席填坑官∙苏南
		* @date    :2018-10-14
		* @description：@IT·平头哥联盟项目示例源码,欢迎投稿讲出你的故事
		* @github：https://honeybadger8.github.io/blog/
		* @QQ: 912594095、386485473
		*/
	//绘制圆形的方法
	CanvasRenderingContext2D.prototype.roundRect=function(x, y, w, h, r){
    var min_size = Math.min(w, h);
    if (r > min_size / 2) r = min_size / 2;
    // 开始绘制
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
function getRads (degrees) { return (Math.PI * degrees) / 180; } 
function getDegrees (rads) { return (rads * 180) / Math.PI; }
  class canvasBike{
    constructor(props={}){
    /**
     * 构造函数字段说明：
     * @param {Object} props 配置项
     * @param {Number} props.width 画布的宽度
     * @param {Number} props.height 画布的宽度
     * @param {Number} wheelRadius 车轮半径
     * @param {Array} wheelPos 记录两个车轮的位置
     * @param {Number} wheelBorder 车轮的边框，也叫外胎;
      本文由@IT·平头哥联盟-首席填坑官∙苏南分享
     */
      let {width=550,height=420,proportion=4}=props;
      this.ele = null;
      this.ctx = null;
      this.proportion = proportion,
      this.canvasW = width,
      this.canvasH = height,
      this.canvasBg = "#f9f8ee";
      this.color = "#301926",
      this.gearColor = "#160a13"; //齿轮的颜色
      this.wheelRadius = this.canvasH*.1814;
      this.wheelBorder = 14;
      this.wheelPos = [];
      this.axisDotPos = [];
      this.oneCent =this.canvasW*0.245;
      this.edge = 360;//this.canvasW - this.oneCent; //最大值
      this.animateNum = 0;//动画计数
    }
    componentDodMount(){
      //实例，初始化执行的方法
      this.ele = document.createElement("canvas");
      this.ele.width = this.canvasW;
      this.ele.height = this.canvasH;
      this.ele.style.backgroundColor = this.canvasBg;
      document.body.appendChild(this.ele);
      this.ctx = this.ele.getContext("2d");
      this.run();
      return this.ctx;
    }
    run(){
      this.horizon();
      this.ctx.restore();
      let _requestAnimationFrame_ = window.requestAnimationFrame||window.WebkitRequestAnimationFrame;
      this.animateNum+=3;
      _requestAnimationFrame_(()=>this.run());
      this.animateNum  = this.animateNum > this.edge ? 6 :this.animateNum;
    }
    horizon(){
      /**
      * 轮子的底部，也称地平线：
      1.清除画布
      2.画一条直线，且高度6px
      3.画5个断点，用于动画滑动视差
      4.同时也记录两个车轮的 X ，Y中心点
      5.两车轮之间的距离大概为整个画布宽度的.49;
      本文@IT·平头哥联盟-首席填坑官∙苏南分享，非商业转载请注明原链接及出处
       */

      this.wheelPos = [];
      this.ctx.save();
      this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);

      let horizonX = 0,horizonY = this.canvasH-100;
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth=6;
      this.ctx.moveTo(horizonX,horizonY);
      this.ctx.lineTo(this.canvasW,horizonY);
      this.ctx.closePath();
      this.ctx.stroke();

      Array.from({length:5}).map((k,v)=>{
        let dotProportion = (this.canvasW*0.49)*v-this.oneCent;
        this.wheelPos.push({x:dotProportion,y:horizonY-this.wheelRadius});
        let startX = dotProportion-(this.animateNum*2); //用于动画滚动移动
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#f9f8ef";
        this.ctx.lineWidth=6;
        this.ctx.moveTo(startX,horizonY);
        this.ctx.lineTo(startX+5,horizonY);
        this.ctx.closePath();
        this.ctx.stroke();
      });
      this.ctx.restore();
      this.shuttle();
      this.wheel();
    }
    shuttle(){
      /**
      * 画几根横线，有点视差，感觉骑车在飞速穿梭的感觉：
      1.清除画布
      2.画一条直线，且高度6px
      3.画5个断点，用于动画滑动视差
      4.同时也记录两个车轮的 X ，Y中心点
      5.两车轮之间的距离大概为整个画布宽度的.49;
      本文@IT·平头哥联盟-首席填坑官∙苏南分享，非商业转载请注明原链接及出处
       */
      let shuttleX = this.canvasW+100,
          shuttleY = this.canvasH/6;
      let shuttleW = shuttleX+100;
      [0,40,0].map((k,v)=>{
        let random = Math.random()+2;
        let x = shuttleX+k-(this.animateNum*(2.2*random));
        let y = shuttleY+v*24;
        let w = shuttleW+k-(this.animateNum*(2.2*random));
        let grd=this.ctx.createLinearGradient(x,y,w,y);
        grd.addColorStop(0,"#30212c");
        grd.addColorStop(1,"#fff");
        this.ctx.beginPath();
        this.ctx.lineCap="round";
        this.ctx.strokeStyle = grd;
        this.ctx.lineWidth=3;
        this.ctx.moveTo(x,y);
        this.ctx.lineTo(w,y);
        this.ctx.stroke();
        this.ctx.closePath();

      });

    }
    wheel(){
      /**
      * 绘制两个车轮：
      1.取之前绘制的5个点之间的1-3 两个坐标;
      2.车轮的位置以地部地平线为边界;
      3.前后轮做一些不一样的处理，先画后轮做一些实心 放射性渐变;

      4.后轮 - 实心轮的半径为外轮的 .94,比例;
      5.后轮 - 再画两个半圆满，用于动画的视差，否则一个圆在转动，是看不出来的;大概为整个圆的1/3;
      6.后轮 - 两个半圆的比例 以实心轮的半径再缩小一定比;
      
      7.前轮 - 前轮的内圈圆,它是空心的，不填充;
      8.再画两个断点圆，修饰一下,每一圈都在上一个圆的基础上缩小一部分;
    
      9.同时绘制一个轴心圆 半径为 9 ;

       */
      this.wheelPos = this.wheelPos.slice(1,3);
      this.wheelPos.map((wheelItem,v)=>{
        let wheelItemX = wheelItem.x, 
        wheelItemY= wheelItem.y-this.wheelBorder/1.5;

        //外胎
        this.ctx.beginPath();
        this.ctx.lineWidth=this.wheelBorder;
        this.ctx.fillStyle = "#f5f5f0";
        this.ctx.strokeStyle = this.color;
        this.ctx.arc(wheelItemX,wheelItemY,this.wheelRadius,0,Math.PI*2,false);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fill();

        let scaleMultiple = this.wheelRadius*.94;
        let speed1 = this.animateNum*2; //外圈半圆速度
        let speed2 = this.animateNum*3; //内小圈半圆速度
        //后轮
        if(v === 0){
          
          //内圆
          this.ctx.beginPath();
          let circleGrd=this.ctx.createRadialGradient(wheelItemX,wheelItemY,18,wheelItemX,wheelItemY,scaleMultiple);
            circleGrd.addColorStop(0,"#584a51");
            circleGrd.addColorStop(1,"#11090d");
          this.ctx.fillStyle = circleGrd;
          this.ctx.arc(wheelItemX,wheelItemY,scaleMultiple,0,Math.PI*2,false);
          this.ctx.fill();
          this.ctx.closePath();

          //两个半圆线
          
          [
            {lineW:2,radius:scaleMultiple*.6,sAngle:getRads(-135+speed1) , eAngle:getRads(110+speed1)},
            {lineW:1.2,radius:scaleMultiple*.45,sAngle:getRads(45+speed2) , eAngle:getRads(-50+speed2)}
          ].map((k,v)=>{
            this.ctx.beginPath();
            this.ctx.lineCap="round";
            this.ctx.strokeStyle ="#fff";
            this.ctx.lineWidth=k.lineW;
            this.ctx.arc(wheelItemX,wheelItemY,k.radius,k.sAngle,k.eAngle,true);
            this.ctx.stroke();
            this.ctx.closePath();

          });
          this.ctx.restore();

        }else{ //前轮
          //前轮的内圈圆
          this.ctx.beginPath();
          let innerRingLineW = this.wheelBorder * .357,innerRingR = scaleMultiple*.95;
          this.ctx.strokeStyle = "#341e2b";
          this.ctx.lineWidth=innerRingLineW;
          this.ctx.arc(wheelItemX,wheelItemY,innerRingR,0,Math.PI*2,false);
          this.ctx.stroke();
          this.ctx.closePath();

          //两个圆，再缩小一圈，画线圆
          Array.from({length:3}).map((k,v)=>{
            let prevIndex = v-1 <= 0 ? 0 : v-1;
            let eAngle = v*135, sAngle = -45+(prevIndex*45)+v*90;
            let radius = scaleMultiple*.75;
            let _color_ = "#120008";
            this.ctx.beginPath();
            this.ctx.lineCap="round";
            this.ctx.strokeStyle = _color_;
            this.ctx.lineWidth=3.5;
            this.ctx.arc(wheelItemX,wheelItemY,radius,getRads(sAngle+speed1),getRads(eAngle+speed1),false);
            this.ctx.stroke();
            this.ctx.closePath();

            if(v<2){
              //再缩小一圈
              let eAngleSmaller = 15+ v*210, sAngleSmaller = -30+v*90;
              let radiusSmaller = scaleMultiple*.45;
              this.ctx.beginPath();
              this.ctx.lineCap="round";
              this.ctx.strokeStyle = _color_;
              this.ctx.lineWidth=3;
              this.ctx.arc(wheelItemX,wheelItemY,radiusSmaller,getRads(sAngleSmaller+speed2),getRads(eAngleSmaller+speed2),false);
              this.ctx.stroke();
              this.ctx.closePath();
            }
            this.ctx.restore();
          });

        }

        //最后两轮胎中心点圆轴承
        this.axisDot(wheelItemX,wheelItemY);
        this.ctx.restore();
        
      });
      this.ctx.restore();
      this.carBracket();
    }
    axisDot(x,y,fillColor="transparent",radius=9){
      this.axisDotPos.push({x,y});
    //最后中心点的圆
      this.ctx.beginPath();
      this.ctx.lineCap="round";
      this.ctx.strokeStyle = "#120008";
      this.ctx.lineWidth=4;
      this.ctx.fillStyle=fillColor;
      this.ctx.arc(x,y,radius,0,Math.PI*2,false);
      this.ctx.closePath();
      this.ctx.stroke();
      this.ctx.fill();
    }
    //方案1 菱形
    polygon(discX,discY,coordinateX,coordinateY,polygon1X,polygon1Y,polygon2X,polygon2Y,height,coordinateW=6){

      this.ctx.beginPath();
      this.ctx.strokeStyle = this.gearColor;
        this.ctx.lineWidth=coordinateW;
      this.ctx.moveTo(polygon1X,polygon1Y);
      this.ctx.lineTo(coordinateX,height);
      this.ctx.lineTo(discX,discY); 
      this.ctx.lineTo(polygon2X,polygon1Y+5);
      this.ctx.lineTo(polygon2X-5,polygon1Y);
      this.ctx.lineTo(polygon1X,polygon1Y);
      this.ctx.closePath();
      this.ctx.stroke();
    }
    //方案2 三角形
    triangle(){
      let coordinateW = 6;
      let discX = this.wheelPos[0].x + this.wheelRadius*1.6,
          discY = this.wheelPos[0].y-coordinateW*2.5;

      let coordinateX = this.wheelPos[0].x,
          coordinateY = this.wheelPos[0].y-this.wheelRadius*.19;
    
      //绘制车架 - 两个三角形
      let triangleX1 = this.wheelRadius+coordinateX,
          triangleY1 = coordinateY-this.wheelRadius*1.29,
          triangleH1 = triangleY1+120*Math.sin(Math.PI/3);
      let triangleX2 = this.wheelPos[1].x-30,
          triangleY2 = triangleY1,
          triangleH2 = triangleY1+115*Math.sin(Math.PI/3);

      [
        {
          moveX:triangleX1,
          moveY:triangleY1,
          lineX1:coordinateX,
          lineY1:triangleH1,
          lineX2:discX,
          lineY2:discY,
        },
        {
          moveX:triangleX2+15,
          moveY:triangleY2,
          lineX1:triangleX1,
          lineY1:triangleY1,
          lineX2:discX,
          lineY2:triangleH2,
        },
      ].map((k,v)=>{
        this.ctx.beginPath();
        this.ctx.moveTo(k.moveX,k.moveY); //把坐标移动到A点，从A开始
        this.ctx.strokeStyle = this.gearColor;
        this.ctx.lineWidth=coordinateW;
        this.ctx.lineTo(k.lineX1,k.lineY1);//从A开始，画到B点结束
        this.ctx.lineTo(k.lineX2,k.lineY2); //再从B到C点，闭合
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
      });

    }
    
    carBracket(){

      /**
      * 绘制车支架：
      1.找到圆盘的中心点，介于后轮半径之上;
      2.分析车架的结构，我们可以看为是一个菱形，也可以看着是两个三角形，菱形可以看 polygon方法，三角形看triangle()方法;
      3.首先算出三角形的起点、再算出三角形的角度、高度，请看下面示图;
      4.再额外画几根加粗的主轴，及前轮的主轴
      5.最后在后轮的中心点盖上一个圆点 this.axisDot
      6.菱形 就要简单些的，但看起来逼格没有这么高端，就是用lineTo点对点的划线
      */
      let coordinateW = 6;
      let discX = this.wheelPos[0].x + this.wheelRadius*1.6,
          discY = this.wheelPos[0].y-coordinateW*2.5;

      let coordinateX = this.wheelPos[0].x,
          coordinateY = this.wheelPos[0].y-this.wheelRadius*.19;

      let polygonX1 = this.wheelRadius+coordinateX,
          polygonY1 = coordinateY-this.wheelRadius*1.29;
      let polygonX2 = this.wheelPos[1].x-40,
          polygonY2 = polygonY1;

      var polygonH1 = (polygonY1)+120*Math.sin(Math.PI/3);//计算等边三角形的高

      this.polygon(discX,discY,coordinateX,coordinateY,polygonX1,polygonY1,polygonX2,polygonY2,polygonH1);

      //绘制3跟主杠杆
      //前轮主杆
      let lever1X = polygonX2,
      lever1Y = polygonY2;
      //第四条杠杆 - 5  ，也是车齿轮下的主杆
      
      let lever2X = discX-62,
      lever2Y = discY-135;

      let lever3X = lever1X,
          lever3Y = polygonY1+10;
      // this.occlusion(lever3X,lever3Y); //覆盖住之前的三角多出部分

      [
        {
          moveX:this.wheelPos[1].x-coordinateW/2,
          moveY:this.wheelPos[1].y-18,
          lineX:lever1X-20,
          lineY:lever1Y-45,
          lineW:coordinateW
        },{
          moveX:discX,
          moveY:discY,
          lineX:lever2X,
          lineY:lever2Y,
          lineW:coordinateW+2
        },
        {
          moveX:discX,
          moveY:discY,
          lineX:lever3X,
          lineY:lever3Y,
          lineW:coordinateW+2
        }
      ].map((k,v)=>{

        this.ctx.beginPath();
        this.ctx.lineCap="round";
        this.ctx.strokeStyle = this.gearColor;
        this.ctx.lineWidth=k.lineW||coordinateW;
        this.ctx.moveTo(k.moveX,k.moveY);
        this.ctx.lineTo(k.lineX,k.lineY);
        this.ctx.closePath();
        this.ctx.stroke();

      });

      this.ctx.restore();
      let discRadius = this.wheelRadius*.36;
      this.chain(discX,discY,discRadius);
      this.carDisc(discX,discY,coordinateW,discRadius);
      this.axisDot(this.axisDotPos[0].x,this.axisDotPos[0].y,"#fff",6.5);
      this.seat(discX,discY);
      this.steering(lever1X,lever1Y,coordinateW/1.2);
      
    }
    seat(discX,discY){
      //坐位
      this.ctx.restore();
      let seatX = (discX-85),seatY=discY-140;
      let curve1Cpx = [seatX-5,seatY+30,seatX+75,seatY+8];
      let curve2Cpx =[seatX+85,seatY-5,seatX,seatY]; 
      this.ctx.beginPath();
      // this.ctx.fillStyle = this.gearColor;
      let grd=this.ctx.createLinearGradient(seatX,seatY,seatX+10,seatY+60); //渐变的角度 
      grd.addColorStop(0,"#712450");
      grd.addColorStop(1,"#11090d");
      this.ctx.fillStyle = grd;
      this.ctx.moveTo(seatX,seatY);
      this.ctx.quadraticCurveTo(...curve1Cpx);
      this.ctx.quadraticCurveTo(...curve2Cpx);
      this.ctx.fill();

      
    }
    steering(lever1X,lever1Y,coordinateW){
      //车前轴上的手柄
      let steeringX = lever1X-20,steeringY = lever1Y-45;
      let steeringStep1 = [steeringX+40,steeringY-10,steeringX+40,steeringY-10,steeringX+35,steeringY+15]
      let steeringStep2 = [steeringX+30,steeringY+25,steeringX+25,steeringY+23,steeringX+18,steeringY+23]
      this.ctx.beginPath();
      this.ctx.lineCap="round";
      this.ctx.strokeStyle = "#712450";
      this.ctx.lineWidth=coordinateW;
      this.ctx.moveTo(steeringX,steeringY); //40 60;
      this.ctx.bezierCurveTo(...steeringStep1);
      this.ctx.bezierCurveTo(...steeringStep2);
      this.ctx.stroke();
      this.ctx.closePath();
      
    }
    
    carDisc(coordinateX,coordinateY,coordinateW,_discRadius){
      /**
      * 绘制车轮之间的圆盘也叫齿轮：
      1.找到圆盘的中心点，介于后轮半径之上;
      2.中心点X轴公式 ： 车轮的中心点X轴 + 车轮的半径 X 1.6倍;
      3.中心点Y轴公式 ： 车轮的中心点Y轴 - 8px ，y轴偏上，让中间的链接车架不处在同一水平线上;
      4.绘制车轮的半径 ;
      */

      let discX = coordinateX,discY = coordinateY;
      let discRadius = _discRadius || this.wheelRadius*.36;

      this.ctx.beginPath();
      this.ctx.fillStyle = this.color;
      this.ctx.lineWidth =1;
      this.ctx.strokeStyle = "#0f080d";
      this.ctx.arc(discX,discY,discRadius,0,Math.PI*2,false);
      this.ctx.closePath();
      this.ctx.stroke();
      this.ctx.fill();

      //缩小 .7 绘制一个描边圆形
      this.ctx.beginPath();
      this.ctx.strokeStyle = "#fff";
      this.ctx.lineWidth = 2;
      this.ctx.arc(discX,discY,discRadius*.7,0,Math.PI*2,false);
      this.ctx.closePath();
      this.ctx.stroke();

      //缩小 5半径 绘制一个填充圆形
      this.ctx.beginPath();
      this.ctx.fillStyle = "#fff";
      this.ctx.arc(discX,discY,5,0,Math.PI*2,false);
      this.ctx.closePath();
      this.ctx.fill();

      this.discGear(discX,discY,coordinateW);
    }
    discGear(coordinateX,coordinateY,coordinateW){
      //车中间齿轮盘 disc
      let discX = coordinateX,discY = coordinateY;
      let discRadius = this.wheelRadius*.36;//车轮的3.6;

      let discDotX = discX+discRadius+8,discDotY = discRadius/.98;
      this.ctx.restore();
      this.ctx.save();
      this.ctx.translate(discX,discY);
      // this.ctx.rotate(-(Math.PI/2));

      Array.from({length:30}).map((v,index)=>{
        let radian = (Math.PI / 15) ;//index*(Math.PI / 30); //360 = 2 * Math.PI / singleAngle/2
        this.ctx.beginPath();
        this.ctx.lineCap="round";
        this.ctx.strokeStyle = this.color;
        this.ctx.rotate(radian);
        this.ctx.lineWidth=1.5;
        this.ctx.moveTo(0,discDotY);
        this.ctx.lineTo(1,discDotY);
        // ctx.arc(discDotX,discDotY,6,0,Math.PI*2,false);
        this.ctx.closePath();
        this.ctx.stroke();

      });
      this.pedal(discX,discY,discRadius);
      this.pedal(discX,discY,discRadius,1);
      
      this.ctx.restore();

      
    }

    pedal(coordinateX,coordinateY,discRadius,turnAngle=0){

      //脚踏板，分两次初始化，一次在中心齿轮绘制之前，一次在之后，

      let pedalX = coordinateX, pedalY = coordinateY - discRadius*.7;
      let pedalW = 6,
          pedalH =  discRadius*1.9;
      let radian = (this.animateNum)*(Math.PI / 180) ;
      let radianHor = (this.animateNum)*(Math.PI / 180) ;
      let turnAngleNum = 1;
      let moveY = 28;
      if(turnAngle !== 0){
        this.ctx.rotate(-180*(Math.PI/180));
        turnAngleNum = (Math.PI/180);
      };
      this.ctx.beginPath();
      this.ctx.rotate(radian*turnAngleNum);
      this.ctx.lineCap="round";
      this.ctx.strokeStyle = this.gearColor;
      this.ctx.lineWidth=pedalW;
      this.ctx.moveTo(-1,moveY);
      this.ctx.lineTo(0,pedalH);
      this.ctx.closePath();
      this.ctx.stroke();
      
      this.ctx.save();
      let pedalHorW = pedalH/1.5,pedalHorH=pedalW;
      this.ctx.translate(0,pedalH);
      this.ctx.beginPath();
      this.ctx.rotate(-radianHor);

      this.ctx.lineCap="round";
      this.ctx.fillStyle = "#fff";
      this.ctx.strokeStyle = this.gearColor;
      this.ctx.lineWidth =2;
      this.ctx.roundRect(-pedalHorW/2,-2,pedalHorW,pedalHorH,5);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.restore();
    }
    chain(coordinateX,coordinateY,discRadius){
      //链条

      let chainW = ( coordinateX+discRadius - this.wheelPos[0].x) / 2;
      let chainX = this.wheelPos[0].x +chainW-5 ;
      let chainY = coordinateY ;
      this.ctx.save();
      this.ctx.translate(chainX,chainY+4.8);
      this.ctx.rotate(-2*(Math.PI/180));
      let r = chainW+chainW*.06,h = discRadius/2;
      // let radiusOffset = r*.22;
      this.ctx.beginPath();
      this.ctx.moveTo(-r, -1);
      this.ctx.lineWidth=3;
      this.ctx.strokeStyle = "#1e0c1a";
      this.ctx.bezierCurveTo(-r,h*1.5,r,h*4,r,0);
      this.ctx.bezierCurveTo(r,-h*4,-r,-h*1.5,-r,0);
      /*this.ctx.bezierCurveTo(-r-radiusOffset,h*1.2,r-5,h*3.65,r,0);
      this.ctx.bezierCurveTo(r+radiusOffset/2,-h*5,-r-radiusOffset,-h*.8,-r,0);*/
      this.ctx.closePath();
      this.ctx.stroke();
      this.ctx.restore();
      
    }


  }
  let Bike = new canvasBike();
  Bike.componentDodMount();