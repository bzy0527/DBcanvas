var DBCanvas = {};

DBCanvas.Tools = {
    print:function (t) {
        var printArr = new Array();
        var date = new Date();  //创建对象
        var y = date.getFullYear();     //获取年份
        var m =date.getMonth()+1;   //获取月份  返回0-11
        var d = date.getDate(); // 获取日
        // var w = date.getDay();   //获取星期几  返回0-6   (0=星期天)
        var h = date.getHours();
        var minute = date.getMinutes()
        var s = date.getSeconds();
        var time = y+"-"+m+"-"+d+"   "+h+":"+minute+":"+s;
        printArr.push(time);
        printArr.push('>>>>>>>>>'+t);
        printArr.push('<br>');
        var p = document.getElementsByClassName("print")[0];
        printArr.forEach(function (t2) {
            p.innerHTML += t2;
        });
    },
    drawKnife:function (context,x,y,w,h) { //画刀具
        context.save();
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle = "black";
        context.globalAlpha = 1;
        // context.rect(x,y,w,h);
        context.fillStyle = "#FEFEFE";
        context.arc(x+w*0.5,y,0.5*w,Math.PI,Math.PI*2);
        context.lineTo(x+w,y+h);
        context.arc(x+0.7*w,y+h,0.3*w,0,Math.PI);
        context.lineTo(x+0.4*w,y+0.6*h);
        context.lineTo(x,y+0.6*h);
        context.lineTo(x,y);
        context.fill();
        context.stroke();
    },
    drawFork:function(context,x,y,w,h){
        // context.save();
        var gap = w/11;
        context.beginPath();
        context.strokeStyle = "black";
        context.lineWidth = 1;
        context.fillStyle = "#FEFEFE";
        // context.rect(x,y,w,h);

        for (var i=0;i<4;i++){
            context.arc(x+gap+3*i*gap,y,gap,Math.PI,Math.PI*2,false);
            context.lineTo(x+2*gap+3*i*gap,y+h*0.33);
            if (i<3){
                context.lineTo(x+3*gap+3*i*gap,y+h*0.33);
            }
        }
        context.lineTo(x+w,y+h*0.4);
        context.arc(x+0.65*w,y+h*0.4,0.35*w,0,Math.PI*0.5);
        context.lineTo(x+0.65*w,y+h);

        //手柄
        context.arc(x+0.5*w,y+h,0.15*w,0,Math.PI);
        context.lineTo(x+0.35*w,y+h*0.4+0.35*w);

        context.arc(x+0.35*w,y+h*0.4,0.35*w,Math.PI*0.5,Math.PI);
        context.lineTo(x,y);
        // context.arc(x+gap,y,gap,Math.PI,Math.PI*2,false);
        // context.arc(x+5*gap,y,gap,Math.PI,Math.PI*2,false);
        context.fill();
        context.stroke();

    },
    drawArrow:function(context,x,y,w){
        context.save();
        var h = 2.8*w;
        // context.beginPath();
        context.strokeStyle = "black";
        // context.rect(x,y,w,h);
        // context.fillStyle = "black";
        // context.translate(x,y);
        // context.rotate(Math.PI/2);

        context.moveTo(x+0.5*w,y);
        context.lineTo(x,y+0.5*w/(Math.tan(Math.PI/6)));
        context.lineTo(x+0.4*w,y+0.5*w/(Math.tan(Math.PI/6)));
        context.lineTo(x+0.4*w,y+h);
        context.lineTo(x+0.6*w,y+h);
        context.lineTo(x+0.6*w,y+0.5*w/(Math.tan(Math.PI/6)));
        context.lineTo(x+w,y+0.5*w/(Math.tan(Math.PI/6)));
        context.lineTo(x+0.5*w,y);
        context.stroke();
        // context.fill();

        context.restore();
    },
    // drawBoy:function (context,x,y,w) {
    //     context.save();
    //     context.beginPath();
    //     context.lineWidth = 1;
    //     context.strokeStyle = "black";
    //
    //     context.rect(x,y,w,3*w);
    //     context.stroke();
    //
    //     // DBCanvas.Tools.print("hello");
    //     context.restore();
    // }
}

// function print(t) {
//     var printArr = new Array();
//
//     var date = new Date();  //创建对象
//     var y = date.getFullYear();     //获取年份
//     var m =date.getMonth()+1;   //获取月份  返回0-11
//     var d = date.getDate(); // 获取日
//     // var w = date.getDay();   //获取星期几  返回0-6   (0=星期天)
//     var h = date.getHours();
//     var minute = date.getMinutes()
//     var s = date.getSeconds();
//     var time = y+"-"+m+"-"+d+"   "+h+":"+minute+":"+s;
//     printArr.push(time);
//     printArr.push('>>>>>>>>>'+t);
//     printArr.push('<br>');
//     var p = document.getElementsByClassName("print")[0];
//     printArr.forEach(function (t2) {
//         p.innerHTML += t2;
//     });
// }
//定义点对象
var Point = function (x,y) {
    var obj = new  Object();
    obj.x = x;
    obj.y = y;
    return obj;
}


