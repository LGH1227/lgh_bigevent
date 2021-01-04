$(function () {

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    template.defaults.imports.dataFormat = function (date) {

        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    var q = {

        pagenum: 1,  // 第几页
        pagesize: 2,  // 一夜有几条数据
        cate_id: '',  // 页面id
        state: ''  // 文章发布状态
    }

    initTable()
    initCate()
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })

    }

    function initCate() {

        $.ajax({

            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {

                if ('res.status !==0') {

                    return layer.msg('获取文章分类列表失败！')
                }

                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    $("#form-search").on('submit', function (e) {

        e.preventDefault();
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    function renderPage(total) {

        // console.log(total);
        laypage.render({

            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum,// 设置默认被选中的分页
            limits: [2, 3, 5, 10], // 下拉单中,每页显示几条数据
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],

            jump: function (obj, first) {

                console.log(obj.curr);
                q.pagenum = obj.curr
                q.pagesize = obj.limit

                if (!first) {

                    initTable()
                }
            }
        })
    }
    $('tbody').on('click', '.btn-delete', function () {

        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {

            $.ajax({

                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {

                    if (res.status !== 0) {

                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')

                    if (len === 1) {

                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()

                }
            })
            layer.close(index)
        })

    })
})
