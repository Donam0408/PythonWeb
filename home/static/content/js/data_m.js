function AddStar(value) {
    var bookId = $('#bookId').val();
    $.post("/Book/AddStar", { bookId: bookId, star: value },
function (data) {
    if (data == "0") {
        alert('Cám ơn quý khách đã đánh giá.')
    }
    else {
        alert('Đánh giá thất bại.')
    }
});
}
function AddShareBook() {
    var bookId = $('#bookId').val();
    $.post("/Book/AddShareBook", { bookId: bookId },
    function (data) {
        if (data == "0") {
            //alert('Cám ơn quý khách đã chia sẻ.')
        }
        else {
            //alert('Chia sẻ thất bại.')
        }
    });
}
function addlikebook(value, isFa) {
    $.post("/Book/addlikebook", { bookId: value, isFa: isFa },
function (data) {
    if (data == "1") {
        alert('Cám ơn quý khách đã yêu thích.');
    } else if (data == "2") {
        alert('Cám ơn quý khách. Sách này quý khách đã yêu thích.');
    }
    else {
        alert('Hệ thống đang bận. Vui lòng thực hiện lại thao tác sau.');
    }
});
}
function makeslideshow(id, stype) {
    $.post("/Home/makeslideshow", { id: id, stype: stype },
function (data) {
    location.href = data.linkurl;
});
}

function ActiveMail() {
    var captcha = $("#txtCaptcha").val();
    var mail = $("#Email").val();
    $.post("/Acc/ActiveEmail",
        { Email: mail, CaptchaValue: captcha },
        function (data) {
            if (data == 1) {
                $('.captcha_img').attr('src', '/Captcha/Show');
                alert("Quý khách đang thực hiện thao tác kích hoạt email! Vui lòng kiểm tra email để xác thực.");
            }
            else {
                $('.captcha_img').attr('src', '/Captcha/Show');
            }
        });

    return false;
}

function send_ycbook() {
    //get the username
    var Fullname = $('#Fullnamef').val();
    var PhomeNumber = $('#PhomeNumberf').val();
    var Email = $('#Emailf').val();
    var Content = $('#Contentf').val();
    var CaptchaValue = $('#CaptchaValuef').val();
    if (Fullname == '') {
        $('.class_messager').html('<span class="is_not_available">Quý khách chưa nhập họ tên.</span>');
    } else if (PhomeNumber == '') {
        $('.class_messager').html('<span class="is_not_available">Quý khách chưa nhập số điện thoại.</span>');
    } else if (Content == '') {
        $('.class_messager').html('<span class="is_not_available">Quý khách chưa nhập nội dung.</span>');
    } else if (CaptchaValue == '') {
        $('.class_messager').html('<span class="is_not_available">Quý khách chưa mã chống spam.</span>');
    } else {
        //use ajax to run the check
        $.post("/Home/Requied_Box", { Fullname: Fullname, PhomeNumber: PhomeNumber, Email: Email, Content: Content, CaptchaValue: CaptchaValue },
           function (data) {
               //if the result is 1
               if (data.success == 0) {
                   $('.class_messager').html('<div class="mess_sucess">Quý khách đã gửi yêu cầu sách thành công!</div>');
                   $('#Fullnamef').val('');
                   $('#PhomeNumberf').val('');
                   $('#Emailf').val('');
                   $('#Contentf').val('');
                   $('#CaptchaValuef').val('');
                   //document.location.reload(true);
               } else if (data.success = -1) {
                   //show that the username is NOT available
                   $('.class_messager').html('<span class="is_not_available">' + data.des + '</span>');
               } else if (data.success = -4) {
                   //show that the username is NOT available
                   $('.class_messager').html('<span class="is_not_available">' + data.des + '</span>');
               }
               else if (data.success = -5) {
                   //show that the username is NOT available
                   $('.class_messager').html('<span class="is_not_available">' + data.des + '</span>');
               }
               else {
                   //show that the username is NOT available
                   $('.class_messager').html('<span class="is_not_available">Hệ thống đang quá tải. Vui lòng quay lại sau ít phút</span>');
               }
           });
    }

};

function openlogin_face() {
    location.href = "https://www.facebook.com/dialog/oauth?client_id=291511854325988&redirect_uri=http://sachtot.vn/acc/loginface&scope=email";
}