//绘制视图
DBCanvas.DrawView = function () {

    var drawV = new Object();
    drawV.shapes = new Array();
    drawV.canvas = document.getElementsByClassName("canvas")[0];
    drawV.context = drawV.canvas.getContext("2d");

    //当前的模式：编辑editMode和使用useMode

    //编辑模式：1；使用模式：2；
    drawV.mode = 1;


    drawV.activedShape = undefined;
    //记录当前选中的图形
    drawV.selectedShape = undefined;
    //记录前一次选中的图形
    drawV.preSelectShape = undefined;

    drawV.editShape = undefined;

    //记录编辑视图的点击（响应）区域
    drawV.clickedArea = undefined;

    drawV.mouseDownPoint = undefined;
    drawV.mouseMovePoint = undefined;

    //保存绘制页面的所有形状+编辑视图的属性
    drawV.allDatas = new Array();

    drawV.editView = new DBCanvas.EditView();

    drawV.editViewShow = false;
    // drawV.shapes.push(drawV.editView);

    //保存当前绘制环境数据
    drawV.saveContext = function () {


        drawV.allDatas.splice(0,drawV.allDatas.length);

        drawV.shapes.forEach(function (shape) {

            DBCanvas.Tools.print("s:"+shape.Serialization());
            //保存各个图形参数到数组
            drawV.allDatas.push({   shapeClass:shape.shapeClass,
                                    shapeType:shape.shapeType,
                                    alpha:shape.alpha,
                                    minX:shape.minX,
                                    minY:shape.minY,
                                    maxX:shape.maxX,
                                    maxY:shape.maxY,
                                    deskColor:shape.deskColor,
                                    tableColor:shape.tableColor,
                                    personCount:shape.personCount,
                                    tableNum:shape.tableNum});

        });
        //
        var json = {mode:drawV.mode,
                    shapes:drawV.allDatas};

        localStorage.clear();
        localStorage.setItem("mode",drawV.mode);
        localStorage.setItem("shapes",JSON.stringify(json));

        DBCanvas.Tools.print("json:"+JSON.stringify(json));
        return JSON.stringify(json);
    }


    //读取保存的绘制环境
    drawV.readContext = function (datas) {

        // datas = '{"mode":1,"shapes":[{"shapeType":"Cashier","alpha":1,"minX":392,"minY":890,"maxX":474,"maxY":974},{"shapeType":"Partition","alpha":1,"minX":494,"minY":869,"maxX":516,"maxY":977},{"shapeType":"Partition","alpha":1,"minX":687,"minY":33,"maxX":708,"maxY":532},{"shapeType":"Partition","alpha":1,"minX":663,"minY":972,"maxX":924,"maxY":997},{"shapeType":"Partition","alpha":1,"minX":23,"minY":979,"maxX":517,"maxY":999},{"shapeType":"Partition","alpha":1,"minX":23,"minY":2,"maxX":934,"maxY":27},{"shapeType":"Partition","alpha":1,"minX":1,"minY":-61,"maxX":24,"maxY":998},{"shapeType":"Partition","alpha":1,"minX":927,"minY":0,"maxX":950,"maxY":1059},{"shapeType":"RectTable","alpha":1,"minX":773,"minY":428,"maxX":923,"maxY":518,"deskColor":"blue","tableColor":"white","personCount":6},{"shapeType":"RectTable","alpha":1,"minX":772,"minY":300,"maxX":922,"maxY":390,"deskColor":"blue","tableColor":"white","personCount":6},{"shapeType":"RectTable","alpha":1,"minX":771,"minY":174,"maxX":921,"maxY":264,"deskColor":"blue","tableColor":"white","personCount":6},{"shapeType":"RectTable","alpha":1,"minX":769,"minY":46,"maxX":919,"maxY":136,"deskColor":"blue","tableColor":"white","personCount":6},{"shapeType":"RectTable","alpha":1,"minX":226,"minY":888,"maxX":376,"maxY":978,"deskColor":"blue","tableColor":"white","personCount":6},{"shapeType":"RectTable","alpha":1,"minX":520,"minY":431,"maxX":670,"maxY":521,"deskColor":"blue","tableColor":"white","personCount":6},{"shapeType":"RectTable","alpha":1,"minX":521,"minY":299,"maxX":671,"maxY":389,"deskColor":"blue","tableColor":"white","personCount":6},{"shapeType":"RectTable","alpha":1,"minX":520,"minY":174,"maxX":670,"maxY":264,"deskColor":"blue","tableColor":"white","personCount":6},{"shapeType":"RectTable","alpha":1,"minX":518,"minY":47,"maxX":668,"maxY":137,"deskColor":"blue","tableColor":"white","personCount":6},{"shapeType":"RectTable","alpha":1,"minX":307,"minY":296,"maxX":457,"maxY":386,"deskColor":"blue","tableColor":"white","personCount":6},{"shapeType":"RectTable","alpha":1,"minX":311,"minY":431,"maxX":461,"maxY":521,"deskColor":"blue","tableColor":"white","personCount":6},{"shapeType":"RectTable","alpha":1,"minX":29,"minY":888,"maxX":179,"maxY":978,"deskColor":"blue","tableColor":"white","personCount":6},{"shapeType":"ArcTable","alpha":1,"minX":30,"minY":28,"maxX":170,"maxY":168,"deskColor":"black","tableColor":"red","personCount":7},{"shapeType":"ArcTable","alpha":1,"minX":668,"minY":711,"maxX":786,"maxY":827,"deskColor":"black","tableColor":"red","personCount":7},{"shapeType":"ArcTable","alpha":1,"minX":669,"minY":847.5,"maxX":789,"maxY":968.5,"deskColor":"black","tableColor":"red","personCount":7},{"shapeType":"ArcTable","alpha":1,"minX":814,"minY":847,"maxX":928,"maxY":963,"deskColor":"black","tableColor":"red","personCount":7},{"shapeType":"ArcTable","alpha":1,"minX":805,"minY":705,"maxX":929,"maxY":829,"deskColor":"black","tableColor":"red","personCount":7},{"shapeType":"Partition","alpha":1,"minX":641,"minY":870,"maxX":662,"maxY":997},{"shapeType":"Partition","alpha":1,"minX":26,"minY":173,"maxX":132,"maxY":188},{"shapeType":"Partition","alpha":1,"minX":198,"minY":30,"maxX":216,"maxY":195},{"shapeType":"Partition","alpha":1,"minX":446,"minY":28,"maxX":466,"maxY":197},{"shapeType":"RectTable","alpha":1,"minX":30,"minY":431,"maxX":180,"maxY":521,"deskColor":"blue","tableColor":"white","personCount":6},{"shapeType":"RectTable","alpha":1,"minX":31,"minY":289,"maxX":181,"maxY":379,"deskColor":"blue","tableColor":"white","personCount":6},{"shapeType":"RectTable","alpha":0.5,"minX":29,"minY":572,"maxX":179,"maxY":662,"deskColor":"blue","tableColor":"white","personCount":6},{"shapeType":"RectTable","alpha":0.5,"minX":28,"minY":730,"maxX":178,"maxY":820,"deskColor":"blue","tableColor":"white","personCount":6},{"shapeType":"ArcTable","alpha":1,"minX":250,"minY":735,"maxX":350,"maxY":836,"deskColor":"black","tableColor":"red","personCount":7}]}';
        //测试本地存储接口
        // DBCanvas.Tools.print("length:"+localStorage.length);
        // DBCanvas.Tools.print("mode:"+localStorage.getItem("mode"));
        // var shapes = localStorage.getItem("shapes");
        //
        // DBCanvas.Tools.print(JSON.parse(shapes).shapes[0].personCount);



        ///
        //清除当前界面的所有图形
        drawV.shapes.splice(0,drawV.shapes.length);
        //解析JSon成对象
        var jsonData = JSON.parse(datas);
        // jsonData.shapes.forEach(function (s) {
        //     switch (s.shapeType){
        //         case "ArcTable":
        //            shape = new DBCanvas.ArcTable();
        //            shape.tableColor = s.tableColor;
        //            shape.deskColor = s.deskColor;
        //            shape.personCount = s.personCount;
        //            shape.tableNum = s.tableNum;
        //            break;
        //         case "RectTable":
        //             shape = new DBCanvas.RectTable();
        //             shape.tableColor = s.tableColor;
        //             shape.deskColor = s.deskColor;
        //             shape.personCount = s.personCount;
        //             shape.tableNum = s.tableNum;
        //             break;
        //
        //         case "Partition":
        //             shape = new DBCanvas.Partition();
        //             break;
        //         case "Aisle":
        //             shape = new DBCanvas.Aisle();
        //             break;
        //         case "Exit":
        //             shape = new DBCanvas.Exit();
        //             break;
        //         case "Toilet":
        //             shape = new DBCanvas.Toilet();
        //             break;
        //         case "Cashier":
        //             shape = new DBCanvas.Cashier();
        //             break;
        //         default:
        //             break;
        //     }
        //
        //     shape.minX= s.minX;
        //     shape.maxX = s.maxX;
        //     shape.minY = s.minY;
        //     shape.maxY = s.maxY;
        //     shape.alpha = s.alpha;
        //     drawV.shapes.push(shape);
        //
        // });
        jsonData.shapes.forEach(function (s) {
            var create = "new " + s.shapeClass +"();";
            var shape = eval(create);
            shape.minX = s.minX;
            shape.minY = s.minY;
            shape.maxX = s.maxX;
            shape.maxY = s.maxY;
            shape.alpha = s.alpha;
            shape.tableNum = s.tableNum;
            shape.tableColor = s.tableColor;
            shape.deskColor = s.deskColor;
            shape.personCount = s.personCount;
            drawV.shapes.push(shape);

        });
        drawV.mode = 2;
        drawV.draw();
    }

    //删除选中的图形
    drawV.removeShape = function () {
        if(drawV.editViewShow==false){
            return;
        }
        var num = -1;

        //forEach无法使用break跳出循环
        // drawV.shapes.forEach(function (t,index) {
        //     if (t==drawV.selectedShape){
        //         num = index;
        //     }
        //     j++;
        // });

        for (var i=0;i<drawV.shapes.length;i++){
            if(drawV.shapes[i]==drawV.selectedShape){
                num = i;
                break;
            }
        }

        drawV.shapes.splice(num,1);
        drawV.editViewShow = false;
        // DBCanvas.Tools.print(drawV.shapes.length);

        drawV.draw();
    }


    //保存
    drawV.save = function () {
        drawV.context.save();
    }

    //恢复
    drawV.restore = function () {
        drawV.context.restore();
    }

    //绘制
    drawV.draw = function () {
        drawV.restore();
        drawV.context.clearRect(0,0,drawV.canvas.width,drawV.canvas.height);

        drawV.shapes.forEach(function (shape) {
            shape.draw(drawV.context);
        });

    }
    //点击测试
    drawV.hitEvent = function (x,y) {
        var sourceShape = undefined;


        if(drawV.editViewShow == true){
            drawV.editView.context = drawV.context;

            drawV.editView.downPoint = new Point(x,y);
            drawV.editView.draw(drawV.context);



          if(drawV.editView.hitEvent(x,y)==true){
              return "editView";
          }else {
              for(var i=drawV.shapes.length-1; i>=0; i--){
                    var shape = drawV.shapes[i];
                     shape.drawView = drawV;
                     if (shape.hitEvent(x,y) == true){
                         sourceShape = shape;
                         return sourceShape;
                        }
                    }
                    return sourceShape;
          }

        }else {
            for(var i=drawV.shapes.length-1; i>=0; i--){
                    var shape = drawV.shapes[i];
                     shape.drawView = drawV;
                     if (shape.hitEvent(x,y) == true){
                         sourceShape = shape;
                         return sourceShape;
                        }
                    }
                    return sourceShape;
        }
    }

    //切换模式
    drawV.changeMode = function () {
        drawV.shapes.forEach(function (shape) {
            shape.alpha = 1.0;
        });
        drawV.mode = (drawV.mode==1) ? 2 : 1;
        // DBCanvas.Tools.print("测试切换模式"+drawV.mode);
        drawV.draw();
    }

    // document.touchstart = function (event) {
    //     event.preventDefault();
    //     DBCanvas.Tools.print("触摸屏幕X点：");
    // }

    //鼠标点击
    drawV.canvas.onmousedown = function (event) {


        //如果点击的不是编辑视图，就把点击区域赋值为undefined；
        drawV.editView.clickedArea = undefined;
        drawV.mouseDownPoint = new Point(event.offsetX, event.offsetY);
        drawV.MouseButton=1;

        var shape = drawV.hitEvent(event.offsetX, event.offsetY);

        // DBCanvas.Tools.print("downArea:"+drawV.editView.clickedArea);
        drawV.clickedArea = drawV.editView.clickedArea;

        drawV.editView.editAble = false;
        drawV.editView.moveAble = false;

        //点击到图形之外的区域
        if (typeof shape == "undefined"){

            // if(drawV.mode == DrawViewMode.EditMode){
            //     drawV.selectedShape = "noShape";
            //     drawV.editView.edit(drawV.selectedShape);
            //     drawV.editViewShow = false;
            //
            // }
            if (drawV.mode == 2){
                drawV.editViewShow = false;
                drawV.selectedShape.alpha = 1.0;
            }

            drawV.selectedShape = "noShape";
            drawV.editView.edit(drawV.selectedShape);
            drawV.editViewShow = false;
            drawV.draw();
            drawV.editView.draw(drawV.context);

        }else {
            if(shape != "editView"){
                drawV.selectedShape = shape;
                //编辑模式
                if (drawV.mode == 1){
                    switch (shape.shapeType){
                       case "Rect":
                       case "RectTable":
                       case "Aisle":
                       case "Partition":
                       case "Toilet":
                       case "Exit":
                       case "Cashier":
                       case "Entrance":
                       case "BarCounter":
                       case "TextArea":
                           drawV.editView = new DBCanvas.RectEditView();
                           break;
                       case "Arc":
                       case "ArcTable":
                           drawV.editView = new DBCanvas.ArcEditView();
                           break;
                        case "Line":
                            DBCanvas.Tools.print("点击了直线");
                            break;
                       default:
                           break;
                }

                    drawV.editView.edit(drawV.selectedShape);
                    drawV.editViewShow = true;
                }
                //使用模式
                if(drawV.mode == 2){
                    // var j=0;
                    // drawV.shapes.forEach(function (shape) {
                    //     if (shape == drawV.selectedShape){
                    //         shape.alpha = 0.5;
                    //     }else {
                    //         shape.alpha = 1;
                    //     }
                    //     j++;
                    // });

                    // drawV.draw();
                    // DBCanvas.Tools.print("count:"+j);

                    //性能优化
                    drawV.selectedShape.alpha = 0.5;
                    drawV.selectedShape.draw(drawV.context);
                    if (drawV.preSelectShape != undefined && drawV.preSelectShape != drawV.selectedShape){
                        drawV.preSelectShape.alpha = 1.0;
                        drawV.preSelectShape.draw(drawV.context);
                    }

                    if (drawV.preSelectShape != drawV.selectedShape){
                        drawV.preSelectShape = drawV.selectedShape;
                    }


                    drawV.editView.edit("noShape");
                    drawV.editView.draw(drawV.context);

                }


            }else {//此时点击的是编辑视图
                // DBCanvas.Tools.print(drawV.editView.clickedArea);
                //设置编辑试图被点击的点
                drawV.editView.mouseDownCursor(drawV.clickedArea,
                                            drawV.canvas);
            }

            drawV.draw();

            drawV.editView.downPoint = new Point(event.offsetX,event.offsetY);

            drawV.editView.draw(drawV.context);
        }

    }

    //鼠标移动
    drawV.canvas.onmousemove = function (event) {

        if(drawV.MouseButton != 1)
            return;

        drawV.mouseMovePoint = new Point(event.offsetX,event.offsetY);


        var offX = drawV.mouseMovePoint.x - drawV.mouseDownPoint.x;
        var offY = drawV.mouseMovePoint.y - drawV.mouseDownPoint.y;

        if(drawV.mode==2){
            return;
        }
        //移动时
        if (drawV.editView.moveAble == true){

            drawV.editView.shape.minX += offX;
            drawV.editView.shape.maxX += offX;
            drawV.editView.shape.minY += offY;
            drawV.editView.shape.maxY += offY;

            drawV.editView.minX += offX;
            drawV.editView.maxX += offX;
            drawV.editView.minY += offY;
            drawV.editView.maxY += offY;

            drawV.mouseDownPoint = drawV.mouseMovePoint;
            // drawV.editView.draw(drawV.context);
        }


        if(drawV.editView.editAble == true){

            if (drawV.clickedArea == 0){
                drawV.canvas.style.cursor = "move";
                drawV.editView.moveAble = true;
            }else {
                drawV.canvas.style.cursor = "auto";
            }


            drawV.editView.movePoint = drawV.mouseMovePoint;

            // DBCanvas.Tools.print("drawVC:"+drawV.clickedArea);
            //
            // DBCanvas.Tools.print("editVC:"+drawV.editView.clickedArea);

            // ！！！！一定要传入drawV.clickedArea，
            // 传入drawV.editView.clickedArea的话会取到0，导致操作不准确
            drawV.editView.mouseMoveHandle(drawV.clickedArea,
                                            drawV.canvas,
                                            event,drawV.mouseDownPoint);

        }

        drawV.editView.edit(drawV.selectedShape);
        drawV.draw();
        // drawV.context.clearRect(drawV.editView.shape.minX,drawV.editView.shape.minY,200,200);
        // drawV.editView.shape.draw(drawV.context);
        // drawV.context.clearRect(drawV.editView.minX,drawV.editView.minY,200,200);
        drawV.editView.draw(drawV.context);
    }


    //键盘按钮监听
    document.onkeydown = function (e) {
        // DBCanvas.Tools.print(e.keyCode);
        //点击删除键 删除所选图形
        if(e.keyCode==8){
            drawV.removeShape();
        }
    }
    //鼠标抬起
    drawV.canvas.onmouseup = function (event) {
        drawV.MouseButton=0;

        drawV.canvas.style.cursor = "auto";
        drawV.editView.moveAble = false;
        drawV.editView.editAble = false;

        // alert("11");

        // if (drawV.editShape != undefined){
        //
        //     //！！！！让之前的点击的编辑点失效
        //     drawV.editView.clickedPoint = undefined;
        // }
    }

    drawV.canvas.oncontextmenu = function (e) {
        //alert(e);
        e.preventDefault();
    }

    //鼠标移出
    drawV.canvas.onmouseout = function () {
         if (drawV.editShape != undefined){
            drawV.editShape.editAble = false;
            drawV.editShape = undefined;
        }
    }

    //双击
    drawV.canvas.ondblclick = function (event) {

        // alert(drawV.selectedShape.globalCompositeOperation);
        if (drawV.selectedShape.globalCompositeOperation == "source-over"){
            drawV.selectedShape.globalCompositeOperation = "destination-over";
        }else {
            drawV.selectedShape.globalCompositeOperation = "source-over";
        }

        drawV.selectedShape.draw(drawV.context);
        // drawV.draw();
    }

    drawV.canvas.onclick = function (event) {
        // alert(event.offsetX);
    }

    return drawV;
}


