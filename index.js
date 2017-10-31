/**
 * Created by Administrator on 2017/4/10.
 */
$(document).ready(function(){
    let arr=[];    //52张牌存放数组
    let stylearr=['c','d','h','s'];  //定义花色数组
    let mark=[];   //检查是否有重复的数组
    while (arr.length<52) {
        let number = Math.ceil(Math.random() * 13);  //随机产生一个1-13的数字
        let style = stylearr[Math.floor(Math.random() * stylearr.length)];//花色
        if (!mark[number + style]) {    //如果mark数组中没有
            mark[number + style] = true;  //数字+花色：true的形式存入mark
            arr.push({number, style});  //存入arr得到52张随机牌
        }
    }   //将牌放入
        let n=0;
        for(let i=0;i<7;i++){
            for(let j=0;j<i;j++){
                $('<li class="pai">').attr('id',i+'-'+j).attr('value',arr[n].number).css('background',`url(img/${arr[n].number}${arr[n].style}.png)`).delay(n*50).animate({left:300-50*i+100*j,top:50*i,opacity:1},600).appendTo('ul');
                n++;
            }
        }

    //剩余牌置入左下角
    for(;n<52;n++){
        $('<li class="pai old">').attr('id',1+'-'+n).attr('value',arr[n].number).css('background',`url(img/${arr[n].number}${arr[n].style}.png)`).delay(n*50).animate({left:100,top:470,opacity:1},600).appendTo('ul');
        console.log($('li').attr('id'))
    }
    //点击事件
    let current=null;
    $('.pai').click(function () {
        let x=$(this).attr('id').split('-')[0];//将创建好的id分割成数组数字给x
        let y=$(this).attr('id').split('-')[1];       //花色给y
        if($(`#${parseInt(x)+1}-${parseInt(y)}`).length==1||$(`#${parseInt(x)+1}-${parseInt(y)+1}`).length==1){
            return;
        }
        $(this).toggleClass('active');

     //相加等于13相消

        if(!current){
            current=$(this);
            if(parseInt($(this).attr('value'))===13){
                $('.active').animate({
                    left:600,top:0,opacity:0
                },400,function () {
                    $('.active').remove();
                    current=null;
                })
            }
        }else{
            if(parseInt(current.attr('value'))+parseInt($(this).attr('value'))===13){
                $('.active').animate({
                    left:600,top:0,opacity:0
                },400,function () {
                    $('.active').remove();
                    current=null;
                })
            }else{
                setTimeout(function () {
                    $('.active').removeClass('active');
                    current=null;
                },400)
            }
        }
    });
    //点击按钮
    let left=$('button:nth-child(1)');
    let right=$('button:nth-child(2)');
    let index=1;
    right.click(function () {
            $('.old').last().removeClass('old').addClass('new').animate({
                left:450,
            },500).css('z-index',index++)

    });
    left.click(function () {
        $('.new').removeClass('new').addClass('old').each(function (index) {
            $(this).delay(50*index).animate({
                left:100,top:470
            },500).css('z-index',index++);
        })
    });
    $('button:nth-child(3)').click(function () {
        history.go(0)
    })
});