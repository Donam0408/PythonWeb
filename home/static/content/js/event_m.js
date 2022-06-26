$(function () {
    //slide
    //$('#dg-container').gallery({
    //    autoplay: true
    //});
    $(window).load(function () {
        $('#slider').nivoSlider();
    });
    //end slide
    //up top
    $(window).scroll(function () {
        if ($(this).scrollTop() > 800) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }
    });

    $('.scrollup').click(function () {
        $("html, body").animate({ scrollTop: 0 }, 800);
        return false;
    });
    $('#send_yc').click(function () {
        send_ycbook();
    });
    $("#searchbox").hide();
    $("#searchbox").animate({ right: "-600px" }, "slow");

    $('#search_bt').click(function () {
        $("#searchbox").show();
        $("#search_bt").css('visibility', 'hidden');
        $("#searchbox").animate({ right: "0" }, "slow");
        $("input.inputSearch:last").focus();
    });
    
    $('#close_search').click(function () {
        $("#search_bt").css('visibility', 'visible');
        $("#searchbox").animate({ right: "-600px" }, "slow");
    });

    //end uptop
    //car
    $('ul#user_interaction1').carouFredSel5({
        auto: false,
        prev: "#prev1",
        next: "#next1",
        items: {
            visible: 4,
        },
    });
    $('ul#user_interaction2').carouFredSel5({
        auto: false,
        prev: "#prev2",
        next: "#next2",
        items: {
            visible: 4,
        },
    });
    $('ul#user_interaction3').carouFredSel5({
        auto: false,
        prev: "#prev3",
        next: "#next3",
        items: {
            visible: 4,
        },
    });
    $('ul#user_interaction4').carouFredSel5({
        auto: false,
        prev: "#prev4",
        next: "#next4",
        items: {
            visible: 4,
        },
    });
    $('ul#user_interaction5').carouFredSel5({
        auto: false,
        prev: "#prev5",
        next: "#next5",
        items: {
            visible: 4,
        },
    });
    $('ul#user_interaction6').carouFredSel5({
        auto: false,
        prev: "#prev6",
        next: "#next6",
        items: {
            visible: 4,
        },
    });
    $('ul#user_interaction9').carouFredSel5({
        auto: false,
        prev: "#prev9",
        next: "#next9",
        items: {
            visible: 4,
        },
    });
    $('ul#user_interaction10').carouFredSel5({
        auto: false,
        prev: "#prev10",
        next: "#next10",
        items: {
            visible: 4,
        },
    });
    //end car
    //refesh captcha
    $('.refeshcaptcha').click(function () {
        $('.captcha_img').load('/Captcha/Show');
        $('.captcha_img').attr('src', '/Captcha/Show');
    });
    //end refesh captcha
    //star
    //$('.starno1').rating({
    //});
    //$('.starno2').rating({
    //});
    //$('.starno3').rating({
    //});
    //$('.starno4').rating({
    //});
    //$('.starno5').rating({
    //});

    $('.star4').rating({
        callback: function (value) {
            if (value > 0) {
                AddStar(value);
            }
        }
    });
    $('.starnologin').rating({
        callback: function (value) {
            alert("Quý khách vui lòng đăng nhập.Để đánh giá cuốn sách. Xin cảm ơn!");
            document.location.href = "/dang-nhap.html";
        }
    });
    //end star
   
});
function showMsgbox() {
   
    var url = '/acc/OpenMsgBox';
    alert('ok' + url);
    if ($("#dlgMsgBox2").length == 0) {
        // ajax load
        alert('ok1' + url);
        $('#divMsgBox').load(url);
    }
    else {
        alert('ok2' + url);
        $('#divMsgBox').load(url);
    }

}
function show_Login() {
    if ($("#dlgLogin").length == 0) {
        // ajax load
        $('#divLogon').load("/Acc/OpenLogin");
    } else {
        // clear username & password fields
        $('#lable_messager').html('');
        $('#UsernameL').val('');
        $('#PasswordL').val('');
        // reopen the login dialog which was previously rendered
        $("#dlgLogin").dialog("open");
        $('.pnContent').show();
        $('#lable_messager').html('');
        $('#UserNameL').val('');
    }

}

$(document).ready(function () {
    // $('.list_book_scoll').each(function () {
    //     var item = $(this).find('li').size();
    //     var item_w = $(this).find('li').width();
    //     //$(this).find('ul').css({'width':(item*(item_w+6))/2 + 'px'});
    //     $(this).find('ul').css({ 'width': item * (item_w + 6) + 'px' });
    // });

    $(".search-box").keyup(function () {
        if ($(this).val().length > 2) {
            $.ajax({
                type: "POST",
                url: "/Home/SearchAjax",
                data: 'key=' + $(this).val(),
                beforeSend: function () {
                    //$("#search-box").css("background", "#FFF url(LoaderIcon.gif) no-repeat 165px");
                },
                success: function (data) {
                    if (data.success == 0) {
                        $("#divBoxSearchData").show();
                        $("#idScrllLoadData").html(data.kq_html);
                        //$("#search-box").css("background", "#FFF");
                    } else {
                        //alert('Lỗi load dữ liệu');
                        $("#divBoxSearchData").hide();
                    }
                }
            });
        } else {
            $("#divBoxSearchData").hide();
        }
    });
    //up top
    $(window).scroll(function () {
        if ($(this).scrollTop() > 1) {
            $('header').css("position", "fixed")
        } else {
            $('header').css("position", "relative")
        }
    });

});