//矩形编辑视图
DBCanvas.RectEditView = function () {
    var view= new DBCanvas.EditView("rectEditView");

    //记录鼠标点击的坐标和移动时的点坐标
    view.downPoint = 0;
    view.movePoint = 0;

    view.edit = function (shape) {

        view.shape = shape;
        view.rotateAngle = shape.rotateAngle;


        //清空保存编辑区域的数组！！！
        view.editAreas.splice(0,view.editAreas.length);

        if(shape == "noShape"){

            // view.editAreas.splice(0,view.editAreas.length);
            view.minX = 0;
            view.maxX = 0;
            view.minY = 0;
            view.maxY = 0;
            view.editAble = false;
            view.moveAble = false;
        }else {


            view.minX = shape.minX;
            view.minY = shape.minY;
            view.maxX = shape.maxX;
            view.maxY = shape.maxY;

            //左右边长
            var LRHeight = shape.maxY - shape.minY;
            //上下边长
            var UDWidth = shape.maxX - shape.minX;

            //移动区
            view.editAreas.push({x:view.minX-1,y:view.minY-1,
                                width:view.maxX-view.minX+2,height:view.maxY-view.minY+2});

            //设置每个角的编辑区域宽为editW
            var editW = 10;
            //左上角
            view.editAreas.push({x:view.minX-0.5*editW,y:view.minY-0.5*editW,
                                width:editW,height:editW});
            //右上角
            view.editAreas.push({x:view.maxX-0.5*editW,y:view.minY-0.5*editW,
                                width:editW,height:editW});
            //右下角
            view.editAreas.push({x:view.maxX-0.5*editW,y:view.maxY-0.5*editW,
                                width:editW,height:editW});
            //左下角
            view.editAreas.push({x:view.minX-0.5*editW,y:view.maxY-0.5*editW,
                                width:editW,height:editW});
            //左边中心点
            view.editAreas.push({x:view.minX-0.5*editW,y:view.minY + LRHeight*0.5-0.5*editW,
                                width:editW,height:editW});
            //上边中心点
            view.editAreas.push({x:view.minX + UDWidth*0.5-0.5*editW,y:view.minY-0.5*editW,
                                width:editW,height:editW});
            //右边中心点
            view.editAreas.push({x:view.maxX-0.5*editW,y:view.minY + LRHeight*0.5-0.5*editW,
                                width:editW,height:editW});
            //下边中心点
            view.editAreas.push({x:view.minX + UDWidth*0.5-0.5*editW,y:view.maxY-0.5*editW,
                                width:editW,height:editW});
            //旋转点
            if(view.minY-LRHeight*0.45-0.5*editW > 20 && view.minY-1>26){
                view.editAreas.push({x:view.minX+UDWidth*0.5-0.5*editW,y:view.minY-LRHeight*0.45-0.5*editW,
                                width:editW,height:editW});
            }else if(view.minY-1>26){
                view.editAreas.push({x:view.minX+UDWidth*0.5-0.5*editW,y:20,
                                width:editW,height:editW});
            }

        }

    }


    view.mouseDownCursor = function (point,canvas) {
        switch (point){
                case 0://中间区域

                    canvas.style.cursor = "move";
                    view.moveAble = true;
                    view.editAble = false;
                    break;
                case 1://左上角

                    canvas.style.cursor = "nw-resize";
                    view.moveAble = false;
                    view.editAble = true;
                    break;
                case 2://右上角

                    canvas.style.cursor = "ne-resize";
                    view.moveAble = false;
                    view.editAble = true;
                    break;
                case 3://右下角

                    canvas.style.cursor = "se-resize";
                    view.moveAble = false;
                    view.editAble = true;
                    break;
                case 4://左下角

                    canvas.style.cursor = "sw-resize";
                    view.moveAble = false;
                    view.editAble = true;
                    break;
                case 5 :
                case 7 ://左边中心和右边中心
                    canvas.style.cursor = "ew-resize";
                    view.moveAble = false;
                    view.editAble = true;
                    break;
                case 6:
                case 8://上边和下边中心
                    canvas.style.cursor = "ns-resize";
                    view.moveAble = false;
                    view.editAble = true;
                    break;
                case 9://旋转
                    canvas.style.cursor = "";
                    view.moveAble = false;
                    view.editAble = true;
                    break;
                default:
                    break;
            }
    }

    view.mouseMoveHandle = function (clickedArea,canvas,event,downPoint) {

        // DBCanvas.Tools.print("move:"+ clickedArea);

        switch (clickedArea){

                case 1://lefttop
                {
                    // if(event.offsetX > (view.maxX-30) || event.offsetY > (view.maxY-30)) return;
                    view.minY = event.offsetY;
                    view.minX = event.offsetX;

                    view.shape.minY = event.offsetY;
                    view.shape.minX = event.offsetX;

                   canvas.style.cursor = "nw-resize";
                }
                break;
                case 2://righttop
                {
                    // if(event.offsetX < (view.minX+30) || event.offsetY > (view.maxY-30)) return;
                    view.minY = event.offsetY;
                    view.maxX = event.offsetX;

                    view.shape.minY = event.offsetY;
                    view.shape.maxX = event.offsetX;

                    canvas.style.cursor = "ne-resize";

                }
                break;
                case 3://rightbottom
                {
                    // if(event.offsetX < (view.minX+30) || event.offsetY < (view.minY+30)) return;
                    view.maxY = event.offsetY;
                    view.maxX = event.offsetX;

                    view.shape.maxY = event.offsetY;
                    view.shape.maxX = event.offsetX;

                    canvas.style.cursor = "se-resize";
                }
                break;
                case 4://leftbottom
                {
                    // if(event.offsetY < (view.minY+30) || event.offsetX > (view.maxX-30)) return;
                    view.maxY = event.offsetY;
                    view.minX = event.offsetX;

                    view.shape.maxY = event.offsetY;
                    view.shape.minX = event.offsetX;

                    canvas.style.cursor = "sw-resize";
                }
                break;


                case 5 ://leftcenter
                {
                    // if(event.offsetX > (view.maxX-30)) return;
                    view.minX = event.offsetX;
                    view.shape.minX = event.offsetX;
                    canvas.style.cursor = "ew-resize";
                }
                break;
                case 6://topcenter
                {
                    // if (event.offsetY > (view.maxY-30)) return;
                    view.minY = event.offsetY;
                    view.shape.minY = event.offsetY;
                    canvas.style.cursor = "ns-resize";
                }
                break;
                case 7 ://rightcenter
                {
                    // if (event.offsetX < (view.minX+30)) return;
                    view.maxX = event.offsetX;
                    view.shape.maxX = event.offsetX;
                    canvas.style.cursor = "ew-resize";
                }
                break;
                case 8://bottomcenter
                {
                    // if(event.offsetY < (view.minY+30)) return;
                    view.maxY = event.offsetY;
                    view.shape.maxY = event.offsetY;
                    canvas.style.cursor = "ns-resize";
                }
                break;
                case 9 ://rotate
                {
                    var dx = view.movePoint.x-view.downPoint.x;
                    var dy = view.movePoint.y-view.downPoint.y;

                    // DBCanvas.Tools.print("dy:"+ dy);
                    // DBCanvas.Tools.print("dx:"+ dx);
                    // var tanV = Math.abs(dy)/ Math.abs(dx);

                    var tanV = dy/dx;
                    //atan的取值范围为-90~90
                    view.shape.rotateAngle = Math.atan(tanV);

                    canvas.style.cursor = "pointer";
                }
                break;
                default:
                    break;
            }

    }

    view.draw = function (context) {
        // DBCanvas.Tools.print("x:"+view.downPoint.x);
        // DBCanvas.Tools.print("y:"+view.downPoint.y);

        context.save();

        //旋转控制
        context.translate((view.minX+view.maxX)*0.5,(view.minY+view.maxY)*0.5);
        context.rotate(view.rotateAngle);
        context.translate(-(view.minX+view.maxX)*0.5,-(view.minY+view.maxY)*0.5);

        // DBCanvas.Tools.print("drawFunc---length:"+view.editAreas.length);

         view.editAreas.forEach(function (area, index) {
            context.beginPath();
            context.strokeStyle = "black";
            context.lineWidth = 1;
            if(index == 9){
                context.arc(area.x+area.width*0.5,
                            area.y+area.height*0.5,
                            area.width*0.5,
                            0,
                            Math.PI*2);
                context.moveTo(area.x+area.width*0.5,area.y);
                context.lineTo(area.x+area.width*0.15,area.y-area.width*0.2);
                context.moveTo(area.x+area.width*0.5,area.y);
                context.lineTo(area.x+area.width*0.2,area.y+area.width*0.5);
            }else {
                context.rect(area.x,area.y,area.width,area.height);
            }

            context.stroke();
            //点击测试 使用正序遍历时会出现一个情况：点击重叠区域时会检测到两个区域；
            if(context.isPointInPath(view.downPoint.x,view.downPoint.y)){
               view.clickedArea = index;
               // DBCanvas.Tools.print("index:"+index);
            }
        });

        context.restore();
    }

    view.hitEvent = function (x,y) {

        //DBCanvas.Tools.print(view.clickedArea);

         if (view.clickedArea != undefined){
            return true;
        }else {
            return false;
        }

    }

    return view;
}

