/**
 * @name：订餐管理 - 历史订单
 * @author：孟鑫
 */
var Model = {
    //页面初始化
    init: function () {
        layui.use('laydate', function(){
            var laydate = layui.laydate;

            laydate.render({
                elem: '#startTime',
                type: 'datetime',
                max: 0
            });
            laydate.render({
                elem: '#endTime',
                type: 'datetime',
                max: 0
            });
        });
        //绘制数据
        Model.todayList();
        //导出列表
        Model.download();

        $('.btnGroup .today').addClass('hidden')
        $('.btnGroup .order' ).removeClass('hidden')

    },
    todayList: function (data) {
        $.ajax({
            url: URL_BACKSTAGE + '/manager/order/history?r=' + Math.random(),
            data: data,
            dataType: '',
            type: 'GET',
            beforeSend: function (request) {
                // request.setRequestHeader('Authorization', _token);
            },
            success: function (res) {
                if (res.code == 1) {
                    var todayhtml = [];
                    res.data.list.forEach(function (item) {
                        todayhtml.push('<ul class="list-content clearfix">');
                        todayhtml.push('        <li class="user-name">');
                        todayhtml.push('            <span>' + item.userName + '</span>');
                        todayhtml.push('        </li>');
                        todayhtml.push('        <li class="user-phone">' + item.tel + '</li>');
                        todayhtml.push('        <li class="operation-btn">');
                        todayhtml.push('            <button class="layui-btn" user-id="' + item.userId + '">查看</button>');
                        todayhtml.push('        </li>');
                        todayhtml.push('    </ul>');
                    });
                    $('.theList').html(todayhtml.join(''));


                    //页面参数
                    var data ={
                        pageNum: $('#page .page').val() || 1,
                        pageSize: res.data.pageSize
                    }

                    //分页传参
                    var options = {
                        event: '#paging',
                        currentPage: $('#page .page').val() || 1,
                        total: res.data.total
                    };
                    //分页
                    Pager(options, function (option) {
                        options.pageSize = option.pageSize;
                        options.currentPage = option.currentPage;
                        Model.todayList(data);
                    });


                    //点击查看
                    Model.Examine();

                    //筛选
                    Model.screen(data);

                    $('.list-title .num').html('历史订单总价：' + res.sum + '元')

                    $('.btnGroup .download').removeAttr('disabled','disabled')
                    $('.btnGroup .download').removeClass('layui-btn-disabled')


                } else if (res.code == 3) {
                    var todayhtml = [];
                    todayhtml.push('    <div class="nodata">\n' +
                        '        <img src="imgs/nodatabig.png" height="183" width="177"/>\n' +
                        '    </div>')
                    $('.theList').html(todayhtml.join(''));

                    $('.btnGroup .download').attr('disabled','disabled')
                    $('.btnGroup .download').addClass('layui-btn-disabled')
                }
            }
        });
    },
    Examine: function () {
        $('.operation-btn button').off('click').on('click', function () {
            var userId = $(this).attr('user-id');
            var title = $(this).parents('.list-content').find('.user-name span').html()
            var tel = $(this).parents('.list-content').find('.user-phone').html()

            layer.open({
                type: 1,
                area: ['750px', '640px'],
                title: title + '的订单',
                closeBtn: 0,
                content: $('#popup'),
                success: function (layero, index) {

                    var data = {
                        userId: userId,
                        pageNum:$('#popup-page .page').val() || 1,
                        pageSize:10
                    }
                    Model.popuoList(data,userId,title,tel)

                    $('.layui-layer-shade,.close-btn').off('click').on('click', function () {
                        layer.close(index);
                    })
                },
                end: function () {
                }
            });


        });
    },
    //筛选
    screen :function ( data) {
        $('.screen button').off('click').on('click',function () {
            data = {
                startTime: $('#startTime').val(),
                endTime: $('#endTime').val()
            }
            //绘制数据
            Model.todayList(data);
        });
    },
    popuoList :function (data,userId,title,tel) {
        if($('#startTime').val().length != 0){
            data.startTime =  $('#startTime').val()
        }
        if($('#endTime').val().length != 0) {
            data.endTime =  $('#endTime').val()
        }
        data.userId = userId
        $.ajax({
            url: 'http://192.168.188.19:8085/user/userId?=' + Math.random(),
            data: data,
            type: 'GET',
            beforeSend: function (request) {
                // request.setRequestHeader('Authorization', _token);
            },
            success: function (res) {
                if (res.code == 1) {
                    var popupList = [];
                    res.data.list.forEach(function (item) {
                        popupList.push('<ul class="list-content clearfix">');
                        popupList.push('    <li class="user-name"><span>' + title+ '</span></li>');
                        popupList.push('    <li class="user-phone">' + tel + '</li>');
                        popupList.push('    <li class="user-list-time">' + (item.shortDate || '') + '</li>');
                        if (item.status == 0) {
                            popupList.push('        <li class="user-last-time">未支付</li>');
                        } else if (item.status == 1) {
                            popupList.push('        <li class="user-last-time">已支付</li>');
                        } else if (item.status == 2) {
                            popupList.push('        <li class="user-last-time">过期未支付</li>');
                        }
                        popupList.push('</ul>');
                    })

                    $('.popup-list').html(popupList.join(''));


                    var data ={
                        pageNum:res.data.nextPage,
                        pageSize: res.data.pageSize
                    }

                    //分页传参
                    var options = {
                        event: '#popup-page',
                        currentPage: res.data.pageNum,
                        total: res.data.total,
                        pageSize: res.data.pageSize
                    };
                    //分页
                    Pager(options, function (option) {
                        options.pageSize = option.pageSize;
                        options.currentPage = option.currentPage;
                        Model.popuoList(data,userId,title,tel);
                    });
                } else if(res.code == 3){
                    var todayhtml = [];
                    todayhtml.push('    <div class="nodata">\n' +
                        '        <img src="imgs/nodatabig.png" height="183" width="177"/>\n' +
                        '    </div>')
                    $('.theList').html(todayhtml.join(''));

                }
            },
            error: function () {


            }

        });
    },
    //导出列表
    download: function () {
        if($('#startTime').val().length > 0){
            var startTime =  $('#startTime').val()
        }
        if($('#endTime').val().length > 0) {
            var endTime =  $('#endTime').val()
        }
        $('.order').off('click').on('click', function () {
            $.ajax({
                url: URL_BACKSTAGE + '/manager/export/history',
                data :{},
                type: 'GET',
                beforeSend: function (request) {
                    // request.setRequestHeader('Authorization', _token);
                },
                success: function (res) {
                    if($('#startTime').val().length > 0 && $('#endTime').val().length > 0){
                        window.open(URL_BACKSTAGE + '/manager/export/history?startTime='+startTime+'&endTime='+ endTime )
                    }else{
                        window.open(URL_BACKSTAGE + '/manager/export/history?')
                    }
                },
                error: function () {

                }
            })
        })
    }
};
//分页
var Pager = function (option, callback) {
    if (!option.pageSize) {
        option.pageSize = 15;
    }
    if (!option.currentPage) {
        option.currentPage = 1;
    }
    var $event = $(option.event);
    var total = Math.ceil(option.total / option.pageSize);
    var html = [];
    if (total < 2) {
        $(option.event).html('');
        return false;
    }
    html.push('<ul class="pager">');
    html.push('<li class="total">共 ' + total + ' 页</li>');
    if (option.currentPage > 1) {
        html.push('<li class="first"><i class="layui-icon">&#xe65a;</i></li>');
    } else {
        html.push('<li class="first disabled"><i class="layui-icon">&#xe65a;</i></li>');
    }
    if (option.currentPage > 1) {
        html.push('<li class="prev"><i class="layui-icon">&#xe603;</i></li>');
    } else {
        html.push('<li class="prev disabled"><i class="layui-icon">&#xe603;</i></li>');
    }
    html.push('<li class="page"><input type="number" class="PageNum" value="' + option.currentPage + '"></li>');
    if (option.currentPage < total) {
        html.push('<li class="next"><i class="layui-icon">&#xe602;</i></li>');
    } else {
        html.push('<li class="next disabled"><i class="layui-icon">&#xe602;</i></li>');
    }
    if (option.currentPage < total) {
        html.push('<li class="last"><i class="layui-icon">&#xe65b;</i></li>');
    } else {
        html.push('<li class="first disabled"><i class="layui-icon">&#xe65b;</i></li>');
    }
    html.push('<li class="jump">跳转</li>');
    html.push('</ul>');
    $event.html(html.join(''));

    //首页
    $event.find('.first').off('click').on('click', function () {
        if (!$(this).hasClass('disabled')) {
            option.currentPage = 1;
            $event.find('.PageNum').val(option.currentPage);
            $(this).addClass('disabled');
            $event.find('.prev').addClass('disabled');
            $event.find('.last').removeClass('disabled');
            $event.find('.next').removeClass('disabled');
            callback(option)
        }
    });
    //上一页
    $event.find('.prev').off('click').on('click', function () {
        if (!$(this).hasClass('disabled')) {
            option.currentPage--;
            $event.find('.PageNum').val(option.currentPage);
            if (option.currentPage > 1) {
                $(this).removeClass('disabled');
                $event.find('.first').removeClass('disabled');
            } else {
                $(this).addClass('disabled');
                $event.find('.first').addClass('disabled');
                $event.find('.last').removeClass('disabled');
                $event.find('.next').removeClass('disabled');
            }
            callback(option)
        }
    });
    //下一页
    $event.find('.next').off('click').on('click', function () {
        if (!$(this).hasClass('disabled')) {
            option.currentPage++;
            $event.find('.PageNum').val(option.currentPage);
            if (total > option.currentPage) {
                $event.find('.prev').removeClass('disabled');
                $event.find('.first').removeClass('disabled');
            } else {
                $(this).addClass('disabled');
                $event.find('.last').addClass('disabled');
                $event.find('.prev').removeClass('disabled');
                $event.find('.first').removeClass('disabled');
            }
            callback(option)
        }
    });
    //末页
    $event.find('.last').off('click').on('click', function () {
        if (!$(this).hasClass('disabled')) {
            option.currentPage = total;
            $event.find('.PageNum').val(option.currentPage);
            $(this).addClass('disabled');
            $event.find('.next').addClass('disabled');
            $event.find('.first').removeClass('disabled');
            $event.find('.prev').removeClass('disabled');
            callback(option)
        }
    });
    //选页
    $event.find('.jump').off('click').on('click', function () {
        if ($event.find('.PageNum').val() > total) {
            option.currentPage = total;
            $event.find('.PageNum').val(option.currentPage);
            $event.find('.first').removeClass('disabled');
            $event.find('.prev').removeClass('disabled');
            $event.find('.last').addClass('disabled');
            $event.find('.next').addClass('disabled');
        }
        if ($event.find('.PageNum').val() <= 1) {
            option.currentPage = 1;
            $event.find('.PageNum').val(option.currentPage);
            $event.find('.first').addClass('disabled');
            $event.find('.prev').addClass('disabled');
            $event.find('.last').removeClass('disabled');
            $event.find('.next').removeClass('disabled');
        } else {
            option.currentPage = parseInt($event.find('.PageNum').val());
            $event.find('.first').removeClass('disabled');
            $event.find('.prev').removeClass('disabled');
            $event.find('.last').removeClass('disabled');
            $event.find('.next').removeClass('disabled');
        }
        callback(option)
    });
};