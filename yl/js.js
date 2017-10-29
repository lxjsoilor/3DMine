    // 方便获取类元素

    function $(id) {
        return document.getElementsByClassName(id)[0];
    };
    // 阻止鼠标选择
    document.onselectstart = new Function("event.returnValue=false;");

    // 游戏逻辑
    var game = {
            data: [],
            rows: 18, //18行
            cols: 24, //24列
            temp: true, //第一次点击随机分布的条件判断
            time: 60, //倒计时
            leftTimer: null, //左侧倒计时
            isOver: false, //是否游戏结束
            mineNum: 0, //检查有多少雷
            randomNumber: function(obj) {
                var mine = 20; //随机生成的总雷数量
                var num = 0;
                //获取当前点击的坐标
                var className = obj.className;
                var arr = className.split(' ');
                //判断并跳过点击和已经有地雷的位置
                if (arr.length == 1) {
                    var arrN = arr[0].split('.');
                    var row = parseInt(arrN[0]);
                    var col = parseInt(arrN[1]);
                    while (num < mine) {
                        var row = Math.ceil((this.rows * Math.random())) - 1;
                        var col = Math.ceil((this.cols * Math.random())) - 1;
                        if (!($(row + '.' + col).id)) {
                            $(row + '.' + col).id = 'mine';
                            num++;
                        }
                    }
                } else if (arr.length == 4) {
                    while (num < mine) {
                        var flag = true;
                        var row = Math.ceil((this.rows * Math.random())) - 1;
                        var col = Math.ceil((this.cols * Math.random())) - 1;
                        for (var i = 0; i < arr.length; i++) {
                            var arrN = arr[i].split('.');
                            var _row = parseInt(arrN[0]);
                            var _col = parseInt(arrN[1]);
                            if (row == _row && col == _col) {
                                flag = false;
                                break;
                            };
                            if (!($(row + '.' + col).id && (flag == true))) {
                                $(row + '.' + col).id = 'mine';
                                num++;
                            }
                        }
                    }
                };
                // 检查有多少雷
                // var siv = $('box').children;
                // for (var i = 0; i < siv.length; i++) {
                //     for (var j = 0; j < siv[i].children.length; j++) {
                //         if (siv[i].children[j].id == 'mine') {
                //             this.mineNum++;
                //         }
                //     }
                // };
                // console.log(this.mineNum);
                //判断周围8个格子内有多少个地雷。并把地雷数量输出在标签内
                for (var i = 0; i < this.rows; i++) {
                    for (var j = 0; j < this.cols; j++) {
                        $(i + '.' + j).style.transition = '0.2s all';
                        $(i + '.' + j).style.backgroundColor = '#173825';
                        var minNum = 0;
                        // leftop
                        if ((i - 1 >= 0) && (j - 1 >= 0)) {
                            if ($((i - 1) + '.' + (j - 1)).id == 'mine') {
                                minNum++;
                                // console.log(minNum)
                            }
                        };
                        // top
                        if (i >= 1) {
                            if ($((i - 1) + '.' + j).id == 'mine') {
                                minNum++;
                                // console.log(minNum)

                            }
                        };
                        // righttop
                        if ((i - 1 >= 0) && (j <= this.cols - 2)) {
                            if ($((i - 1) + '.' + (j + 1)).id == 'mine') {
                                minNum++;
                            }
                        };
                        // left
                        if (j >= 1) {
                            if ($(i + '.' + (j - 1)).id == 'mine') {
                                minNum++;
                            }
                        };
                        //right
                        if (j <= this.cols - 2) {
                            if ($(i + '.' + (j + 1)).id == 'mine') {
                                minNum++;
                            }
                        };
                        // leftbottom
                        if ((i <= this.rows - 2) && (j - 1 >= 0)) {
                            if ($((i + 1) + '.' + (j - 1)).id == 'mine') {
                                minNum++;
                            }
                        };
                        //bottom
                        if (i <= this.rows - 2) {
                            if ($((i + 1) + '.' + j).id == 'mine') {
                                minNum++;
                            }
                        };
                        //rightbottom
                        if ((i <= this.rows - 2) && (j <= this.cols - 2)) {
                            if ($((i + 1) + '.' + (j + 1)).id == 'mine') {
                                minNum++;
                            }
                        };
                        // console.log(minNum)

                        if (!($(i + '.' + j).id)) {
                            // console.log(minNum)
                            // var num = minNum;
                            // $(i+'.'+j).innerHTML = num;
                            $(i + '.' + j).id = minNum + '';
                        }
                    }
                }

            },
            //点击事件和右击事件
            onclick: function() {
                var _this = this;
                // var temp = true;
                for (var i = 0; i < this.rows; i++) {
                    for (var j = 0; j < this.cols; j++) {
                        $(i + '.' + j).onclick = function() {
                            // 点击后开始倒计时
                            // _this.setTime();
                            //点击后随机生成地雷
                            if (_this.temp) {
                                _this.randomNumber(this);
                                _this.temp = false;
                            };
                            //判断是否可以点击
                            if (this.dataset['sign'] == 'sure' || !!_this.isOver) {
                                return;
                            };
                            this.style.backgroundColor = '';
                            // 如果踩到地雷
                            if (this.id == 'mine') {
                                _this.gameOver();
                                _this.rock();
                                return;
                            };
                            if (this.id == "0") {
                                // 如果点击的是周围无地雷的话向四周扩展
                                _this.showSpace(this);
                                this.innerHTML = this.id;
                            } else {
                                // 如果点击的是周围是有地雷的展示这个地方周围的地雷数量
                                this.innerHTML = this.id;
                            };
                            //更新页面的图片
                            _this.changeImg();
                        };
                        // 右击事件
                        $(i + '.' + j).oncontextmenu = function() {
                            // 根据自定义属性获取要展示的更新的页面
                            if (!this.dataset['sign']) {
                                var num = 0;
                                this.dataset['sign'] = 'sure';
                                _this.judge();
                                _this.changeImg();
                                var siv = $('box').children;
                                // console.log(siv)
                                for (var i = 0; i < siv.length; i++) {
                                    for (var j = 0; j < siv[i].children.length; j++) {
                                        if (siv[i].children[j].dataset['sign'] == 'sure') {
                                            num++;
                                        }
                                    }
                                };
                                $('hasMine').innerHTML = (20 - num);
                                return false;
                            };
                            if (this.dataset['sign'] == 'sure') {
                                this.dataset['sign'] = 'issue';
                                _this.changeImg();
                                return false;
                            };
                            if (this.dataset['sign'] == 'issue') {
                                this.dataset['sign'] = "";
                                _this.changeImg();
                                return false;
                            };
                            // return false;
                        };

                    }
                }
            },
            // 把周围没有地雷（即标签内容为0的格子）的格子展示出来，
            showSpace: function(obj) {
                var className = obj.className;
                var arr = className.split(' ');
                // console.log(arr);
                if (arr.length == 1) {
                    var arrN = arr[0].split('.');
                    var row = parseInt(arrN[0]);
                    var col = parseInt(arrN[1]);
                    // console.log(row,col)
                    this.ifSpace(row, col);
                };
                if (arr.length == 4) {
                    for (var i = 0; i < arr.length; i++) {
                        var arrN = arr[i].split('.');
                        var row = parseInt(arrN[0]);
                        var col = parseInt(arrN[1]);
                        this.ifSpace(row, col);
                    }
                }

            },
            // 判断周围是否有雷或标签内容大于0，如果是0就扩展
            ifSpace: function(row, col) {
                // 判断四周8个格子有没有雷
                //lefttop
                if ((row - 1 >= 0) && (col - 1 >= 0)) {
                    var btn = $((row - 1) + '.' + (col - 1));
                    if (btn.id != '0') {
                        btn.innerHTML = (btn.id == 'mine') ? "" : btn.id;
                        btn.style.backgroundColor = '';
                        // if (btn.id == '0') {
                        // 	this.showSpace()
                        // }
                    };
                    if (btn.id == "0" && (!!btn.style.backgroundColor)) {
                        btn.innerHTML = btn.id;
                        btn.style.backgroundColor = "";
                        btn.style.backgroundImage = "url('./images/actcell.png')";
                        //如果执行完后格子标签内容还是0；利用递归函数继续执行
                        this.showSpace(btn);
                    }
                };
                //左尽头连接背面
                // if ((col == 0)&&(row>=6)&&(row<=11)) {
                // 	var btn = $('23'+'.'+row);
                // 	if (btn.id != '0') {
                // 		btn.innerHTML = (btn.id == 'mine') ? "":btn.id;
                // 		btn.style.backgroundColor = '';
                // 	};
                // 	if (btn.id == '0'&&(!!btn.style.backgroundColor)) {
                // 		btn.innerHTML = btn.id;
                // 		btn.style.backgroundColor = "";
                // 		this.showSpace(btn);
                // 	}
                // };
                // //背面连接左尽头
                // if ((col == 23)&&(row>=6)&&(row<=11)) {
                // 	var btn = $('0'+'.'+row);
                // 	if (btn.id != '0') {
                // 		btn.innerHTML = (btn.id == 'mine') ? "":btn.id;
                // 		btn.style.backgroundColor = '';
                // 	};
                // 	if (btn.id == '0'&&(!!btn.style.backgroundColor)) {
                // 		btn.innerHTML = btn.id;
                // 		btn.style.backgroundColor = "";
                // 		this.showSpace(btn);
                // 	}
                // };
                //top
                if (row >= 1) {
                    var btn = $((row - 1) + '.' + (col));
                    if (btn.id != '0') {
                        btn.innerHTML = (btn.id == 'mine') ? "" : btn.id;
                        btn.style.backgroundColor = '';
                    };
                    if (btn.id == '0' && (!!btn.style.backgroundColor)) {
                        btn.innerHTML = btn.id;
                        btn.style.backgroundColor = '';
                        btn.style.backgroundImage = "url('./images/actcell.png')";
                        this.showSpace(btn);
                    }
                };
                //righttop
                if ((row - 1 >= 0) && (col <= this.cols - 2)) {
                    var btn = $((row - 1) + '.' + (col + 1));
                    if (btn.id != '0') {
                        btn.innerHTML = (btn.id == 'mine') ? "" : btn.id;
                        btn.style.backgroundColor = '';
                    };
                    if (btn.id == '0' && (!!btn.style.backgroundColor)) {
                        btn.innerHTML = btn.id;
                        btn.style.backgroundColor = '';
                        btn.style.backgroundImage = "url('./images/actcell.png')";
                        this.showSpace(btn);
                    }
                };
                // left
                if (col >= 1) {
                    var btn = $((row) + '.' + (col - 1));
                    if (btn.id != '0') {
                        btn.innerHTML = (btn.id == 'mine') ? "" : btn.id;
                        btn.style.backgroundColor = '';
                    };
                    if (btn.id == '0' && (!!btn.style.backgroundColor)) {
                        btn.innerHTML = btn.id;
                        btn.style.backgroundColor = '';
                        btn.style.backgroundImage = "url('./images/actcell.png')";
                        this.showSpace(btn);
                    }
                };
                //right
                if (col <= this.cols - 2) {
                    var btn = $(row + '.' + (col + 1));
                    if (btn.id != '0') {
                        btn.innerHTML = (btn.id == 'mine') ? "" : btn.id;
                        btn.style.backgroundColor = '';
                    };
                    if (btn.id == '0' && (!!btn.style.backgroundColor)) {
                        btn.innerHTML = btn.id;
                        btn.style.backgroundColor = '';
                        btn.style.backgroundImage = "url('./images/actcell.png')";
                        this.showSpace(btn);
                    }
                };
                // leftbottom
                if ((row <= this.rows - 2) && (col - 1 >= 0)) {
                    var btn = $((row + 1) + '.' + (col - 1));
                    if (btn.id != '0') {
                        btn.innerHTML = (btn.id == 'mine') ? "" : btn.id;
                        btn.style.backgroundColor = '';
                    };
                    if (btn.id == '0' && (!!btn.style.backgroundColor)) {
                        btn.innerHTML = btn.id;
                        btn.style.backgroundColor = '';
                        btn.style.backgroundImage = "url('./images/actcell.png')";
                        this.showSpace(btn);
                    }
                };
                // bottom
                if (row <= this.rows - 2) {
                    var btn = $((row + 1) + '.' + col);
                    if (btn.id != '0') {
                        btn.innerHTML = (btn.id == 'mine') ? "" : btn.id;
                        btn.style.backgroundColor = '';
                    };
                    if (btn.id == '0' && (!!btn.style.backgroundColor)) {
                        btn.innerHTML = btn.id;
                        btn.style.backgroundColor = '';
                        btn.style.backgroundImage = "url('./images/actcell.png')";
                        this.showSpace(btn);
                    }
                };
                // rightbottom
                if ((row <= this.rows - 2) && (col <= this.cols - 2)) {
                    var btn = $((row + 1) + '.' + (col + 1));
                    if (btn.id != '0') {
                        btn.innerHTML = (btn.id == 'mine') ? "" : btn.id;
                        btn.style.backgroundColor = '';
                    };
                    if (btn.id == '0' && (!!btn.style.backgroundColor)) {
                        btn.innerHTML = btn.id;
                        btn.style.backgroundColor = '';
                        btn.style.backgroundImage = "url('./images/actcell.png')";
                        this.showSpace(btn);
                    }
                };
            },
            // 判断游戏是否成功
            judge: function() {
                var allTrue = true;
                for (var i = 0; i < this.rows; i++) {
                    for (var j = 0; j < this.cols; j++) {
                        if (($(i + '.' + j).id == 'mine') && ($(i + '.' + j).dataset["sign"] != 'sure')) {
                            allTrue = false;
                        };
                    }
                };
                if (allTrue) {
                    // if (confirm('666666，再来一次？？')) {
                    // 	window.location.reload();
                    // };
                    clearInterval(this.leftTimer)
                    this.success();
                }
            },
            // 执行更新图片逻辑
            changeImg: function() {
                // 根据标签内容更新页面图片
                for (var i = 0; i < this.rows; i++) {
                    for (var j = 0; j < this.cols; j++) {
                        if ($(i + '.' + j).innerHTML == 0) {
                            //$(i+'.'+j).style.backgroundImage = "url('./images/bg.png')";
                            $(i + '.' + j).style.backgroundImage = "url('./images/actcell.png')";
                        } else if ($(i + '.' + j).innerHTML == 1) {
                            $(i + '.' + j).style.backgroundImage = "url('./images/mine_1.png')";
                        } else if ($(i + '.' + j).innerHTML == 2) {
                            $(i + '.' + j).style.backgroundImage = "url('./images/mine_2.png')";
                        } else if ($(i + '.' + j).innerHTML == 3) {
                            $(i + '.' + j).style.backgroundImage = "url('./images/mine_3.png')";
                        } else if ($(i + '.' + j).innerHTML == 4) {
                            $(i + '.' + j).style.backgroundImage = "url('./images/mine_4.png')";
                        } else if ($(i + '.' + j).innerHTML == 5) {
                            $(i + '.' + j).style.backgroundImage = "url('./images/mine_5.png')";
                        } else if ($(i + '.' + j).innerHTML == 6) {
                            $(i + '.' + j).style.backgroundImage = "url('./images/mine_6.png')";
                        } else if ($(i + '.' + j).innerHTML == 7) {
                            $(i + '.' + j).style.backgroundImage = "url('./images/mine_7.png')";
                        } else if ($(i + '.' + j).innerHTML == 8) {
                            $(i + '.' + j).style.backgroundImage = "url('./images/mine_8.png')";
                        }
                        if (!($(i + '.' + j).innerHTML)) {
                            if ($(i + '.' + j).dataset['sign'] == 'sure') {
                                $(i + '.' + j).style.backgroundImage = "url('./images/sign.png')";
                            };
                            if ($(i + '.' + j).dataset['sign'] == 'issue') {
                                $(i + '.' + j).style.backgroundImage = "url('./images/querycell.png')";
                            };
                            if (!($(i + '.' + j).dataset['sign'])) {
                                $(i + '.' + j).style.backgroundImage = "";
                            }
                        }
                    }
                }
            },
            // 游戏结束逻辑
            gameOver: function() {
                // 结束定时器
                clearInterval(this.leftTimer);
                // 如果游戏结束就把所有隐藏的地雷显示出来
                for (var i = 0; i < this.rows; i++) {
                    for (var j = 0; j < this.cols; j++) {
                        if ($(i + '.' + j).id == 'mine') {
                            $(i + '.' + j).style.backgroundImage = "url('./images/mine.png')";
                            // $(i+'.'+j).style.backgroundColor = 'red';
                            // console.log(i,j)
                        };
                        if ($(i + '.' + j).id != 0 && $(i + '.' + j).id != 'mine') {
                            var id = parseInt($(i + '.' + j).id);
                            $(i + '.' + j).style.backgroundImage = "url('./images/mine_" + id + ".png')";
                        };
                    }
                }
            },
            // 游戏失败特效---震动和爆炸
            rock: function() {
                var _this = this;
                var rockTime = null;
                $('bowmusic').play();
                rockTime = setInterval(function() {
                    var left = Math.abs(Math.random() * 80 - 20) / 2;
                    var top = Math.abs(Math.random() * 80 - 20) / 2;
                    $('box').style.marginLeft = left - 180 + 'px';
                    $('box').style.marginTop = top - 180 + 'px';
                }, 20)
                setTimeout(function() {
                    $('box').style.left = '50%';
                    $('box').style.top = '50%';
                    clearInterval(rockTime);
                    // alert('你炸了！！！！');
                    // if (confirm('重新开始？？')) {
                    // 	window.location.reload();
                    // };
                    // 失败后禁止点击
                    _this.isOver = !_this.isOver;
                    //爆炸效果

                    $('box').style.perspective = "1000px";
                    var siv = $('box').children;
                    for (var i = 0; i < siv.length; i++) {
                        siv[i].style.backgroundColor = 'transparent';
                        for (var j = 0; j < siv[i].children.length; j++) {
                            siv[i].children[j].style.transition = '0.5s all';
                            // console.log(3343);
                            var x = Math.random() * 1000 - 500;
                            var y = Math.random() * 600 - 300;
                            var z = Math.random() * 600 - 300;
                            var rotX = Math.random() * 360;
                            var rotY = Math.random() * 360;
                            var rotZ = Math.random() * 360;
                            siv[i].children[j].style.transform = "translate3d(" + x + "px, " + y + "px, " + z + "px) rotateX(" + rotX + "deg) rotateY(" + rotY + "deg) rotateZ(" + rotZ + "deg)";
                        }
                    };
                    $('replay').style.bottom = "100px";
                    _this.replay();
                }, 400)
            },
            // 游戏成功后效果
            success: function() {
                var _this = this;
                $('box').style.transition = '0.3s all';
                $('box').style.transform = "rotateX(" + (control.pX + control.y / 4) + "deg)" + " " + "rotateY(" + (control.pY + control.x / 4) + "deg)" + " " + "scale3d(" + 1.4 * control.boxScale + "," + 1.4 * control.boxScale + "," + 1.4 * control.boxScale + ")";
                $('box').addEventListener('transitionend', function() {
                    $('box').style.transition = '0.5s all';
                    $('box').style.transform = "rotateX(" + (control.pX + control.y / 4) + "deg)" + " " + "rotateY(" + (control.pY + control.x / 4) + "deg)" + " " + "scale3d(" + 0 * control.boxScale + "," + 0 * control.boxScale + "," + 0 * control.boxScale + ")";
                });
                setTimeout(function() {
                    _this.nextGame();
                }, 700)
            },
            // 游戏失败后重新玩特效和逻辑
            replay: function() {
                var _this = this;
                $('replay').onclick = function() {
                    // alert(88)
                    $('box').style.perspective = "";
                    var siv = $('box').children;
                    for (var i = 0; i < siv.length; i++) {
                        siv[i].style.backgroundColor = 'transparent';
                        for (var j = 0; j < siv[i].children.length; j++) {
                            siv[i].children[j].style.backgroundImage = "url('./images/noactcell.png')"
                            siv[i].children[j].id = '';
                            siv[i].children[j].dataset['sign'] = '';
                            siv[i].children[j].innerHTML = '';
                            siv[i].children[j].style.transform = '';
                            siv[i].children[j].style.transition = '0.5s all';
                        }
                    };
                    _this.isOver = !_this.isOver;
                    _this.temp = true;
                    $("replay").style.bottom = "-10%";
                    _this.time = 60;
                    var flag = true;
                    $('tab_red').style.opacity = 0;
                    _this.leftTimer = setInterval(function() {
                        _this.time--;
                        if (_this.time <= 15) {
                            $('tab_red').style.opacity = flag ? 0.9 : 0.1;
                            console.log(77)
                        };
                        flag = !flag;
                        if (_this.time <= 0) {
                            clearInterval(_this.leftTimer);
                            _this.time == 0;
                            _this.gameOver();
                            _this.rock();
                        }
                        $('hasTime').innerHTML = _this.time;
                        // console.log(_this.time);
                    }, 1000);
                    $('hasMine').innerHTML = 20;
                }
            },
            // 进入下一关
            nextGame: function() {
                $('next_game').style.transform = 'scale(1)';
                $('next_game').onclick = function() {
                    window.location.reload();
                }
            },
            // 游戏倒计时设置
            setTime: function() {
                var _this = this;
                var flag = true;
                this.leftTimer = setInterval(function() {
                    _this.time--;
                    if (_this.time <= 15) {
                        $('tab_red').style.opacity = flag ? 0.9 : 0.1;
                    };
                    flag = !flag;
                    if (_this.time == 0) {
                        clearInterval(_this.leftTimer);
                        _this.time == 0;
                        _this.gameOver();
                        _this.rock();
                    }
                    $('hasTime').innerHTML = _this.time;
                    // console.log(_this.time);
                }, 1000);
            },

        }
        // 界面控制
    var control = {
        body: document.body,
        box: $('box'),
        cover: $('cover'),
        button: $('button'),
        control: $('control'),
        controlBox: $('control_box'),

        timer: null, //用于设置开始游戏前的定时器
        flag: false,
        x: 0,
        y: 0,
        sStr: 0, //得到鼠标松开时候的transform字符串
        yStr: 0, //得到鼠标松开时候的transform字符串
        pX: -10, //记录鼠标松开时候已经旋转的X角度
        pY: -30, //记录鼠标松开时候已经旋转的Y角度
        xx: 0, //记录鼠标按下时的x坐标
        yy: 0, //记录鼠标按下时的y坐标
        barYY: 0, //记录右边控制条
        upBarY: 0, //记录鼠标松开后控制块移动的距离
        boxScale: 1, // 改变方块大小
        forBUG: 0, //解决不知名bug
        isStop: false,
        // 游戏界面魔方旋转控制
        mouseMove: function(e) {
            var _this = this;
            this.body.onmousedown = function(e) {
                e.stopPropagation();
                _this.flag = true;
                _this.xx = e.pageX;
                _this.yy = e.pageY;
            };
            this.body.onmousemove = function(e) {
                e.stopPropagation();
                if (_this.flag) {
                    _this.x = e.pageX - _this.xx;
                    _this.y = e.pageY - _this.yy;
                    // transform:rotateX(7deg) rotateY(-25deg)
                    _this.box.style.transform = "rotateX(" + (_this.pX + _this.y / -4) + "deg)" + " " + "rotateY(" + (_this.pY + _this.x / 4) + "deg)" + " " + "scale3d(" + _this.boxScale + "," + _this.boxScale + "," + _this.boxScale + ")";
                };
            };
            this.body.onmouseup = function(e) {
                e.stopPropagation();
                _this.flag = false;
                var smg = _this.box.style.transform;
                _this.xStr = smg.slice(0, smg.indexOf(" "));
                _this.yStr = smg.slice(smg.indexOf(" "), smg.indexOf("scale3d"));
                _this.pX = _this.xStr.replace(/[^0-9.-]/ig, "");
                _this.pX = parseInt(_this.pX);
                _this.pY = _this.yStr.replace(/[^0-9.-]/ig, "");
                _this.pY = parseInt(_this.pY);
                //清除控制条
                _this.control.onmousemove = null;
                _this.upBarY = _this.barYY;
            };
        },
        // 游戏开始前的自动旋转
        autoRotate: function() {
            var _this = this;
            this.timer = setInterval(function() {
                _this.pY += 1;
                _this.box.style.transform = "rotateX(-10deg)" + " " + "rotateY(" + _this.pY + "deg)" + " " + "scale3d(0.5,0.5,0.5)";
            }, 60)
        },
        // 用来阻止冒泡的各位
        returnFalse: function(e) {
            this.cover.onclick = function(e) {
                e.stopPropagation();
            };
            this.cover.onmousedown = function(e) {
                e.stopPropagation();
            };
            this.cover.onmousemove = function(e) {
                e.stopPropagation();
            };
            this.cover.onmouseup = function(e) {
                e.stopPropagation();
            }
        },
        // 开始游戏逻辑
        startGame: function(e) {
            var _this = this;
            control.stopBtn();
            control.musicBtn();
            this.button.onclick = function(e) {
                // 开始倒计时
                game.setTime();
                //魔方变大
                _this.box.style.transform = "rotateX(-10deg)" + " " + "rotateY(" + _this.pY + "deg)" + " " + "scale3d(1,1,1)";
                // 隐藏开始按钮
                this.style.bottom = '-10%';
                // 动画结束隐藏遮罩层
                this.addEventListener("transitionend", function() {
                    _this.cover.style.display = 'none';
                })
                _this.box.addEventListener("transitionend", function() {
                    _this.box.style.transition = 'none';
                });
                // 控制条出现
                _this.control.style.right = '100px';
                _this.controlBar();
                clearInterval(_this.timer);
                //剩余时间出现//剩余雷数出现
                $('time_tab').style.left = '40px';
                $('mine_tab').style.left = '40px';

                //暂停游戏按钮出现//暂停音乐按钮出现
                $('play_btn').style.top = '30px';
                $('music_play_btn').style.top = '30px';


            }
        },
        // 右边控制条
        controlBar: function(e) {
            var _this = this;
            this.controlBox.onmousedown = function(e) {
                e.stopPropagation();
                var barY = e.pageY;
                _this.control.onmousemove = function(e) {
                    e.stopPropagation();
                    _this.barYY = e.pageY - barY + _this.upBarY;
                    _this.barYY = _this.barYY > 170 ? 170 : _this.barYY;
                    _this.barYY = _this.barYY < -170 ? -170 : _this.barYY;
                    _this.controlBox.style.transform = 'translateY(' + _this.barYY + 'px)';

                    // 改变方块大小
                    _this.boxScale = 1 + (_this.barYY * 0.003);
                    _this.box.style.transform = "rotateX(" + (_this.pX + _this.y / 4) + "deg)" + " " + "rotateY(" + (_this.pY + _this.x / 4) + "deg)" + " " + "scale3d(" + _this.boxScale + "," + _this.boxScale + "," + _this.boxScale + ")";
                }
            };
        },
        //暂停开始
        stopBtn: function() {
            var _this = this;
            $('play_btn').onclick = function(e) {
                e.stopPropagation();
                _this.isStop = !_this.isStop;
                if (_this.isStop) {
                    $('play_cover').style.display = 'block';
                    setTimeout(function() {
                        $('play_cover').style.opacity = 0.5;
                    }, 0)
                    clearInterval(game.leftTimer);
                    $('play_btn').style.backgroundImage = 'url(./images/play_btn2.png)';
                } else {
                    $('play_cover').style.opacity = 0;
                    setTimeout(function() {
                        $('play_cover').style.display = 'none';
                    }, 500);
                    clearInterval(game.leftTimer);
                    $('play_btn').style.backgroundImage = 'url(./images/stop_btn.png)';
                    var flag = true;
                    game.leftTimer = setInterval(function() {
                        game.time--;
                        if (game.time <= 15) {
                            $('tab_red').style.opacity = flag ? 0.9 : 0.1;
                        };
                        flag = !flag;
                        if (game.time <= 0) {
                            clearInterval(game.leftTimer);
                            game.time == 0;
                            game.gameOver();
                            game.rock();
                        }
                        $('hasTime').innerHTML = game.time;
                        // console.log(game.time);
                    }, 1000);
                };

            };
            $('play_btn').onmousedown = function(e) {
                e.stopPropagation();
            };
            $('play_btn').onmousedown = function(e) {
                e.stopPropagation();
            };
            $('play_btn').onmouseup = function(e) {
                e.stopPropagation();
            };
            $('play_cover').onmousedown = function(e) {
                e.stopPropagation();
            };
            $('play_cover').onmousedown = function(e) {
                e.stopPropagation();
            };
            $('play_cover').onmouseup = function(e) {
                e.stopPropagation();
            };
        },
        // 音乐播放
        musicBtn: function() {
            var flag = true;
            $('music_play_btn').onclick = function(e) {
                e.stopPropagation();
                if (flag) {
                    $('bgmusic').pause();
                    flag = !flag;
                    $('music_play_btn').style.backgroundImage = 'url(./images/music_btn.png)';
                } else {
                    $('bgmusic').play();
                    flag = !flag;
                    $('music_play_btn').style.backgroundImage = 'url(./images/music_btn_stop.png)';
                }
            };
            $('music_play_btn').onmousedown = function(e) {
                e.stopPropagation();
            };
            $('music_play_btn').onmousemove = function(e) {
                e.stopPropagation();
            };
            $('music_play_btn').onmouseup = function(e) {
                e.stopPropagation();
            };
        }
    };
    // control.mouseMove();
    // control.autoRotate();
    // control.returnFalse();
    // control.startGame();
    // game.onclick();
    $('bgmusic').volume = 0.3;


    function loadImg(arr, callback) {
        var imgs = {};
        var count = 0;
        var resource = document.getElementById('resource');
        var span = resource.children[0].children[0];
        var index = 0
        console.log(span);
        var timer;
        timer = setInterval(function() {
            index++;
            var res = index % 5;
            if (res == 0) {
                span.innerHTML = '.'
            } else if (res == 1) {
                span.innerHTML = '..'
            } else if (res == 2) {
                span.innerHTML = '...'
            } else if (res == 3) {
                span.innerHTML = '....'
            } else if (res == 4) {
                span.innerHTML = '.....'
            } else if (res == 5) {
                span.innerHTML = '......'
            }
        }, 300)
        for (var i = 0; i < arr.length; i++) {
            var img = new Image();
            img.src = "./images/" + arr[i] + ".png";
            imgs[arr[i]] = img;
            img.onload = function() {
                count++;
                if (count == arr.length) {
                    callback(imgs);
                    console.log(count);
                    clearInterval(timer);
                    resource.style.display = 'none';
                }
            }
        };
    }

    // '激活的格子', '未激活的格子', '未完待续', '疑问标记'
    // actcell        noactcell      continue   querycell
    var imgArr = ['actcell', 'noactcell', 'continue', 'querycell', 'control_bar', 'control_box', 'ice_bg', 'mine_1', 'mine_2', 'mine_3', 'mine_4', 'mine_5', 'mine_6', 'mine_7', 'mine_8', 'mine_bg', 'mine', 'music_btn_stop', 'music_btn', 'play_btn', 'play_btn2', 'replay_btn', 'sign', 'stop_btn', 'tab', 'tabred'];
    loadImg(imgArr, function() {
        control.mouseMove();
        control.autoRotate();
        control.returnFalse();
        control.startGame();
        game.onclick();
    })