//圆形编辑视图
DBCanvas.ArcEditView = function () {


    var view = new DBCanvas.EditView("arcEditView");

    view.edit = function (shape) {
       view.shape = shape;
        //清空5个编辑区域的数组
       view.editAreas.splice(0,view.editAreas.length);
        if (shape != undefined && shape.shapeType != "editView")
        {
            view.minX = shape.minX;
            view.minY = shape.minY;
            view.maxX = shape.maxX;
            view.maxY = shape.maxY;

            //左右边长
            var LRHeight = shape.maxY - shape.minY;
            //上下边长
            var UDWidth = shape.maxX - shape.minX;

            var editW = 10;
            //移动区域（圆形区域）
            view.editAreas.push({x:(view.maxX + view.minX)*0.5,y:(view.minY+view.maxY)*0.5,r:LRHeight*0.5+1});

            //左边中心点
            view.editAreas.push({x:view.minX-0.5*editW,y:view.minY + LRHeight*0.5-0.5*editW,
                                width:editW,height:editW});
            //上边中心点
            view.editAreas.push({x:view.minX + UDWidth*0.5-0.5*editW,y:view.minY-0.5*editW,
                                width:editW,height:editW});
            //右边中心点
            view.editAreas.push({x:view.maxX-0.5*editW,y:view.minY + LRHeight*0.5-0.5*editW,
                                width:editW,height:editW});
            //下边中心点
            view.editAreas.push({x:view.minX + UDWidth*0.5-0.5*editW,y:view.maxY-0.5*editW,
                                width:editW,height:editW});

        }
        if (shape == undefined){
            view.minX = 0;
            view.maxX = 0;
            view.minY = 0;
            view.maxY = 0;
            view.editAble = false;
            view.moveAble = false;
        }
    }


    view.mouseDownCursor = function (point,canvas) {

        switch (point){
                case 3://rightCenter
                case 1 ://leftCenter
                    canvas.style.cursor = "ew-resize";
                    view.moveAble = false;
                    view.editAble = true;
                    break;
                case 2://topCenter
                case 4://bottomCenter
                    canvas.style.cursor = "ns-resize";
                    view.moveAble = false;
                    view.editAble = true;
                    break;
                case 0://innerView
                    canvas.style.cursor = "move";
                    view.moveAble = true;
                    view.editAble = false;
                    break;
                default:
                    break;
            }

    }

    view.mouseMoveHandle = function (clickedArea,canvas,event,downPoint) {
        switch (clickedArea){


                case 1://leftCenter
                {

                    if(event.offsetX > (view.maxX - 50)) return;
                    view.shape.minY += (event.offsetX-downPoint.x)*0.5;
                    view.shape.maxY -= (event.offsetX-downPoint.x)*0.5;
                    view.shape.minX = event.offsetX;
                    view.minY += (event.offsetX-downPoint.x)*0.5;
                    view.maxY -= (event.offsetX-downPoint.x)*0.5;
                    view.minX = event.offsetX;
                    downPoint.x = event.offsetX;

                    // DBCanvas.Tools.print("minY:"+view.minY);
                    canvas.style.cursor = "ew-resize";
                }
                    break;
                case 2://topCenter
                {
                    if(event.offsetY > (view.maxY - 50)) return;
                    view.shape.minX += (event.offsetY-downPoint.y)*0.5;
                    view.shape.maxX -= (event.offsetY-downPoint.y)*0.5;
                    view.shape.minY = event.offsetY;

                    view.minX += (event.offsetY-downPoint.y)*0.5;
                    view.maxX -= (event.offsetY-downPoint.y)*0.5;
                    view.minY = event.offsetY;
                    downPoint.y = event.offsetY;

                    canvas.style.cursor = "ns-resize";
                }
                    break;
                case 3://rightCenter
                {
                    if (event.offsetX < (view.minX + 50)) return;
                    view.shape.minY -= (event.offsetX-downPoint.x)*0.5;
                    view.shape.maxY += (event.offsetX-downPoint.x)*0.5;
                    view.shape.maxX = event.offsetX;

                    view.minY -= (event.offsetX-downPoint.x)*0.5;
                    view.maxY += (event.offsetX-downPoint.x)*0.5;
                    view.maxX = event.offsetX;
                    downPoint.x = event.offsetX;

                    canvas.style.cursor = "ew-resize";
                }
                    break;

                case 4://bottomCenter
                {
                    if (event.offsetY < (view.minY + 50)) return;
                    view.shape.minX -= (event.offsetY-downPoint.y)*0.5;
                    view.shape.maxX += (event.offsetY-downPoint.y)*0.5;
                    view.shape.maxY = event.offsetY;

                    view.minX -= (event.offsetY-downPoint.y)*0.5;
                    view.maxX += (event.offsetY-downPoint.y)*0.5;
                    view.maxY = event.offsetY;

                    downPoint.y = event.offsetY;

                    canvas.style.cursor = "ns-resize";
                }
                    break;
                default:
                    break;
            }

    }

    //绘制
    view.draw = function (context) {
        // DBCanvas.Tools.print(view.editAreas.length);
        view.context = context;
        //绘制边框线
        context.save();

        view.editAreas.forEach(function (area, index) {
            context.beginPath();
            context.strokeStyle = "black";
            context.lineWidth = 1;
            if (index==0){

                context.arc(area.x,area.y,area.r,0,Math.PI*2);

            }else
            {
                context.rect(area.x,area.y,area.width,area.height);
            }
            context.stroke();
            //点击测试 使用正序遍历时会出现一个情况：点击重叠区域时会检测到两个区域；
            if(context.isPointInPath(view.downPoint.x,view.downPoint.y)){
               view.clickedArea = index;
               // DBCanvas.Tools.print("index:"+index);
            }
        });

        context.restore();
    }

    view.hitEvent = function (x,y) {
        // DBCanvas.Tools.print("clickArea:"+view.clickedArea);

        if(view.clickedArea != undefined){
            return true;
        }else {
            return false;
        }
    }
    return view;
}

//编辑视图基类
DBCanvas.EditView = function (type) {
    var view = new Object();
    //旋转角度
    view.rotateAngle = 0;

    view.editViewType = type;
    view.shape = undefined;

    //保存编辑点
    view.points = new Array();

    //编辑区域
    view.editAreas = new Array();


    view.editAble = false;
    view.moveAble = false;

    //用于保存被点击的区域
    view.clickedArea = undefined;

    //标记鼠标点击的点
    view.clickedPoint = undefined;
    view.context = undefined;

    view.minX = undefined;
    Object.defineProperty(view, "MinX", {
        get: function () {

            return view.minX;

        },
        set: function (v) {

            view.minX = v;
        }
    });

    view.minY = undefined;
    Object.defineProperty(view, "MinY", {
        get: function () {

            return view.minY;

        },
        set: function (v) {

            view.minY = v;
        }
    });

    view.maxX = undefined;
    Object.defineProperty(view, "MaxX", {
        get: function () {

            return view.maxX;

        },
        set: function (v) {

            view.maxX = v;
        }
    });

    view.maxY = undefined;
    Object.defineProperty(view, "MaxY", {
        get: function () {

            return view.maxY;

        },
        set: function (v) {

            view.maxY = v;
        }
    });

    view.lineWidth = "1";
    Object.defineProperty(view, "LineWidth", {
        get: function () {

            return view.lineWidth;

        },
        set: function (v) {

            view.lineWidth = v;
        }
    });
    //定义透明度
    view.alpha = 1.0;
    Object.defineProperty(view,"Alpha",{
        get: function () {
            return view.alpha;
        },
        set: function (v) {
            view.alpha = v;
        }
    });

    view.strokeStyle = "black";
    Object.defineProperty(view, "StrokeStyle", {
        get: function () {

            return view.strokeStyle;

        },
        set: function (v) {

            view.strokeStyle = v;
        }
    });

    view.fillStyle = "black";
    Object.defineProperty(view, "FillStyle", {
        get: function () {

            return view.fillStyle;

        },
        set: function (v) {

            view.fillStyle = v;
        }
    });

    //图形组合
    view.globalCompositeOperation = "source-over";
    Object.defineProperty(view, "GlobalCompositeOperation", {
        get: function () {

            return view.globalCompositeOperation;

        },
        set: function (v) {

            view.globalCompositeOperation = v;
        }
    });

    view.edit = function (shape) {

    }

    view.estimatePoint = function (event){}

    view.mouseDownCursor = function (point,canvas) {

    }
    
    view.mouseMoveHandle = function (clickedArea,canvas,event,downPoint) {
        
    }
    view.hitEvent = function (x,y){
        // view.draw(view.drawView.context);
        // return view.drawView.context.isPointInPath(x,y);

    }

    //绘制编辑视图
    view.draw = function (context){

    }

    return view;
}



//图形基类
DBCanvas.Shape = function (type) {
    var shape = new Object();
    shape.shapeType = type;
    shape.shapeClass = "";
    shape.draw = function (context) {

    }

    shape.hitEvent = function (x,y) {
        // alert(shape.shapeType);
        shape.draw(shape.drawView.context);
        return shape.drawView.context.isPointInPath(x,y);
    }

    //设置旋转角度
    shape.rotateAngle = 0;

    shape.minX = undefined;
    Object.defineProperty(shape, "MinX", {
        get: function () {

            return shape.minX;

        },
        set: function (v) {

            shape.minX = v;
        }
    });

    shape.minY = undefined;
    Object.defineProperty(shape, "MinY", {
        get: function () {

            return shape.minY;

        },
        set: function (v) {

            shape.minY = v;
        }
    });

    shape.maxX = undefined;
    Object.defineProperty(shape, "MaxX", {
        get: function () {

            return shape.maxX;

        },
        set: function (v) {

            shape.maxX = v;
        }
    });

    shape.maxY = undefined;
    Object.defineProperty(shape, "MaxY", {
        get: function () {

            return shape.maxY;

        },
        set: function (v) {

            shape.maxY = v;
        }
    });

    shape.lineWidth = "1";
    Object.defineProperty(shape, "LineWidth", {
        get: function () {

            return shape.lineWidth;

        },
        set: function (v) {

            shape.lineWidth = v;
        }
    });
    //定义透明度
    shape.alpha = 1.0;
    Object.defineProperty(shape,"Alpha",{
        get: function () {
            return shape.alpha;
        },
        set: function (v) {
            shape.alpha = v;
        }
    });

    shape.strokeStyle = "black";
    Object.defineProperty(shape, "StrokeStyle", {
        get: function () {

            return shape.strokeStyle;

        },
        set: function (v) {

            shape.strokeStyle = v;
        }
    });

    shape.fillStyle = "black";
    Object.defineProperty(shape, "FillStyle", {
        get: function () {

            return shape.fillStyle;

        },
        set: function (v) {

            shape.fillStyle = v;
        }
    });

    //图形组合
    shape.globalCompositeOperation = "source-over";
    Object.defineProperty(shape, "GlobalCompositeOperation", {
        get: function () {

            return shape.globalCompositeOperation;

        },
        set: function (v) {

            shape.globalCompositeOperation = v;
        }
    });


    return shape;
}


//直线
DBCanvas.Line = function (x1,y1,x2,y2) {
    var shape = new DBCanvas.Shape("Line");
    //起点x
    shape.fromPoint_X = 0;
    Object.defineProperty(shape,"FromPoint_X",{
       set:function (v) {
           shape.fromPoint_X = v;
       },
       get:function () {
           return shape.fromPoint_X;
       }
    });
    //起点y
    shape.fromPoint_Y = 0;
    Object.defineProperty(shape,"FromPoint_Y",{
       set:function (v) {
           shape.fromPoint_Y = v;
       },
       get:function () {
           return shape.fromPoint_Y;
       }
    });
    //终点x
    shape.toPoint_X = 0;
    Object.defineProperty(shape,"ToPoint_X",{
       set:function (v) {
           shape.toPoint_X = v;
       },
       get:function () {
           return shape.toPoint_X;
       }
    });
    //终点y
    shape.toPoint_Y = 0;
    Object.defineProperty(shape,"ToPoint_Y",{
       set:function (v) {
           shape.toPoint_Y = v;
       },
       get:function () {
           return shape.toPoint_Y;
       }
    });


    shape.draw = function (context) {
        context.save();
        context.beginPath();

        context.strokeStyle = shape.strokeStyle;
        context.lineWidth = shape.lineWidth;
        context.moveTo(shape.fromPoint_X, shape.fromPoint_Y);
        context.lineTo(shape.toPoint_X, shape.toPoint_Y);
        context.globalAlpha = shape.alpha;
        context.stroke();
        context.closePath();
        context.restore();
    }



    if (x1 != undefined) {
        shape.fromPoint_X = x1;
        shape.fromPoint_Y = y1;
        shape.toPoint_X = x2;
        shape.toPoint_Y = y2;
    }
    return shape;
}


//矩形+圆角矩形
DBCanvas.Rect = function (x,y,width,height) {
    var shape = new DBCanvas.Shape("Rect");
    shape.shapeClass = "DBCanvas.Rect";
    shape.draw = function (context) {
        context.save();

        var p1 = shape.fromPoint;
        context.beginPath();

        //图形旋转
        context.translate((shape.minX+shape.maxX)*0.5,(shape.minY+shape.maxY)*0.5);
        context.rotate(shape.rotateAngle);
        context.translate(-(shape.minX+shape.maxX)*0.5,-(shape.minY+shape.maxY)*0.5);

        context.strokeStyle = shape.strokeStyle;
        context.lineWidth = shape.lineWidth;


        if (shape.cornerRadius <= 0 ||
            shape.cornerRadius >(shape.maxX-shape.minX)*0.5 ||
            shape.cornerRadius >(shape.maxY-shape.minY)*0.5){

            context.rect(shape.minX, shape.minY, shape.maxX-shape.minX, shape.maxY-shape.minY);

        }else {
            context.moveTo(shape.minX+shape.cornerRadius,shape.minY);
            context.lineTo(shape.maxX-shape.cornerRadius,shape.minY);
            // context.strokeStyle = "blue";

            context.arcTo(shape.maxX,shape.minY,shape.maxX,shape.minY+shape.cornerRadius,shape.cornerRadius);
            context.arcTo(shape.maxX,shape.maxY,shape.maxX-shape.cornerRadius,shape.maxY,shape.cornerRadius);
            context.arcTo(shape.minX,shape.maxY,shape.minX,shape.maxY-shape.cornerRadius,shape.cornerRadius);
            context.arcTo(shape.minX,shape.minY,shape.minX+shape.cornerRadius,shape.minY,shape.cornerRadius);
            context.closePath();
        }

        context.fillStyle = shape.fillStyle;
        // context.scale(shape.scale.x,shape.scale.y);
        context.globalCompositeOperation = shape.globalCompositeOperation;
        context.globalAlpha = shape.alpha;
        context.stroke();
        context.fill();
        context.restore();
    }

    shape.cornerRadius = 0;
    Object.defineProperty(shape,"CornerRadius",{
        get: function () {
            return shape.cornerRadius;
        },
        set: function (v) {
                shape.cornerRadius = v;
            }

    });

    shape.fromPoint = { x: 0, y: 0 };
    Object.defineProperty(shape, "FromPoint", {
        get: function () {

            return shape.fromPoint;

        },
        set: function (v) {

            shape.fromPoint = v;
        }
    });

    shape.width = 8;
    Object.defineProperty(shape, "Width", {
        get: function () {

            return shape.width;

        },
        set: function (v) {

            shape.width = v;
        }
    });

    shape.height=8;
    Object.defineProperty(shape, "Height", {
        get: function () {

            return shape.height;

        },
        set: function (v) {

            shape.height = v;
        }
    });

    shape.scale = {x:1.0,y:1.0};
    Object.defineProperty(shape,"Scale",{
       get:function () {
           return shape.scale;
       },
       set:function (v) {
           shape.scale = v;
       }
    });

    if (x != undefined && y != undefined && width != undefined && height != undefined) {
        shape.fromPoint.x = x;
        shape.fromPoint.y = y;
        shape.height = height;
        shape.width = width;

        shape.minX = x;
        shape.minY = y;
        shape.maxX = x+width;
        shape.maxY = y+height;
    }

    return shape;
}


