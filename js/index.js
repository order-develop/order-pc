/**
 * @name：订餐管理
 * @author：孟鑫
 */
$(function () {
    layui.use(['layer', 'form'], function () {
        var layer = layui.layer, form = layui.form;

    });
    info.init();
});
var info = {
    init: function () {

        //Tab切换
        info.TabChange();

        //默认加载第一个Tab模块
        $('.column li').eq(0).click();

        $('.column li').hover(function () {
            $(this).addClass('li_hover');
        }, function () {
            $(this).removeClass('li_hover');
        });

    },
    //Tab切换
    TabChange: function () {
        $('.column li').off('click').on('click', function () {
            var model = $(this).attr('model');
            $('.column li').removeClass('li_active');
            $(this).addClass('li_active');

            $('.indent-list').load('model/' + model + '.html', function () {
                $.getScript('js/' + model + '.js', function () {
                    Model.init();
                });
            });
        });
    },

};