/**
 * @name：订餐管理 - 今日订单
 * @author：孟鑫
 */
var Model = {
    //页面初始化
    init: function () {
        //列表绘制
        Model.todayList();

        $('.btnGroup .order').addClass('hidden')
        $('.btnGroup .today').removeClass('hidden')

        //导出列表
        Model.download()
    },
    //列表绘制
    todayList: function () {
        $.ajax({
            url: URL_BACKSTAGE + '/manager/order/now?r=' + Math.random(),
            data: {
                pageNum: 1,
                pageSize: 15
            },
            dataType: '',
            type: 'GET',
            beforeSend: function (request) {
                // request.setRequestHeader('Authorization', _token);
            },
            success: function (res) {
                if (res.code == 1) {
                    if (res.data) {
                        console.log(res.data);
                        var todayhtml = [];
                        res.data.list.forEach(function (item) {
                            todayhtml.push('<ul class="list-content clearfix">');
                            todayhtml.push('        <li class="user-name">');
                            todayhtml.push('            <span>' + item.userName + '</span>');
                            todayhtml.push('        </li>');
                            todayhtml.push('        <li class="user-phone">' + item.tel + '</li>');
                            todayhtml.push('        <li class="user-last-time">' + item.cTime + '</li>');
                            if (item.status == 0) {
                                todayhtml.push('        <li class="user-last-time">未支付</li>');
                            } else if (item.status == 1) {
                                todayhtml.push('        <li class="user-last-time">已支付</li>');
                            } else if (item.status == 2) {
                                todayhtml.push('        <li class="user-last-time">过期未支付</li>');
                            }
                            todayhtml.push('        <li class="operation-btn">');
                            todayhtml.push('            <button class="layui-btn" data-userId="' + item.id + '">操作</button>');
                            todayhtml.push('        </li>');
                            todayhtml.push('    </ul>');
                        });
                        $('.theList').html(todayhtml.join(''));

                        //分页传参
                        var options = {
                            event: '#paging',
                            currentPage: 1,
                            total: res.data.total
                        };
                        //分页
                        Pager(options, function (option) {
                            options.pageSize = option.pageSize;
                            options.currentPage = option.currentPage;
                            Model.todayList();
                        });

                        $('.list-title .num').html('今日订单总价：'+ res.sum + '元')
                    }
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
    //导出列表
    download: function () {
        $('.today').off('click').on('click', function () {
            window.open(URL_BACKSTAGE + '/manager/export/now')
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