//圆形
DBCanvas.Arc = function (x,y,radius,startAngle,endAngle,anticlockwise) {
    var shape = new DBCanvas.Shape("Arc");


    shape.draw = function (context) {
        context.save();
        context.beginPath();
        // context.moveTo(x,y);
        context.fillStyle  = shape.fillStyle;
        //半径
        var r = 0;
        if (shape.maxX - shape.minX <= shape.maxY - shape.minY){
            r = (shape.maxX - shape.minX)*0.5;
        }else {
            r = (shape.maxY - shape.minY)*0.5;
        }
        context.arc((shape.maxX + shape.minX)*0.5,
                    (shape.maxY + shape.minY)*0.5,
                    r,
                    startAngle,
                    endAngle,
                    anticlockwise);
        context.globalCompositeOperation = shape.globalCompositeOperation;
        context.strokeStyle = shape.strokeStyle;
        // context.lineWidth = shape.lineWidth;
        context.globalAlpha = shape.alpha;
        context.stroke();
        context.fill();
        // context.closePath();
        context.restore();
    }

    if(x != undefined && y != undefined && radius != undefined
        && startAngle != undefined && endAngle != undefined){
        shape.minX = x-radius;
        shape.minY = y-radius;
        shape.maxX = x+radius;
        shape.maxY = y+radius;
    }

    return shape;
}


//箭头
DBCanvas.Arrow = function (x,y,w) {
    
}

//规则多边形
DBCanvas.Polygon = function (xCenter,yCenter,radius,numSides) {
    var shape = new DBCanvas.Shape("Polygon");
    shape.draw = function (context) {
        context.save();
        context.beginPath();
        //计算出第一个顶点
        var xPos = xCenter + radius * Math.cos(2 * Math.PI * 0 / numSides);
        var yPos = yCenter + radius * Math.sin(2 * Math.PI * 0 / numSides);
        context.moveTo(xPos,yPos);
        //循环计算出其余顶点
        for (var i=1; i<=numSides; i++){
            var xPos = xCenter + radius * Math.cos(2 * Math.PI * i / numSides);
            var yPos = yCenter + radius * Math.sin(2 * Math.PI * i / numSides);
            context.lineTo(xPos,yPos);
        }
        context.closePath();

        context.lineWidth = 2;
        context.lineJoin = 'round';
        context.stroke();

        context.fillStyle = '#00F';
        context.fill();


        context.restore();
    }

    return shape;
}


//圆桌
DBCanvas.ArcTable = function (xPos,yPos,r) {
    var shape = new DBCanvas.Shape("ArcTable");

    shape.shapeClass = "DBCanvas.ArcTable";
    //餐桌颜色
    shape.tableColor = "white";
    Object.defineProperty(shape,"TableColor",{
       get:function () {
           return shape.tableColor;
       },
       set:function (v) {
           shape.tableColor = v;
       }
    });
    //凳子颜色
    shape.deskColor = "white";
    Object.defineProperty(shape,"DeskColor",{
       get:function () {
           return shape.deskColor;
       },
       set:function (v) {
           shape.deskColor = v;
       }
    });
    //就餐人数
    shape.personCount = 5;
    Object.defineProperty(shape,"PersonCount",{
       get:function () {
           return shape.personCount;
       },
       set:function (v) {
           shape.personCount = v;
       }
    });
    //餐桌编号
    shape.tableNum = "B046";
    Object.defineProperty(shape,"TableNum",{
       get:function () {
           return shape.tableNum;
       },
       set:function (v) {
           shape.tableNum = v;
       }
    });

    //设置最小、最大X轴、y轴值；
    if (xPos != undefined && yPos != undefined && r != undefined){
        shape.minX = xPos-r;
        shape.maxX = xPos+r;
        shape.minY = yPos-r;
        shape.maxY = yPos+r;
    }

    shape.draw = function (context) {
        var radius = (shape.maxX - shape.minX)*0.5;
        var x = shape.minX + radius;
        var y = shape.minY + radius;



        context.save();
        context.beginPath();
        // context.strokeStyle = shape.strokeStyle;
        // shape.lineWidth = 1;

        // context.closePath();

        var radial = context.createRadialGradient(x,y,1,x,y,0.6*radius);
        radial.addColorStop(0,'#FBE9D2');
          radial.addColorStop(0.3,'#FAD8B4');
          radial.addColorStop(0.8,'#F7CA9D');
          radial.addColorStop(1,'#F7BB8A');

        //圆桌大小

        context.lineWidth = 0;
        context.globalAlpha = shape.alpha;
        context.fillStyle = shape.tableColor;
        context.strokeStyle = shape.strokeStyle;
        context.arc(x,y,radius*0.6,0,Math.PI*2);
        // context.fillText("餐桌",x-10,y);
        context.stroke();
        context.fill();
        // context.closePath();

        //配置凳子
        var sitR = 0.2*radius;
        var sitAngle = Math.PI*2/shape.personCount;

        var beginAngle = 0;
        var endAngle = 0;


        //循环画出凳子
        for (var i=0; i<shape.personCount; i++){
            context.beginPath();
            endAngle = Math.PI*2*(i+1)/shape.personCount;
            context.strokeStyle = shape.deskColor;
            context.lineWidth = 0.12*radius;
            context.globalAlpha = shape.alpha;
            context.arc(x,y,0.75*radius,beginAngle + sitAngle*0.2,endAngle - sitAngle*0.2,false);
            context.stroke();
            beginAngle = endAngle;
        }


        //刀叉

        DBCanvas.Tools.drawFork(context,x-0.15*radius,y-0.5*radius,radius*0.14,radius*0.5);
        context.globalAlpha = shape.alpha;
        DBCanvas.Tools.drawKnife(context,x+0.1*radius,y-0.47*radius,radius*0.1,radius*0.45);

        //循环计算出每个凳子的矩形四个点
        for (var i=0; i<shape.personCount; i++){
            var xPeak = x + 0.55*radius * Math.cos(2 * Math.PI * i / shape.personCount);
            var yPeak = y + 0.55*radius * Math.sin(2 * Math.PI * i / shape.personCount);

            var xPeak1 = x + 0.55*radius * Math.cos(2 * Math.PI * (i+1) / shape.personCount);
            var yPeak1 = y + 0.55*radius * Math.sin(2 * Math.PI * (i+1) / shape.personCount);
            //
            var xCenter = (xPeak1 + xPeak)*0.5;
            var yCenter = (yPeak1 + yPeak)*0.5;

            var sideLength = Math.sqrt(Math.pow((xPeak1-xPeak),2) + Math.pow((yPeak1-yPeak),2));

            /*
            * 正多边形的每个内角是 2*Math.PI/count
            *
            * 倾斜角度为Math.PI/count
            * */
            var angle = Math.PI*(i+1)/shape.personCount;

            //假设椅子的宽度为10;/
            var sitW = 10;
            //椅子长度
            var sitL = 0.8*sideLength;

        }
        // context.closePath();

        //桌子编号
        context.textAlign = "center";
        context.font = "20px '宋体'";
        context.font = context.font.replace(/\d+(\.\d+)?(px|pt|em|%)/i,radius*0.42+"px");//替换字体大小
        context.fillText(shape.tableNum,x,y+0.32*radius);

        //圆桌总体外框
        context.beginPath();
        context.lineWidth = 0;
        context.strokeStyle = 'transparent';
        context.arc(x,y,radius,0,Math.PI*2);
        context.stroke();
        context.restore();
    }

    shape.Serialization = function () {
        var json = {
                    shapeClass:shape.shapeClass,
                    shapeType:shape.shapeType,
                    alpha:shape.alpha,
                    minX:shape.minX,
                    minY:shape.minY,
                    maxX:shape.maxX,
                    maxY:shape.maxY,
                    deskColor:shape.deskColor,
                    tableColor:shape.tableColor,
                    personCount:shape.personCount,
                    tableNum:shape.tableNum
                    };
        // DBCanvas.Tools.print(JSON.stringify(json));
        return JSON.stringify(json);
    }

    shape.DeSerialization = function () {
        var json = shape.Serialization();
        var obj = JSON.parse(json);
        DBCanvas.Tools.print(obj.shapeClass);
    }

    return shape;

}


//方桌
DBCanvas.RectTable = function (xPos,yPos,w,h) {
    var shape = new DBCanvas.Shape("RectTable");
    shape.shapeClass = "DBCanvas.RectTable";
    //桌子颜色属性
    shape.tableColor = "white";
    Object.defineProperty(shape,"TableColor",{
        set:function (v) {
            shape.tableColor = v;
        },
        get:function () {
            return shape.tableColor;
        }
    });
    //凳子的颜色属性
    shape.deskColor = "#F7BB8A";
    Object.defineProperty(shape,"DeskColor",{
       get:function () {
           return shape.deskColor;
       },
       set:function (v) {
           shape.deskColor = v;
       }
    });
    //就餐人数
    shape.personCount = 6;
    Object.defineProperty(shape,"PersonCount",{
       get:function () {
           return shape.personCount;
       },
       set:function (v) {
           shape.personCount = v;
       }
    });
    //餐桌编号
    shape.tableNum = "AAA";
    Object.defineProperty(shape,"TableNum",{
       get:function () {
           return shape.tableNum;
       },
       set:function (v) {
           shape.tableNum = v;
       }
    });

    shape.draw = function (context) {
        context.save();
        context.translate((shape.minX+shape.maxX)*0.5,(shape.minY+shape.maxY)*0.5);
        context.rotate(shape.rotateAngle);
        context.translate(-(shape.minX+shape.maxX)*0.5,-(shape.minY+shape.maxY)*0.5);

        context.beginPath();

        context.strokeStyle = shape.strokeStyle;
        context.lineWidth = shape.lineWidth;


        //整体的左上角位置
        var x = shape.minX;
        var y = shape.minY;
        //宽度
        var width = shape.maxX-shape.minX;
        //高度
        var height = shape.maxY - shape.minY;
        //每侧座位数
        var sitC = shape.personCount/2;
        //每个椅子所占宽度
        var sitW = width/(1.5*sitC + 0.5);
        //椅子的圆角半径
        var sitRadius = 0.1*sitW;
        //桌子的圆角半径
        var radius = 0.1*height;

        //整体边框
        // context.rect(shape.minX, shape.minY, width, height);

        /*
        * radial.addColorStop(0,'#FBE9D2');
          radial.addColorStop(0.3,'#FAD8B4');
          radial.addColorStop(0.8,'#F7CA9D');
          radial.addColorStop(1,'#F7BB8A');
        *
        * */

        // var linear = context.createLinearGradient(  x+radius,y+height*0.15,
        //                                             x+width,y+height*0.15);
        // linear.addColorStop(0.2,'#FBE9D2');
        // linear.addColorStop(0.4,'#FAD8B4');
        // linear.addColorStop(0.7,'#F7CA9D');
        // linear.addColorStop(1.0,'#F7BB8A');
        //桌子
        context.fillStyle = shape.tableColor;
        context.globalAlpha = shape.alpha;
        context.moveTo(x+radius,y+height*0.15);
        context.lineTo(x+width-radius,y+height*0.15);
        context.arcTo(x+width,y+height*0.15,x+width,y+height*0.15+radius,radius);
        context.arcTo(x+width,y+height*0.85,x+width-radius,y+height*0.85,radius);
        context.arcTo(x,y+height*0.85,x,y+height*0.85-radius,radius);
        context.arcTo(x,y+height*0.15,x+radius,y+height*0.15,radius);
        context.stroke();
        context.fill();


        //椅子
        context.beginPath();
        context.fillStyle = shape.deskColor;
        for(var i=0; i<sitC; i++){
            context.globalAlpha = shape.alpha;

            context.moveTo(x+0.5*sitW + i*1.5*sitW,y+height*0.11);

            context.lineTo(x+0.5*sitW + i*1.5*sitW,y+sitRadius);

            context.arcTo(  x+0.5*sitW + i*1.5*sitW,
                            y,
                            x+0.5*sitW + i*1.5*sitW + sitRadius,
                            y,
                            sitRadius);
            context.arcTo(x+0.5*sitW + i*1.5*sitW+sitW,
                            y,
                            x+0.5*sitW + i*1.5*sitW+sitW,
                            y+height*0.11,
                            sitRadius);
            context.lineTo(x+0.5*sitW + i*1.5*sitW+sitW,y+height*0.11);

            context.arc(x+0.5*sitW + i*1.5*sitW+sitW-2,y+height*0.11,2,0,Math.PI);
            context.bezierCurveTo(  x+0.5*sitW + i*1.5*sitW+sitW-4,
                                    y+height*0.11-sitW*0.1,
                                    x+0.5*sitW + i*1.5*sitW+4,
                                    y+height*0.11-sitW*0.1,
                                    x+0.5*sitW + i*1.5*sitW+4,
                                    y+height*0.11);
            context.arc(x+0.5*sitW + i*1.5*sitW+2,
                        y+height*0.11,
                        2,
                        0,
                        Math.PI);

            // context.stroke();


            context.moveTo(x+0.5*sitW + i*1.5*sitW,y+height*0.89);
            context.lineTo(x+0.5*sitW + i*1.5*sitW,y+height-sitRadius);
            context.arcTo(x+0.5*sitW + i*1.5*sitW,
                            y+height,
                            x+0.5*sitW + i*1.5*sitW+sitRadius,
                            y+height,
                            sitRadius);
            context.arcTo(  x+0.5*sitW + i*1.5*sitW+sitW,
                            y+height,
                            x+0.5*sitW + i*1.5*sitW+sitW,
                            y+height-sitRadius,
                            sitRadius);
            context.lineTo( x+0.5*sitW + i*1.5*sitW+sitW,
                            y+height*0.89
                            );

            context.arc(x+0.5*sitW + i*1.5*sitW+sitW-2,
                        y+height*0.89,
                        2,
                        Math.PI*2,
                        Math.PI,true);
            context.bezierCurveTo(  x+0.5*sitW + i*1.5*sitW+sitW-4,
                                    y+height*0.89+0.1*sitW,
                                    x+0.5*sitW + i*1.5*sitW+4,
                                    y+height*0.89+0.1*sitW,
                                    x+0.5*sitW + i*1.5*sitW+4,
                                    y+height*0.89);
            context.arc(x+0.5*sitW + i*1.5*sitW+2,
                        y+height*0.89,
                        2,
                        Math.PI*2,
                        Math.PI,
                        true);

            // context.arcTo()

            // context.rect(x+0.5*sitW + i*1.5*sitW,y,sitW,height*0.11);
            // context.rect(x+0.5*sitW + i*1.5*sitW,y+height*0.89,sitW,height*0.11);
        }
        context.fill();
        context.stroke();

        //餐盘
        for(var i=0; i<sitC; i++){

            context.beginPath();
            context.lineWidth = 0.5;
            context.globalAlpha = 0.5;
            context.arc(x+sitW + i*1.5*sitW,y+height*0.3,0.15*sitW,0,Math.PI*2);
            context.stroke();
            // context.beginPath();
            // context.lineWidth = 0.5;
            // context.arc(x+sitW + i*1.5*sitW,y+height*0.3,0.28*sitW,0,Math.PI*2);
            // context.stroke();
            context.beginPath();
            context.lineWidth = 0.5;
            context.globalAlpha = 0.5;
            context.arc(x+sitW + i*1.5*sitW,y+height*0.3,0.25*sitW,0,Math.PI*2);
            context.stroke();
        }
        for(var i=0; i<sitC; i++) {
            context.beginPath();
            context.lineWidth = 0.5;
            context.arc(x + sitW + i * 1.5 * sitW, y + height * 0.7, 0.15 * sitW, 0, Math.PI * 2);
            context.stroke();
            // context.beginPath();
            // context.lineWidth = 0.5;
            // context.arc(x + sitW + i * 1.5 * sitW, y + height * 0.7, 0.28 * sitW, 0, Math.PI * 2);
            // context.stroke();

            context.beginPath();
            context.lineWidth = 0.5;
            context.arc(x + sitW + i * 1.5 * sitW, y + height * 0.7, 0.25 * sitW, 0, Math.PI * 2);
            // context.rect(x+0.5*sitW + i*1.5*sitW,y+height*0.6,sitW,0.65*sitW);
            context.stroke();
        }

        context.beginPath();
        context.font = "20px Bold";
        context.font = context.font.replace(/\d+(\.\d+)?(px|pt|em|%)/i,1.2*sitW+"px");//替换字体大小
        context.textAlign = "center";
        context.fillText(shape.tableNum,x + 0.5*width,y + height * 0.6);

        context.restore();
    }

    if (xPos != undefined && yPos!= undefined && w != undefined && h != undefined){
        shape.minX = xPos;
        shape.minY = yPos;
        shape.maxX = xPos+w;
        shape.maxY = yPos+h;
    }

    shape.hitEvent = function (x,y) {
        if(x>=shape.minX && x<=shape.maxX && y>=shape.minY && y<=shape.maxY){
            return true;
        }else {
            return false;
        }
    }
    return shape;
}


//隔断
DBCanvas.Partition = function (xPos,yPos,width,height) {
    var shape = new DBCanvas.Shape("Partition");
    shape.shapeClass = "DBCanvas.Partition";
    shape.draw = function (context) {
        var w = shape.maxX - shape.minX;
        var h = shape.maxY - shape.minY;
        var x = shape.minX;
        var y = shape.minY;

        context.save();
        context.beginPath();
        //旋转
        context.translate(x+0.5*w,y+0.5*h);
        context.rotate(shape.rotateAngle);
        context.translate(-x-0.5*w,-y-0.5*h);

        //设置透明度
        context.globalAlpha = shape.alpha;
        context.strokeStyle = shape.strokeStyle;
        context.fillStyle = "black";
        context.lineWidth = 1;
        context.rect(x,y,w,h);

        var background = DBCanvas.Pattern();
        var pattern = context.createPattern(background,"repeat");
        context.fillStyle = pattern;
        context.stroke();
        context.fill();
        context.restore();
    }

    if(xPos!=undefined && yPos!=undefined && width!=undefined && height!=undefined){
        shape.minX = xPos;
        shape.minY = yPos;
        shape.maxX = xPos+width;
        shape.maxY = yPos+height;
    }
    return shape;
}

//通道
DBCanvas.Aisle = function (xPos,yPos,width,height) {
    var shape = new DBCanvas.Shape("Aisle");
    shape.shapeClass = "DBCanvas.Aisle";
    shape.draw = function (context) {

        var w = shape.maxX - shape.minX;
        var h = shape.maxY - shape.minY;
        var x = shape.minX;
        var y = shape.minY;
        context.save();
        context.beginPath();

        context.translate(x+0.5*w,y+0.5*h);
        context.rotate(shape.rotateAngle);
        context.translate(-x-0.5*w,-y-0.5*h);
        //设置透明度
        context.globalAlpha = shape.alpha;
        context.moveTo(x,y);
        var background = DBCanvas.Pattern_aisle();
        var pattern = context.createPattern(background,"repeat");
        context.fillStyle = pattern;
        context.strokeStyle = shape.strokeStyle;
        context.rect(x,y,w,h);
        context.stroke();
        context.fill();

        //箭头
        // if (w>h){
        //     DBCanvas.Tools.drawArrow(context,x+0.4*w,y+0.4*h,h*0.2);
        // }else {
        //     DBCanvas.Tools.drawArrow(context,x+0.4*w,y+0.4*h,w*0.2);
        // }


        context.closePath();
        context.beginPath();

        // var gap = (h%w)/(Math.floor(h/w)-1);
        // DBCanvas.Tools.print(gap);

        // for(var i=0;i<Math.floor(h/w);i++){
        //     context.moveTo(x,y+i*(w+gap));
        //     context.lineTo(x+w,y+(i+1)*w+i*gap);
        //     context.moveTo(x+w,y+i*w+i*gap);
        //     context.lineTo(x,y+(i+1)*w+i*gap);
        // }

        // context.moveTo(x+w*0.5,y+0.22*h);
        // context.lineTo(x+0.25*w,y+0.2*h+0.25*w*Math.tan(Math.PI/3));

        context.stroke();
        context.restore();
    }
    shape.hitEvent = function (x,y) {
        if (x>=shape.minX && x<shape.maxX && y>=shape.minY && y<shape.maxY){
            return true;
        }else {
            return false;
        }
    }

    if(xPos!=undefined && yPos!=undefined && width!=undefined && height!=undefined){
        shape.minX = xPos;
        shape.minY = yPos;
        shape.maxX = xPos+width;
        shape.maxY = yPos+height;
    }
    return shape;
}


//安全出口
DBCanvas.Exit = function (xPos,yPos,width) {
    var shape = new DBCanvas.Shape("Exit");
    shape.shapeClass = "DBCanvas.Exit";

    if (xPos!=undefined && yPos!=undefined && width!=undefined){
        shape.minX = xPos;
        shape.minY = yPos;
        shape.maxX = xPos + width;
        shape.maxY = yPos + width/2.7;
    }
    shape.draw = function (context) {
        var x = shape.minX;
        var y = shape.minY;
        //安全出口标识宽度
        var w = 0;

        if (shape.maxX - shape.minX >= (shape.maxY-shape.minY)*2.6){
            w = (shape.maxY-shape.minY)*2.7;
        }else if(shape.maxY-shape.minY >= (shape.maxX - shape.minX)/2.6 ){
            w = shape.maxX - shape.minX;
            // return;
        }
        context.save();
        context.beginPath();
        context.globalAlpha = shape.alpha;
        context.translate(shape.minX+(shape.maxX-shape.minX)*0.5,shape.minY+(shape.maxY-shape.minY)*0.5);
        context.rotate(shape.rotateAngle);
        context.translate(-shape.minX-(shape.maxX-shape.minX)*0.5,-shape.minY-(shape.maxY-shape.minY)*0.5);
        context.lineWidth = 1;
        context.strokeStyle = "black";
        context.fillStyle = "#EDFAEF";
        context.rect(x-2,y-2,w+4,w/2.7+4);
        context.stroke();
        context.fill();
        context.closePath();

        context.beginPath();
        context.strokeStyle = shape.strokeStyle;
        context.fillStyle = "#38453B";

        context.rect(x,y,w,w/2.7);
        context.fill();

        context.font = "14px bold";
        context.font = context.font.replace(/\d+(\.\d+)?(px|pt|em|%)/i,0.15*w+"px");//替换字体大小
        context.textBaseline = "top";
        // context.letterSpacing = "2px";
        context.fillStyle = "#D3F58F";
        context.fillText("安 全 出 口",x+0.15*w,y+0.02*w);

        context.fillText("E X I T",x+0.26*w,y+0.18*w);

        context.stroke();

        context.restore();
    }

    return shape;
}


//卫生间Toilet
DBCanvas.Toilet = function (xPos,yPos,width) {
    var shape = new DBCanvas.Shape("Toilet");

    shape.shapeClass = "DBCanvas.Toilet";
    if (xPos!=undefined && yPos!=undefined && width!=undefined){
        shape.minX = xPos;
        shape.minY = yPos;
        shape.maxX = xPos + width;
        shape.maxY = yPos + width;
    }
    shape.draw = function (context) {
        var x = shape.minX;
        var y = shape.minY;
        var w = 0;
        if (shape.maxX - shape.minX <= shape.maxY-shape.minY){
            w = shape.maxX - shape.minX;
        }else {
            w = shape.maxY - shape.minY;
        }

        context.save();
        context.beginPath();
        context.globalAlpha = shape.alpha;
        context.translate(shape.minX+(shape.maxX-shape.minX)*0.5,shape.minY+(shape.maxY-shape.minY)*0.5);
        context.rotate(shape.rotateAngle);
        context.translate(-shape.minX-(shape.maxX-shape.minX)*0.5,-shape.minY-(shape.maxY-shape.minY)*0.5);



        //drawBoy
        var personW = 0.28*w;
        context.beginPath();
        context.fillStyle = "black";
        //头
        context.arc(x+0.28*w,y+0.18*w,0.25*personW,0,Math.PI*2);
        //左边肩膀开始
        context.moveTo(x+0.28*w-0.3*personW,y+0.18*w+0.36*personW);
        context.lineTo(x+0.28*w+0.3*personW,y+0.18*w+0.36*personW);
        context.arc(x+0.28*w+0.3*personW,
                    y+0.18*w+0.56*personW,
                    0.2*personW,
                    Math.PI*1.5,
                    Math.PI*2);
        context.lineTo(x+0.25*w+0.6*personW,y+0.6*w);

        context.arc(x+0.25*w+0.5*personW,y+0.6*w,0.1*personW,0,Math.PI);
        context.lineTo(x+0.25*w+0.4*personW,y+0.18*w+0.66*personW);
        context.lineTo(x+0.25*w+0.35*personW,y+0.18*w+0.66*personW);
        context.lineTo(x+0.25*w+0.35*personW,y+0.9*w-0.1*personW);

        context.arc(x+0.25*w+0.25*personW,y+0.9*w-0.1*personW,0.1*personW,0,Math.PI);
        context.lineTo(x+0.25*w+0.15*personW,y+0.55*w);
        context.lineTo(x+0.25*w+0.05*personW,y+0.55*w);
        context.lineTo(x+0.25*w+0.05*personW,y+0.9*w-0.1*personW);

        context.arc(x+0.25*w-0.05*personW,y+0.9*w-0.1*personW,0.1*personW,0,Math.PI);
        context.lineTo(x+0.25*w-0.15*personW,y+0.18*w+0.66*personW);
        context.lineTo(x+0.25*w-0.2*personW,y+0.18*w+0.66*personW);
        context.lineTo(x+0.25*w-0.2*personW,y+0.6*w);
        //
        context.arc(x+0.25*w-0.3*personW,y+0.6*w,0.1*personW,0,Math.PI);
        context.lineTo(x+0.25*w-0.4*personW,y+0.18*w+0.56*personW);
        context.arc(x+0.28*w-0.3*personW,y+0.18*w+0.56*personW,0.2*personW,
                    Math.PI,
                    Math.PI*1.5);
        context.stroke();
        context.fill();
        context.closePath();
        context.beginPath();

        //drawGirl
        // context.moveTo(x+0.72*w,y+0.18*w);
        //头
        context.arc(x+0.72*w,y+0.18*w,0.25*personW,0,Math.PI*2);

        context.moveTo(x+0.72*w-0.25*personW,y+0.18*w+0.36*personW);
        context.lineTo(x+0.72*w+0.25*personW,y+0.18*w+0.36*personW);
        //肩膀
        context.arc(x+0.72*w+0.25*personW,
                    y+0.18*w+0.56*personW,
                    0.2*personW,
                    Math.PI*1.5,
                    Math.PI*1.5+Math.PI*70/180);

        var a = 0.2*personW/Math.cos(Math.PI*20/180);
        var b = 0.5*personW*Math.tan(Math.PI*20/180);

        context.lineTo(x+0.72*w+0.25*personW+a+b,y+0.18*w+1.11*personW);

        context.arc(x+0.72*w+0.25*personW+a+b-0.1*personW*Math.sin(70*Math.PI/180),
                    y+0.18*w+1.11*personW+0.1*personW*Math.cos(70*Math.PI/180),
                    0.1*personW,
                    Math.PI*2-Math.PI*20/180,
                    Math.PI-Math.PI*20/180);

        context.lineTo(x+0.72*w+0.25*personW,y+0.18*w+0.56*personW);
        //裙子
        context.lineTo(x+0.72*w+0.25*personW,y+0.18*w+0.70*personW);
        //裙角
        context.lineTo(x+0.72*w+0.5*personW,y+0.18*w+1.5*personW);
        context.lineTo(x+0.72*w+0.25*personW,y+0.18*w+1.5*personW);
        context.lineTo(x+0.72*w+0.25*personW,y+0.18*w+2.5*personW);
        context.arc(x+0.72*w+0.15*personW,
                    y+0.18*w+2.5*personW,
                    0.1*personW,
                    0,
                    Math.PI);
        context.lineTo(x+0.72*w+0.05*personW,y+0.18*w+1.5*personW);
        context.lineTo(x+0.72*w-0.05*personW,y+0.18*w+1.5*personW);
        context.lineTo(x+0.72*w-0.05*personW,y+0.18*w+2.5*personW);
        context.arc(x+0.72*w-0.15*personW,
                    y+0.18*w+2.5*personW,
                    0.1*personW,
                    0,
                    Math.PI);
        context.lineTo(x+0.72*w-0.25*personW,y+0.18*w+1.5*personW);
        context.lineTo(x+0.72*w-0.5*personW,y+0.18*w+1.5*personW);
        //裙子
        context.lineTo(x+0.72*w-0.25*personW,y+0.18*w+0.70*personW);
        context.lineTo(x+0.72*w-0.25*personW,y+0.18*w+0.56*personW);
        //左手臂
        context.lineTo(x+0.72*w-0.25*personW-(0.5*personW+0.2*personW*Math.sin(Math.PI*20/180))*Math.tan(Math.PI*20/180),
                       y+0.18*w+1.11*personW+0.2*personW*Math.sin(Math.PI*20/180));

        context.arc(x+0.72*w-0.25*personW-a-b+0.1*personW*Math.sin(70*Math.PI/180),
                    y+0.18*w+1.11*personW+0.1*personW*Math.cos(70*Math.PI/180),
                    0.1*personW,
                    Math.PI*20/180,
                    Math.PI+Math.PI*20/180);
        context.lineTo(x+0.72*w-0.25*personW-0.2*personW*Math.cos(Math.PI*20/180),
                        y+0.18*w+0.56*personW-0.2*personW*Math.sin(Math.PI*20/180));

        context.arc(x+0.72*w-0.25*personW,
                    y+0.18*w+0.56*personW,
                    0.2*personW,
                    Math.PI*1.5-Math.PI*70/180,
                    Math.PI*1.5
                    );


        context.fill();
        context.moveTo(x+0.5*w-1,y+0.1*w);
        context.lineTo(x+0.5*w-1,y+0.9*w);


        context.lineWidth = 1;
        context.strokeStyle = "black";
        var radius = 0.1*w;
        context.moveTo(x+radius,y);
        context.lineTo(x+w-radius,y);
        context.arcTo(x+w,y,x+w,y+radius,radius);
        context.arcTo(x+w,y+w,x+w-radius,y+w,radius);
        context.arcTo(x,y+w,x,y+w-radius,radius);
        context.arcTo(x,y,x+radius,y,radius);

        context.stroke();

        context.restore();
    }
    return shape;
}



//收银台Cashier
DBCanvas.Cashier = function (xPos, yPos, width){
    var shape = new DBCanvas.Shape("Cashier");
    shape.shapeClass = "DBCanvas.Cashier";
    shape.draw = function (context) {
        var x = shape.minX;
        var y = shape.minY;
        var w = shape.maxX-shape.minX;
        context.save();

        var fingerW = 0.025*w;
        context.beginPath();
        context.fillStyle = "black";
        context.globalAlpha = shape.alpha;
        //中指
        context.moveTo(x+0.5*w,y+0.2*w);
        context.lineTo(x+0.5*w,y+0.1*w);
        context.arc(x+0.5*w+fingerW,y+0.1*w,fingerW,Math.PI,Math.PI*2);
        context.lineTo(x+0.5*w+2*fingerW,y+0.2*w);
        //食指
        context.moveTo(x+0.5*w+2*fingerW+3,y+0.2*w);
        context.lineTo(x+0.5*w+2*fingerW+3,y+0.12*w);
        context.arc(x+0.5*w+3*fingerW+3,y+0.12*w,fingerW,Math.PI,Math.PI*2);
        context.lineTo(x+0.5*w+4*fingerW+3,y+0.2*w);

        //无名指
        context.moveTo(x+0.5*w-3,y+0.2*w);
        context.lineTo(x+0.5*w-3,y+0.12*w);
        context.arc(x+0.5*w-fingerW-3,y+0.12*w,fingerW,Math.PI*2,Math.PI,true);
        context.lineTo(x+0.5*w-2*fingerW-3,y+0.2*w);
        //小指
        context.moveTo(x+0.5*w-2*fingerW-6,y+0.2*w);
        context.lineTo(x+0.5*w-2*fingerW-6,y+0.15*w);
        context.arc(x+0.5*w-3*fingerW-6,y+0.15*w,fingerW,Math.PI*2,Math.PI,true);
        context.lineTo(x+0.5*w-4*fingerW-6,y+0.2*w);

        //手掌
        context.moveTo(x+0.5*w-4*fingerW-6,y+0.46*w);
        context.lineTo(x+0.5*w-4*fingerW-6,y+0.5*w);
        context.arc(x+0.5*w-2*fingerW-6,y+0.5*w,2*fingerW,Math.PI,Math.PI/2,true);
        context.lineTo(x+0.5*w-2*fingerW-6,y+0.62*w);
        context.lineTo(x+0.5*w+4*fingerW+3,y+0.62*w);
        context.lineTo(x+0.5*w+4*fingerW+3,y+0.5*w+fingerW);
        context.lineTo(x+0.5*w+6*fingerW+3,y+0.46*w);
        context.lineTo(x+0.5*w+6*fingerW+3,y+0.35*w);
        context.arc(x+0.5*w+5*fingerW+3,y+0.35*w,fingerW,Math.PI*2,Math.PI,true);
        context.lineTo(x+0.5*w+4*fingerW+3,y+0.46*w);


        //￥符号
        context.moveTo(x+0.5*w-4*fingerW-6,y+0.23*w);
        context.lineTo(x+0.5*w-fingerW-6,y+0.23*w);

        context.lineTo(x+0.5*w,y+0.33*w);
        context.lineTo(x+0.5*w+fingerW,y+0.23*w);
        context.lineTo(x+0.5*w+4*fingerW,y+0.23*w);
        context.lineTo(x+0.5*w+2*fingerW,y+0.32*w);
        context.lineTo(x+0.5*w+4*fingerW,y+0.32*w);

        context.lineTo(x+0.5*w+4*fingerW,y+0.32*w+fingerW);
        context.lineTo(x+0.5*w+fingerW,y+0.32*w+fingerW);
        context.lineTo(x+0.5*w+fingerW,y+0.32*w+2*fingerW);
        context.lineTo(x+0.5*w+4*fingerW,y+0.32*w+2*fingerW);
        context.lineTo(x+0.5*w+4*fingerW,y+0.32*w+3*fingerW);
        context.lineTo(x+0.5*w+fingerW,y+0.32*w+3*fingerW);
        context.lineTo(x+0.5*w+fingerW,y+0.32*w+5*fingerW);
        context.lineTo(x+0.5*w-fingerW,y+0.32*w+5*fingerW);
        context.lineTo(x+0.5*w-fingerW,y+0.32*w+3*fingerW);
        context.lineTo(x+0.5*w-4*fingerW,y+0.32*w+3*fingerW);
        context.lineTo(x+0.5*w-4*fingerW,y+0.32*w+2*fingerW);
        context.lineTo(x+0.5*w-fingerW,y+0.32*w+2*fingerW);
        context.lineTo(x+0.5*w-fingerW,y+0.32*w+fingerW);
        context.lineTo(x+0.5*w-4*fingerW,y+0.32*w+fingerW);
        context.lineTo(x+0.5*w-4*fingerW,y+0.32*w);
        context.lineTo(x+0.5*w-2*fingerW,y+0.32*w);
        context.lineTo(x+0.5*w-4*fingerW-6,y+0.23*w);

        context.textBaseline = "middle";
        context.font = "20px Bold";
        context.font = context.font.replace(/\d+(\.\d+)?(px|pt|em|%)/i,0.15*w+"px");//替换字体大小
        context.fillText("收 银 台",x+0.25*w,y+0.75*w);
        context.font = "20px Bold";
        context.font = context.font.replace(/\d+(\.\d+)?(px|pt|em|%)/i,0.1*w+"px");//替换字体大小
        context.fillText("CASHIER",x+0.32*w,y+0.87*w);

        context.fill();
        context.stroke();

        context.beginPath();
        context.strokeStyle = "black";

        context.rect(x+0.25*w,y+0.2*w,0.5*w,0.26*w);
        context.rect(x,y,w,w);

        context.stroke();

        context.restore();
    }

    if (xPos != undefined && yPos != undefined && width != undefined){
        shape.minX = xPos;
        shape.minY = yPos;
        shape.maxX = xPos+width;
        shape.maxY = yPos+width;
    }

    return shape;
}



//隔断填充样式
DBCanvas.Pattern = function () {
    var pattern = document.createElement("canvas");

    var w = 30;
    pattern.width = w;
    pattern.height = w;
    var ctx = pattern.getContext("2d");
    ctx.save();
    ctx.beginPath();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.moveTo(0,w/3);
    ctx.lineTo(w*2/3,w/3);

    ctx.moveTo(w/3,w/3);
    ctx.lineTo(w/3,w);

    ctx.moveTo(w/3,w*2/3);
    ctx.lineTo(w,w*2/3);

    ctx.moveTo(w*2/3,w*2/3);
    ctx.lineTo(w*2/3,0);

    ctx.rect(0,0,w,w);

    ctx.stroke();
    ctx.restore();
    return pattern;
}


//通道填充样式
DBCanvas.Pattern_aisle = function () {
    var pattern = document.createElement("canvas");
    var w = 60;
    pattern.width = w;
    pattern.height = w;
    var ctx = pattern.getContext("2d");
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.5;
    ctx.moveTo(0,w/2);
    ctx.lineTo(w/2,0);
    ctx.lineTo(w,w/2);
    ctx.lineTo(w/2,w);
    ctx.closePath();

    ctx.moveTo(0,0);
    ctx.lineTo(w,w);

    ctx.moveTo(0,w);
    ctx.lineTo(w,0);
    ctx.rect(0,0,w,w);
    ctx.stroke();
    ctx.restore();
    return pattern;
}


//区域文字标识
DBCanvas.TextArea = function (xPos,yPos,width) {
    var shape = DBCanvas.Shape("TextArea");
    shape.shapeClass = "DBCanvas.TextArea";
    shape.chineseText = "取 餐 区";
    shape.englishText = "TakeAway";

    if (xPos != undefined && yPos != undefined && width != undefined){
        shape.minX = xPos;
        shape.maxX = xPos+width;
        shape.minY = yPos;
        shape.maxY = yPos + width/2;
    }
    shape.draw = function (context) {
        var x = shape.minX;
        var y = shape.minY;
        var w = shape.maxX - shape.minX;
        context.save();
        context.beginPath();
        context.lineWidth = 1.0;
        context.strokeStyle = "black";
        context.textBaseline = "hanging";
        context.textAlign = "center";
        context.font = "20px Bold";
        context.fillStyle = "#E7224A";
        context.font = context.font.replace(/\d+(\.\d+)?(px|pt|em|%)/i,0.2*w+"px");//替换字体大小

        context.fillText(shape.chineseText,x+w/2,y+w/20);
        context.font = context.font.replace(/\d+(\.\d+)?(px|pt|em|%)/i,0.12*w+"px");//替换字体大小
        context.fillText(shape.englishText,x+w/2,y+w/3.8);
        context.rect(x,y,w,w/2);

        context.stroke();

        context.restore();
    }

    return shape;
}


//入口标识
DBCanvas.Entrance = function (xPos,yPos,width) {
    var shape = new DBCanvas.Shape("Entrance");
    shape.shapeClass = "DBCanvas.Entrance";

    if (xPos != undefined && yPos != undefined && width != undefined){
        shape.minX = xPos;
        shape.maxX = xPos+width;
        shape.minY = yPos;
        shape.maxY = yPos + width/2;
    }
    shape.draw = function (context) {
        var x = shape.minX;
        var y = shape.minY;
        var w = shape.maxX - shape.minX;
        context.save();
        context.translate((shape.minX+shape.maxX)*0.5,(shape.minY+shape.maxY)*0.5);
        context.rotate(shape.rotateAngle);
        context.translate(-(shape.minX+shape.maxX)*0.5,-(shape.minY+shape.maxY)*0.5);
        context.beginPath();

        context.strokeStyle = "white";
        context.fillStyle = "#FFA630";
        context.rect(x,y,w,w/2);

        context.stroke();
        context.fill();

        context.beginPath();
        context.lineWidth = 1.5;

        context.rect(x+w/8,y+w/8,w/4,w/4);
        context.moveTo(x+1.1*w/8,y+w/4-0.01*w);
        context.lineTo(x+w/8 + 0.05*w,y+w/4 -0.05*w);
        context.moveTo(x+1.1*w/8,y+1.1*w/4);
        context.lineTo(x+w/8 + 0.05*w,y+1.1*w/4 +0.04*w);

        context.stroke();

        context.beginPath();
        context.lineWidth = 2.5;
        context.strokeStyle = "white";
        context.lineJoin = "bevel";
        context.moveTo(x+w/8 + 0.075*w,y+w/4 -0.05*w);
        context.lineTo(x+w/8 + 0.075*w,y+w/8 +0.028*w);
        context.lineTo(x+3*w/8 - 0.04*w,y+w/8 +0.028*w);
        context.lineTo(x+3*w/8 - 0.04*w,y+3*w/8 -0.028*w);
        context.lineTo(x+w/8 + 0.075*w,y+3*w/8 -0.028*w);
        context.lineTo(x+w/8 + 0.075*w,y+1.1*w/4 + 0.04*w);

        //箭头
        context.moveTo(x+w/8 + 0.075*w,y+w/4);
        context.lineTo(x+3*w/8 - 0.06*w,y+w/4);
        context.moveTo(x+w/8 + 0.079*w,y+w/4);
        context.lineTo(x+w/8 + 0.125*w,y+w/4-0.05*w);
        context.moveTo(x+w/8 + 0.079*w,y+w/4);
        context.lineTo(x+w/8 + 0.125*w,y+w/4+0.05*w);
        context.stroke();

        context.beginPath();
        context.fillStyle = "white";
        context.font = "45px '宋体'";
        context.textAlign = "center";
        context.textBaseline = "hanging";
        context.font = context.font.replace(/\d+(\.\d+)?(px|pt|em|%)/i,0.23*w+"px");//替换字体大小
        context.fillText("入口",x+3*w/4,y+0.5*w/8);
        context.font = "15px lighter";
        context.font = context.font.replace(/\d+(\.\d+)?(px|pt|em|%)/i,0.08*w+"px");//替换字体大小
        context.fillText("ENTRANCE",x+3*w/4,y+2.4*w/8);
        context.stroke();

        context.beginPath();
        context.rect(x,y,w,w/2);
        context.stroke();


        context.restore();
    }
    return shape;
}



//吧台
DBCanvas.BarCounter = function (xPos,yPos,width) {
    var shape = new DBCanvas.Shape("BarCounter");
    shape.shapeClass = "DBCanvas.BarCounter";

    shape.chineseText = "吧 台";
    shape.englishText = "Bar Counter";

    if (xPos != undefined && yPos != undefined && width != undefined){
        shape.minX = xPos;
        shape.maxX = xPos+width;
        shape.minY = yPos;
        shape.maxY = yPos + width/3;
    }
    shape.draw = function (context) {
        var x = shape.minX;
        var y = shape.minY;
        var w = shape.maxX - shape.minX;
        context.save();
        context.translate((shape.minX+shape.maxX)*0.5,(shape.minY+shape.maxY)*0.5);
        context.rotate(shape.rotateAngle);
        context.translate(-(shape.minX+shape.maxX)*0.5,-(shape.minY+shape.maxY)*0.5);
        context.beginPath();
        // context.rect(x,y,w,w/3);
        context.strokeStyle = "#E7224A";
        context.moveTo(x,y+w/3);
        context.lineTo(x+w,y+w/3);
        context.lineTo(x+w,y);
        context.lineTo(x+w/3,y);
        context.arcTo(x,y,x,y+w/3,w/3);

        context.moveTo(x+w-w/15,y+w/3);
        context.lineTo(x+w-w/15,y+w/15);
        context.lineTo(x+w/3,y+w/15);
        context.arcTo(x+w/15,y+w/15,x+w/15,y+w/3,w/3-w/15);
        context.fillStyle = "#E7224A";
        context.textAlign = "start";
        context.font = "30px '黑体'";
        context.font = context.font.replace(/\d+(\.\d+)?(px|pt|em|%)/i,0.1*w+"px");//替换字体大小
        context.fillText(shape.chineseText,x+w/1.8,y+w/5);

        context.font = "20px '黑体'";
        context.font = context.font.replace(/\d+(\.\d+)?(px|pt|em|%)/i,0.06*w+"px");//替换字体大小
        context.fillText(shape.englishText,x+w/1.8,y+w/3.5);
        context.stroke();

        context.beginPath();
        context.fillStyle = "#E7224A";
        context.arc(x+w/3.7,y+w/5,w/15,0,Math.PI*2);
        context.fill();
        // context.beginPath();
        context.strokeStyle = "white";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "30px '宋体'";
        context.font = context.font.replace(/\d+(\.\d+)?(px|pt|em|%)/i,0.1*w+"px");//替换字体大小
        context.fillText("￥",x+w/3.7,y+w/5);
        context.stroke();

        context.beginPath();
        context.fillStyle = "#E7224A";
        context.arc(x+w/2.3,y+w/5,w/15,0,Math.PI*2);
        context.fill();
        context.strokeStyle = "white";
        context.stroke();

        context.beginPath();
        context.strokeStyle = "white";
        context.fillStyle = "white";
        context.arc(x+w/2.3,y+w/5.8,w/30,Math.PI*2-Math.PI/8,Math.PI+Math.PI/8);
        context.fill();
        context.closePath();
        context.lineWidth = w/100;
        context.moveTo(x+w/2.3,y+w/5.8+w/27);
        context.lineTo(x+w/2.3,y+w/5.8+2*w/27);

        context.moveTo(x+w/2.3-w/60,y+w/5.8+2*w/27);
        context.lineTo(x+w/2.3+w/60,y+w/5.8+2*w/27);
        context.stroke();

        context.beginPath();
        context.strokeStyle = "transparent";
        context.rect(x,y,w,w/3);
        context.stroke();


        context.restore();
    }

    return shape;
}