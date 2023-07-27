//20230303 수정부분 start
let imageEditor;
let qrcode;
//20230303 수정부분 end

//정규식 체크
const chkIdExp = RegExp(/^[A-Za-z0-9_\-]{6,12}$/);
const chkpwExp = RegExp(/^[A-Za-z0-9_\-]{8,20}$/);
const chkEmailExp = RegExp(/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i);
const chkPhoneExp = RegExp(/^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/);

//20230303 수정부분 start
const chkCorporateExp = RegExp(/^[0-9]{3}-?[0-9]{2}-?[0-9]{5}$/);
//20230303 수정부분 end

const chkNumberExp = RegExp(/^[0-9-]*$/);

$(function() {
    var userAgent = navigator.userAgent.toLowerCase();
    
    //ios(아이폰, 아이패드, 아이팟) 전용 css 적용
    if ($(".wrap.commonWrap").length > 0) {
        //반응형일 경우
        if (userAgent.indexOf("iphone") > -1 || userAgent.indexOf("ipad") > -1 || userAgent.indexOf("ipod") > -1) {
            var cssIosLink = document.createElement("link");

            cssIosLink.href = "../css/member-ios.css";
            cssIosLink.async = false;
            cssIosLink.rel = "stylesheet";
            cssIosLink.type = "text/css";

            document.head.appendChild(cssIosLink);
        }
    } else if ($(".wrap.mobileWrap").length > 0) {
        //mobile일 경우
        if (userAgent.indexOf("iphone") > -1 || userAgent.indexOf("ipad") > -1 || userAgent.indexOf("ipod") > -1) {
            var cssIosLink = document.createElement("link");

            cssIosLink.href = "../css/member-mobile-ios.css";
            cssIosLink.async = false;
            cssIosLink.rel = "stylesheet";
            cssIosLink.type = "text/css";

            document.head.appendChild(cssIosLink);
        }
    }
    
    //리사이즈
    $(window).resize(function() {
        //20230303 수정부분 start
        //모바일에서 100vh 오류 해결방법
        var vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        //20230303 수정부분 end
        
        //게시판 목록 테이블 중 tr-empty 클래스를 가진 tr이 있을 경우 td에 colspan 설정
        $(".wrap .list-table-area .list-table tr.tr-empty").each(function() {
            //thead 안에 tr이 여러개일 경우도 있으므로 colgroup으로 값을 가져옴
            var listColgroupObj = $(this).closest(".list-table").children("colgroup");

            if ($(listColgroupObj).length > 0) {
                $(this).children("td").attr("colspan", $(listColgroupObj).children("col:visible").length);
            }
        });
    });
    
    //스크롤시
    $(window).scroll(function() {
        //pc일 경우
        if ($(".wrap.mobileWrap").length == 0) {
            //헤더 가로 스크롤되도록 설정
            $("header.header").css("left", 0 - $(this).scrollLeft());

            //메뉴바 가로 스크롤되도록 설정
            $("aside.aside").css("left", 0 - $(this).scrollLeft());
        }
    });
    
    //20230303 수정부분 start
    //모바일에서 100vh 오류 해결방법
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    //20230303 수정부분 end
    
    //20230320 수정부분 start
    //QR코드를 통해 접속한 페이지일 경우 리프레시 보이기&숨기기
    if ($(".refresh-in").length > 0) {
        $("header.header").hide();
        $(".refresh-out").hide();
        $(".refresh-in").show();
        $(".refresh-in").closest(".c-wrap").css("background-color", "#ffffff");
        
        $(".refresh-in").fadeOut(2000, function() {
            $("header.header").show();
            $(".refresh-out").fadeIn(2000, function() {
                $(".refresh-in").closest(".c-wrap").css("background-color", "");
            });
        });
    }
    
    //메인페이지, QR코드를 통해 접속한 페이지일 경우 공지사항 팝업 보이기
    if ($(".main-introduce-list").length > 0 || $(".refresh-in").length > 0) {
        if (getCookie("cookieTodayClose") != "Y") {
            openLayer("notice","<div class='big'>※ 제주 주차 안심번호 시스템 고도화로 인한, 시스템 일시중단 안내 ※</div><div class='small order'>1. 작업일시 : 2023년 4월 13일 (목)</div><div class='small order'>2. 작업시간 : 00:00 ~ 23:59</div><div class='small order'>3. 작업내용 : 시스템 고도화 작업으로 인한 시스템 일시중단</div><div class='small'>서비스 이용에 불편을 드려 대단히 죄송합니다.<br>더 나은 서비스로 찾아뵙겠습니다.<br>감사합니다.</div>","");
        }
    }
    //20230320 수정부분 end
    
    //숫자만 입력
    $("input[type='tel']").on("keyup", function(e) {
         $(this).val($(this).val().replace(/[^0-9-]/g,""));
    });
    
    //파일 업로드시 파일명 추출 및 파일삭제 버튼 추가
    $(".c-file-input input[type='file']").on("change", function(e) {
        var fileObj = $(this).closest(".c-file-input");
        var fileName = "";
        var fileHtml = "";
        
        $(fileObj).find("label").css("display","inline-block");
        $(fileObj).find(".c-file-btn").remove();
        
        if ($(this).val() != "") {
            if (window.FileReader) {
                //기본 브라우저
                fileName = $(this)[0].files[0].name;
            } else {
                //old IE
                fileName = $(this).val().split('/').pop().split('\\').pop();
            }
            
            fileHtml += "<button type='button' class='c-file-btn' onclick='delFile(this);'>";
            fileHtml += "    <span>파일삭제</span>";
            fileHtml += "</button>";
            
            $(fileObj).find("label").css("display","none");
            $(fileObj).append(fileHtml);
        }
        
        $(fileObj).find(".c-file-txt").val(fileName);
    });
    
    //pc일 경우
    if ($(".wrap.mobileWrap").length == 0) {
        //메뉴바 각 메뉴에 텍스트 출력하기
        $("aside.aside .a-menu-list>li .a-sub-menu-list").each(function() {
            var menuTit = $(this).children("li.active").text();
            
            if (menuTit != undefined && menuTit != "") {
                $(this).next(".a-menu-tit").text(menuTit);
            }
        });
        
        //메뉴바 대메뉴의 하위메뉴 보이기&숨기기
        $("aside.aside .a-menu-list>li .a-menu-tit").on("click", function(e) {
            e.preventDefault();
            
            var listObj = $(this).prev(".a-sub-menu-list");
            
            if ($(listObj).hasClass("on")) {
                $(listObj).removeClass("on");
                $(listObj).stop(true,true).slideUp(200);
            } else {
                $(listObj).addClass("on");
                $(listObj).stop(true,true).slideDown(200);
            }
        });
    }
    
    //목록에 링크가 있을 경우 해당 링크로 페이지 이동하기
    $(".list-table-area .list-table tr[data-link]").on("click", function(e) {
        var tagName = e.target.tagName.toLowerCase();
        var dataLink = $(this).attr("data-link");
        
        if (tagName == "th" || tagName == "td") {
            e.preventDefault();
            
            location.href = dataLink;
        }
    });
    
    //탭이 있을 경우 첫번째 탭 클릭하기
    $(".c-tab-area").each(function() {
        var tabObj = $(this).find(".c-tab-list").children("li").eq(0);
        
        if ($(tabObj).length > 0) {
            setTabItem($(tabObj));
        }
    });
    
    //탭 클릭시 해당 탭 내용 보이기
    $(".c-tab-area .c-tab-list>li").on("click", function(e) {
        setTabItem($(this));
    });
    
    //FAQ 질문 클릭시 답변 보이기&숨기기
    $(".list-faq-list>li .list-faq-question").on("click", function(e) {
        e.preventDefault();
        
        var liObj = $(this).closest("li");
        
        if ($(liObj).hasClass("on")) {
            $(liObj).removeClass("on");
            $(liObj).find(".list-faq-answer").stop(true,true).slideUp(200);
        } else {
            $(liObj).addClass("on");
            $(liObj).find(".list-faq-answer").stop(true,true).slideDown(200);
        }
    });
    
    //게시판 목록 테이블 중 tr-empty 클래스를 가진 tr이 있을 경우 td에 colspan 설정
    $(".wrap .list-table-area .list-table tr.tr-empty").each(function() {
    	//thead 안에 tr이 여러개일 경우도 있으므로 colgroup으로 값을 가져옴
    	var listColgroupObj = $(this).closest(".list-table").children("colgroup");
    	
    	if ($(listColgroupObj).length > 0) {
    		$(this).children("td").attr("colspan", $(listColgroupObj).children("col:visible").length);
    	}
    });
    
    //20230303 수정부분 start
    //이미지 편집기 실행
    if ($("#tui-image-editor").length > 0) {
        //20230315 수정부분 start
        imageEditor = new tui.ImageEditor('#tui-image-editor', {
            includeUI: {
                loadImage: {
                    path: '../img/template-vertical-img.png',
                    name: 'TemplateImage'
                },
                theme: whiteTheme, // or blackTheme
                menu: [/*'crop', 'flip', 'rotate', */'draw', 'shape', 'icon', 'text', 'mask'/*, 'filter'*/],
                //initMenu: 'filter',
                /*uiSize: {
                    width: '1000px',
                    height: '700px'
                },*/
                menuBarPosition: 'bottom'
            },
            cssMaxWidth: 324, //8.56cm
            cssMaxHeight: 324, //8.56cm
            selectionStyle: {
                cornerStyle: 'circle',
                cornerSize: 10,
                cornerColor: '#000000',
                borderColor: '#000000',
                rotatingPointOffset: 50
            },
            usageStatistics: false
        });
        //20230315 수정부분 end
        
        setTimeout(() => {
            //QR코드 템플릿 목록 설정
            setQrcodeSetting();
            
            //QR코드 생성
            setQrcodeInit();
        }, 100);

        window.onresize = function() {
            imageEditor.ui.resizeEditor();
        }
    }
    //20230303 수정부분 end
    
    //로딩시 입력폼 유효성 체크하기
    $(".valid-form-area .valid-form-tit label").each(function() {
        var formTitObj = $(this).closest(".valid-form-tit");
        
        if ($(formTitObj).length > 0) {
            chkFormValid(formTitObj);
        }
    });
    
    //입력시 입력폼 유효성 체크하기
    $(".valid-form-area .valid-form-con input,.valid-form-area .valid-form-con select,.valid-form-area .valid-form-con textarea").on("propertychange change keyup paste input", function() {
        var formTitObj = $(this).closest(".valid-form-con").prev(".valid-form-tit");
        
        if ($(formTitObj).length > 0) {
            chkFormValid(formTitObj);
        }
    });
    
    //로딩시 회원정보에서 비밀번호 변경 항목 숨기기
    if ($(".password-change-area").length > 0) {
        var formObj = $(".password-change-area").closest(".valid-form-area");
        
        setPasswordChange($(formObj).find("#password-change"));
    }
    
    //로딩시 회원탈퇴에서 탈퇴사유 입력 항목 숨기기
    if ($(".leave-reason-area").length > 0) {
        var formObj = $(".leave-reason-area").closest(".valid-form-area");
        
        setLeaveReason($(formObj).find("#leave-reason"));
    }
    
    //20230414 수정부분 start
    //로딩시 안심번호 비활성화
    if ($(".safenumber-input-area").length > 0) {
        var formObj = $(".safenumber-input-area").closest(".valid-form-area");
        
        setSafenumberInput($(formObj).find("#safenumber-input"));
    }
    //20230414 수정부분 end
    
    //datepicker 설정
    $(".date-input").each(function() {
        $(this).datepicker();
        
        //20230223 수정부분 start
        if ($(".wrap.mobileWrap").length > 0 && $(".ui-widget-mask").length == 0) {
            $("body").append("<div class='ui-widget-mask'></div>");
        }
        //20230223 수정부분 end
    });
    
    //datepicker 설정
    $(".start-date-input").each(function() {
        $(this).datepicker({
            onSelect: function(selectedDate) {
                $(this).siblings(".end-date-input").datepicker("option","minDate",selectedDate);
            }
        });
        
        //20230223 수정부분 start
        if ($(".wrap.mobileWrap").length > 0 && $(".ui-widget-mask").length == 0) {
            $("body").append("<div class='ui-widget-mask'></div>");
        }
        //20230223 수정부분 end
    });
    
    //datepicker 설정
    $(".end-date-input").each(function() {
        $(this).datepicker({
            onSelect: function(selectedDate) {
                $(this).siblings(".start-date-input").datepicker("option","maxDate",selectedDate);
            }
        });
        
        //20230223 수정부분 start
        if ($(".wrap.mobileWrap").length > 0 && $(".ui-widget-mask").length == 0) {
            $("body").append("<div class='ui-widget-mask'></div>");
        }
        //20230223 수정부분 end
    });
    
    //20230329 수정부분 start
    //종료일자 최소날짜 설정
    $(".start-date-input").each(function() {
        if ($(this).val() != "") {
            $(this).siblings(".end-date-input").datepicker("option","minDate",$(this).val());
        }
    });
    
    //시작일자 최대날짜 설정
    $(".end-date-input").each(function() {
        if ($(this).val() != "") {
            $(this).siblings(".start-date-input").datepicker("option","maxDate",$(this).val());
        }
    });
    //20230329 수정부분 end
    
    //20230221 수정부분 start
    //datetimepicker 설정
    $(".datetime-input").each(function() {
        $(this).datetimepicker({
            controlType: "select",
            showButtonPanel: false
        });
    });
    
    //datetimepicker 설정
    $(".start-datetime-input").each(function() {
        $(this).datetimepicker({
            controlType: "select",
            showButtonPanel: false,
            onSelect: function(selectedDate) {
                $(this).siblings(".end-datetime-input").datetimepicker("option","minDate",selectedDate);
            }
        });
    });
    
    //datetimepicker 설정
    $(".end-datetime-input").each(function() {
        $(this).datetimepicker({
            controlType: "select",
            showButtonPanel: false,
            onSelect: function(selectedDate) {
                $(this).siblings(".start-datetime-input").datetimepicker("option","maxDate",selectedDate);
            }
        });
    });
    //20230221 수정부분 end
    
    //20230329 수정부분 start
    //종료시간 최소날짜 설정
    $(".start-datetime-input").each(function() {
        if ($(this).val() != "") {
            $(this).siblings(".end-datetime-input").datetimepicker("option","minDate",$(this).val().substring(0,10));
        }
    });
    
    //시작시간 최대날짜 설정
    $(".end-datetime-input").each(function() {
        if ($(this).val() != "") {
            $(this).siblings(".start-datetime-input").datetimepicker("option","maxDate",$(this).val().substring(0,10));
        }
    });
    //20230329 수정부분 end
    
    //monthpicker 설정
    $(".month-input").each(function() {
        $(this).monthpicker({
            closeText: "닫기", //닫기 버튼 패널
            prevText: "이전달", //prev 아이콘의 툴팁
            nextText: "다음달", //next 아이콘의 툴팁
            currentText: "오늘", //오늘 날짜로 이동하는 버튼 패널
            monthNames: [ "1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월" ], //달력의 월 부분 Tooltip 텍스트
            monthNamesShort: [ "1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월" ], //달력의 월 부분 텍스트
            dateFormat: "yy-mm", //텍스트 필드에 입력되는 날짜 형식
            isRTL: false,
            yearSuffix: "년"
        });
    });
    
    //monthpicker 설정
    $(".start-month-input").each(function() {
        $(this).monthpicker({
            closeText: "닫기", //닫기 버튼 패널
            prevText: "이전달", //prev 아이콘의 툴팁
            nextText: "다음달", //next 아이콘의 툴팁
            currentText: "오늘", //오늘 날짜로 이동하는 버튼 패널
            monthNames: [ "1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월" ], //달력의 월 부분 Tooltip 텍스트
            monthNamesShort: [ "1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월" ], //달력의 월 부분 텍스트
            dateFormat: "yy-mm", //텍스트 필드에 입력되는 날짜 형식
            isRTL: false,
            yearSuffix: "년",
            onSelect: function(selectedDate) {
                $(this).siblings(".end-month-input").monthpicker("option","minDate",selectedDate);
            }
        });
    });
    
    //monthpicker 설정
    $(".end-month-input").each(function() {
        $(this).monthpicker({
            closeText: "닫기", //닫기 버튼 패널
            prevText: "이전달", //prev 아이콘의 툴팁
            nextText: "다음달", //next 아이콘의 툴팁
            currentText: "오늘", //오늘 날짜로 이동하는 버튼 패널
            monthNames: [ "1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월" ], //달력의 월 부분 Tooltip 텍스트
            monthNamesShort: [ "1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월" ], //달력의 월 부분 텍스트
            dateFormat: "yy-mm", //텍스트 필드에 입력되는 날짜 형식
            isRTL: false,
            yearSuffix: "년",
            onSelect: function(selectedDate) {
                $(this).siblings(".start-month-input").monthpicker("option","maxDate",selectedDate);
            }
        });
    });
    
    //20230329 수정부분 start
    //종료월 최소월 설정
    $(".start-month-input").each(function() {
        if ($(this).val() != "") {
            $(this).siblings(".end-month-input").monthpicker("option","minDate",$(this).val());
        }
    });
    
    //시작월 최대월 설정
    $(".end-month-input").each(function() {
        if ($(this).val() != "") {
            $(this).siblings(".start-month-input").monthpicker("option","maxDate",$(this).val());
        }
    });
    //20230329 수정부분 end
    
    //yearpicker 설정
    $(".year-input").each(function() {
        $(this).yearpicker();
    });
    
    //20230303 수정부분 start
    //맵에서 자동차마커 이동가능하게 설정 (예시용), 개발시에는 제거해주세요
    $(".c-page .map-area .map-marker-img").each(function() {
        $(this).draggable({
            containment: ".map-area"
        });
    });
    //20230303 수정부분 end
});

//20230320 수정부분 start
//쿠키값 설정하기
function setCookie(cookieName, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
    document.cookie = cookieName + "=" + cookieValue;
}

//쿠키값 삭제하기
function deleteCookie(cookieName) {
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}

//쿠키값 가져오기
function getCookie(cookie_name) {
    var x, y;
    var val = document.cookie.split(';');
    
    for (var i = 0; i < val.length; i++) {
        x = val[i].substr(0, val[i].indexOf('='));
        y = val[i].substr(val[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기
        
        if (x == cookie_name) {
          return unescape(y); // unescape로 디코딩 후 값 리턴
        }
    }
}
//20230320 수정부분 end

//선택한 파일 삭제
function delFile(obj) {
    var fileObj = $(obj).closest(".c-file-input");
    var fileId = $(fileObj).find("input[type='file']").attr("id");
    var fileName = $(fileObj).find("input[type='file']").attr("name");
    var fileHtml = "";
    
    $(obj).remove();
    $(fileObj).find("label").remove();
    $(fileObj).find(".c-file-txt").val("");
    
    fileHtml += "<label>";
    fileHtml += "    <input type='file' id='" + fileId + "' name='" + fileName + "'>파일선택";
    fileHtml += "</label>";
    
    $(fileObj).append(fileHtml);
    
    //파일 업로드시 파일명 추출 및 파일삭제 버튼 추가
    $(".c-file-input input[type='file']").on("change", function(e) {
        var fileObj = $(this).closest(".c-file-input");
        var fileName = "";
        var fileHtml = "";
        
        $(fileObj).find("label").css("display","inline-block");
        $(fileObj).find(".c-file-btn").remove();
        
        if ($(this).val() != "") {
            if (window.FileReader) {
                //기본 브라우저
                fileName = $(this)[0].files[0].name;
            } else {
                //old IE
                fileName = $(this).val().split('/').pop().split('\\').pop();
            }
            
            fileHtml += "<button type='button' class='c-file-btn' onclick='delFile(this);'>";
            fileHtml += "    <span>파일삭제</span>";
            fileHtml += "</button>";
            
            $(fileObj).find("label").css("display","none");
            $(fileObj).append(fileHtml);
        }
        
        $(fileObj).find(".c-file-txt").val(fileName);
    });
}

//탭 클릭시 해당 탭 내용 보이기
function setTabItem(obj) {
    var dateTabType = $(obj).attr("data-tab-type");
    var dateTabName = $(obj).attr("data-tab-name");
    
    $(obj).parent(".c-tab-list").children("li").removeClass("on");
    $(obj).addClass("on");
    $(".c-tab-item[data-tab-type='" + dateTabType + "']").removeClass("on");
    $(".c-tab-item[data-tab-type='" + dateTabType + "'][data-tab-name='" + dateTabName + "']").addClass("on");
}

//20230303 수정부분 start
//20230502 수정부분 start
//QR코드 생성
function setQrcodeInit(type) {
    var qrcodeUrl = "https://davidshimjs.github.io/qrcodejs/";
    
    if ($(".tui-image-editor .qrcode-area").length == 0) {
        $(".tui-image-editor").append("<div class='qrcode-area'></div>");
        $(".tui-image-editor .qrcode-area").append("<div id='qrcode'></div>");
    }
    
    if (qrcode != undefined) {
        qrcode.clear();
    }
    
    $(".tui-image-editor .qrcode-area #qrcode").empty();
    
    //20230329 수정부분 start
    var rectWidth = 0;
    var rectHeight = 0;
    var rectLeft = 0;
    var rectTop = 0;
    var textLeft = 0;
    var textTop = 0;
    
    if ($(".tui-image-editor-container .tui-image-editor-main .tui-image-editor-menu-mask .c-tab-area .c-tab-list>li.on").attr("data-tab-name") == "horizontal" || type == "horizontal") {
        rectWidth = 304;
        rectHeight = 184;
        rectLeft = 162;
        rectTop = 102;
        textLeft = 130;
        textTop = 36;
    } else {
        rectWidth = 184;
        rectHeight = 304;
        rectLeft = 102;
        rectTop = 162;
        textLeft = 70;
        textTop = 96;
    }
    
    //QR코드 외에 요소 생성 (순차적으로 적용해야 요소가 생성됨)
    imageEditor.addShape('rect', {
        fill: 'transparent',
        stroke: '#a2a2a2',
        strokeWidth: 3,
        width: rectWidth,
        height: rectHeight,
        rx: 6,
        ry: 6,
        left: rectLeft,
        top: rectTop,
        isRegular: true
    });

    setTimeout(() => {
        imageEditor.addText('110001', {
            styles: {
                fill: '#181818',
                fontSize: 16,
                fontWeight: 'bold',
                fontFamily: 'GmarketSans'
            },
            position: {
                x: textLeft,
                y: textTop
            },
            autofocus: false
        }).then(objectProps => {
            //안심번호전용 플래그 추가
            imageEditor.setObjectProperties(objectProps.id, {
                safenumberFlag: 'Y'
            });
        });

        setTimeout(() => {
            //QR코드 생성
            if (qrcodeUrl != undefined && qrcodeUrl != "") {
                //20230502 수정부분 start
                qrcode = new QRCode(document.getElementById("qrcode"), {
                    text: qrcodeUrl,
                    /*width: 84,
                    height: 84,*/
                    width: 204,
                    height: 204,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.L
                });
                //20230502 수정부분 end

                if (imageEditor != undefined) {
                    setTimeout(() => {
                        imageEditor.addQrcodeObject($("#qrcode>img").attr("src")).then(objectProps => {
                            //QR코드전용 플래그 추가
                            imageEditor.setObjectProperties(objectProps.id, {
                                qrcodeFlag: 'Y',
                                scaleX: 0.41,
                                scaleY: 0.41
                            });

                            /*setTimeout(() => {
                                imageEditor.setObjectPosition(objectProps.id, {
                                    x: 53,
                                    y: 81,
                                    originX: 'left',
                                    originY: 'top'
                                });
                            }, 100);*/
                        });
                    }, 100);
                }
            }
        }, 100);
    }, 100);
    //20230329 수정부분 end
}
//20230502 수정부분 end

//QR코드 템플릿 목록 설정 + QR코드 만드는 방법 버튼 추가
function setQrcodeSetting() {
    var templateHtml = "";
    
    //20230329 수정부분 start
    var templateHtml2 = "";
    //20230329 수정부분 end
    
    //20230315 수정부분 start
    if ($("#tui-image-editor").length > 0) {
        //탭 목록
        templateHtml += "<div class='c-tab-area'>";
        templateHtml += "    <ul class='c-tab-list'>";
        templateHtml += "        <li class='on' data-tab-type='template' data-tab-name='vertical'>세로템플릿</li>";
        templateHtml += "        <li data-tab-type='template' data-tab-name='horizontal'>가로템플릿</li>";
        templateHtml += "    </ul>";
        templateHtml += "</div>";
        
        //QR코드 세로템플릿 목록
        templateHtml += "<div class='qrcode-template c-tab-item on' data-tab-type='template' data-tab-name='vertical'>";
        templateHtml += "    <ul class='qrcode-template-list swiper-wrapper'>";
        
        //20230419 수정부분 start
        templateHtml += "        <li class='swiper-slide on' onclick='setQrcodeTemplate(this);'>";
        templateHtml += "            <img src='../img/template-vertical-img.png' alt='템플릿 세로 디자인1' class='qrcode-template-img'>";
        templateHtml += "            <div class='qrcode-template-txt'>템플릿 세로 디자인1</div>";
        templateHtml += "        </li>";
        templateHtml += "        <li class='swiper-slide' onclick='setQrcodeTemplate(this);'>";
        templateHtml += "            <img src='../img/template-vertical-img2.png' alt='템플릿 세로 디자인2' class='qrcode-template-img'>";
        templateHtml += "            <div class='qrcode-template-txt'>템플릿 세로 디자인2</div>";
        templateHtml += "        </li>";
        templateHtml += "        <li class='swiper-slide' onclick='setQrcodeTemplate(this);'>";
        templateHtml += "            <img src='../img/template-vertical-img3.png' alt='템플릿 세로 디자인3' class='qrcode-template-img'>";
        templateHtml += "            <div class='qrcode-template-txt'>템플릿 세로 디자인3</div>";
        templateHtml += "        </li>";
        templateHtml += "        <li class='swiper-slide' onclick='setQrcodeTemplate(this);'>";
        templateHtml += "            <img src='../img/template-vertical-img4.png' alt='템플릿 세로 디자인4' class='qrcode-template-img'>";
        templateHtml += "            <div class='qrcode-template-txt'>템플릿 세로 디자인4</div>";
        templateHtml += "        </li>";
        templateHtml += "        <li class='swiper-slide' onclick='setQrcodeTemplate(this);'>";
        templateHtml += "            <img src='../img/template-vertical-img5.png' alt='템플릿 세로 디자인5' class='qrcode-template-img'>";
        templateHtml += "            <div class='qrcode-template-txt'>템플릿 세로 디자인5</div>";
        templateHtml += "        </li>";
        templateHtml += "        <li class='swiper-slide' onclick='setQrcodeTemplate(this);'>";
        templateHtml += "            <img src='../img/template-vertical-img6.png' alt='템플릿 세로 디자인6' class='qrcode-template-img'>";
        templateHtml += "            <div class='qrcode-template-txt'>템플릿 세로 디자인6</div>";
        templateHtml += "        </li>";
        templateHtml += "        <li class='swiper-slide' onclick='setQrcodeTemplate(this);'>";
        templateHtml += "            <img src='../img/template-vertical-img7.png' alt='템플릿 세로 디자인7' class='qrcode-template-img'>";
        templateHtml += "            <div class='qrcode-template-txt'>템플릿 세로 디자인7</div>";
        templateHtml += "        </li>";
        templateHtml += "        <li class='swiper-slide' onclick='setQrcodeTemplate(this);'>";
        templateHtml += "            <img src='../img/template-vertical-img8.png' alt='템플릿 세로 디자인8' class='qrcode-template-img'>";
        templateHtml += "            <div class='qrcode-template-txt'>템플릿 세로 디자인8</div>";
        templateHtml += "        </li>";
        templateHtml += "        <li class='swiper-slide'>";
        templateHtml += "            <input type='file' id='' name='' accept='image/*' class='qrcode-template-input' data-width='204' data-height='324'>";
        templateHtml += "            <img src='../img/template-upload-img.png' alt='템플릿 배경 사진 업로드' class='qrcode-template-img'>";
        templateHtml += "            <div class='qrcode-template-txt'>템플릿 배경 사진 업로드</div>";
        templateHtml += "        </li>";
        //20230419 수정부분 end
        
        templateHtml += "    </ul>";
        templateHtml += "</div>";
        
        //QR코드 가로템플릿 목록
        templateHtml += "<div class='qrcode-template c-tab-item' data-tab-type='template' data-tab-name='horizontal'>";
        templateHtml += "    <ul class='qrcode-template-list swiper-wrapper'>";
        
        //20230419 수정부분 start
        templateHtml += "        <li class='swiper-slide' onclick='setQrcodeTemplate(this);'>";
        templateHtml += "            <img src='../img/template-horizontal-img.png' alt='템플릿 가로 디자인1' class='qrcode-template-img'>";
        templateHtml += "            <div class='qrcode-template-txt'>템플릿 가로 디자인1</div>";
        templateHtml += "        </li>";
        templateHtml += "        <li class='swiper-slide' onclick='setQrcodeTemplate(this);'>";
        templateHtml += "            <img src='../img/template-horizontal-img2.png' alt='템플릿 가로 디자인2' class='qrcode-template-img'>";
        templateHtml += "            <div class='qrcode-template-txt'>템플릿 가로 디자인2</div>";
        templateHtml += "        </li>";
        templateHtml += "        <li class='swiper-slide' onclick='setQrcodeTemplate(this);'>";
        templateHtml += "            <img src='../img/template-horizontal-img3.png' alt='템플릿 가로 디자인3' class='qrcode-template-img'>";
        templateHtml += "            <div class='qrcode-template-txt'>템플릿 가로 디자인3</div>";
        templateHtml += "        </li>";
        templateHtml += "        <li class='swiper-slide' onclick='setQrcodeTemplate(this);'>";
        templateHtml += "            <img src='../img/template-horizontal-img4.png' alt='템플릿 가로 디자인4' class='qrcode-template-img'>";
        templateHtml += "            <div class='qrcode-template-txt'>템플릿 가로 디자인4</div>";
        templateHtml += "        </li>";
        templateHtml += "        <li class='swiper-slide' onclick='setQrcodeTemplate(this);'>";
        templateHtml += "            <img src='../img/template-horizontal-img5.png' alt='템플릿 가로 디자인5' class='qrcode-template-img'>";
        templateHtml += "            <div class='qrcode-template-txt'>템플릿 가로 디자인5</div>";
        templateHtml += "        </li>";
        templateHtml += "        <li class='swiper-slide' onclick='setQrcodeTemplate(this);'>";
        templateHtml += "            <img src='../img/template-horizontal-img6.png' alt='템플릿 가로 디자인6' class='qrcode-template-img'>";
        templateHtml += "            <div class='qrcode-template-txt'>템플릿 가로 디자인6</div>";
        templateHtml += "        </li>";
        templateHtml += "        <li class='swiper-slide' onclick='setQrcodeTemplate(this);'>";
        templateHtml += "            <img src='../img/template-horizontal-img7.png' alt='템플릿 가로 디자인7' class='qrcode-template-img'>";
        templateHtml += "            <div class='qrcode-template-txt'>템플릿 가로 디자인7</div>";
        templateHtml += "        </li>";
        templateHtml += "        <li class='swiper-slide' onclick='setQrcodeTemplate(this);'>";
        templateHtml += "            <img src='../img/template-horizontal-img8.png' alt='템플릿 가로 디자인8' class='qrcode-template-img'>";
        templateHtml += "            <div class='qrcode-template-txt'>템플릿 가로 디자인8</div>";
        templateHtml += "        </li>";
        templateHtml += "        <li class='swiper-slide'>";
        templateHtml += "            <input type='file' id='' name='' accept='image/*' class='qrcode-template-input' data-width='324' data-height='204'>";
        templateHtml += "            <img src='../img/template-upload-img.png' alt='템플릿 배경 사진 업로드' class='qrcode-template-img'>";
        templateHtml += "            <div class='qrcode-template-txt'>템플릿 배경 사진 업로드</div>";
        templateHtml += "        </li>";
        //20230419 수정부분 end
        
        templateHtml += "    </ul>";
        templateHtml += "</div>";
        
        //20230329 수정부분 start
        //QR코드 만드는 방법
        templateHtml2 += "<button type='button' class='help-btn' onclick='openQrcodeHelpLayer(this);'>";
        templateHtml2 += "   <span>설명보기</span>";
        templateHtml2 += "</button>";
        //20230329 수정부분 end
        
        $("#tui-image-editor .tui-image-editor-main .tui-image-editor-submenu .tui-image-editor-menu-mask").html(templateHtml);
        
        //20230329 수정부분 start
        if ($("#tui-image-editor .tui-image-editor-main-container .help-btn").length == 0) {
            $("#tui-image-editor .tui-image-editor-main-container").append(templateHtml2);
        }
        //20230329 수정부분 end
    }
    
    //swiper 슬라이드 (QR코드 템플릿 목록)
    $("#tui-image-editor.bottom .tui-image-editor-menu-mask .qrcode-template").each(function() {
        //20230502 수정부분 start
        new Swiper(this, {
            observer: true,
            observeParents: true,
            slidesPerView: 'auto',
            mousewheelControl: true,
            watchOverflow: true
        });
        //20230502 수정부분 end
    });
    
    //20230329 수정부분 start
    //swiper 슬라이드 (QR코드 만드는 방법)
    $("#qrcode-help-layer .qrcode-help-area").each(function() {
        //20230502 수정부분 start
        new Swiper(this, {
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            navigation: {
                prevEl: '.qrcode-help-prev-arrow',
                nextEl: '.qrcode-help-next-arrow',
                clickable: true,
            },
            watchOverflow: true
        });
        //20230502 수정부분 end
    });
    //20230329 수정부분 end
    
    //탭 클릭시 해당 탭 내용 보이기
    $(".c-tab-area .c-tab-list>li").on("click", function(e) {
        setTabItem($(this));
    });
    //20230315 수정부분 end
    
    //20230419 수정부분 start
    //템플릿 배경 사진 업로드
    const templateInput = document.querySelectorAll(".qrcode-template-input");
    
    const resizeImage = (settings) => {
        const file = settings.file;
        const maxWidth = settings.maxWidth;
        const maxHeight = settings.maxHeight;
        const maxRatio = maxWidth / maxHeight;
        const reader = new FileReader();
        const image = new Image();
        const canvas = document.createElement("canvas");
        
        const dataURItoBlob = (dataURI) => {
            const bytes = dataURI.split(",")[0].indexOf("base64") >= 0 ? atob(dataURI.split(",")[1]) : unescape(dataURI.split(",")[1]);
            const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
            const max = bytes.length;
            const ia = new Uint8Array(max);
            
            for (let i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
            
            return new Blob([ia], { type: mime });
        };
        
        const resize = () => {
            let width = image.width;
            let height = image.height;
            let ratio = width / height;
            let gap = 0;
            
            if (ratio == maxRatio) {
                width = maxWidth;
                height = maxHeight;
            } else if (ratio > maxRatio) {
                width *= maxHeight / height;
                height = maxHeight;
                gap = (width - maxWidth) / 2;
            } else if (ratio < maxRatio) {
                height *= maxWidth / width;
                width = maxWidth;
                gap = (height - maxHeight) / 2;
            }
            
            canvas.width = maxWidth;
            canvas.height = maxHeight;
            
            let ctx = canvas.getContext("2d");
            
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            if (ratio == maxRatio) {
                ctx.drawImage(image, 0, 0, width, height);
            } else if (ratio > maxRatio) {
                ctx.drawImage(image, (gap * -1), 0, width, height);
            } else if (ratio < maxRatio) {
                ctx.drawImage(image, 0, (gap * -1), width, height);
            }
            
            const dataUrl = canvas.toDataURL("image/png");
            
            return dataURItoBlob(dataUrl);
        };
        
        return new Promise((ok, no) => {
            if (!file) {
                return;
            }
            
            if (!file.type.match(/image.*/)) {
                no(new Error("Not an image"));
                return;
            }
            
            reader.onload = (readerEvent) => {
                image.onload = () => {
                    return ok(resize());
                };
                
                image.src = readerEvent.target.result;
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    const handleImgInput = (e) => {
        const config = {
            file: e.target.files[0],
            maxWidth: parseInt(e.target.dataset.width),
            maxHeight: parseInt(e.target.dataset.height),
        };
        
        resizeImage(config).then((resizedImage) => {
            const url = window.URL.createObjectURL(resizedImage);
            
            imageEditor.loadImageFromURL(url, 'TemplateImage').then(result => {
                //20230502 수정부분 start
                var type = "vertical";
                
                if (config.maxWidth > config.maxHeight) {
                    type = "horizontal";
                }
                
                setQrcodeInit(type);
                
                //동일한 이미지를 연달아 업로드시 이미지가 적용안되는 현상때문에 추가
                $(".qrcode-template-input").val("");
                //20230502 수정부분 end
            });
        }).catch((err) => {
            console.log(err);
        });
    }
    
    templateInput.forEach(function(input) {
        input.addEventListener("change", handleImgInput);
    });
    //20230419 수정부분 end
}

//QR코드 템플릿 설정
function setQrcodeTemplate(obj) {
    var imageSrc = $(obj).find(".qrcode-template-img").attr("src");
    
    if (imageEditor != undefined && imageSrc != undefined) {
        //20230315 수정부분 start
        //20230329 수정부분 start
        $(obj).closest(".tui-image-editor-menu-mask").find(".qrcode-template").find("li").removeClass("on");
        //20230329 수정부분 end
        //20230315 수정부분 end
        
        $(obj).addClass("on");
        
        imageEditor.loadImageFromURL(imageSrc, 'TemplateImage').then(result => {
            setQrcodeInit();
        });
    }
}
//20230303 수정부분 end

//입력폼 유효성 체크하기
function chkFormValid(obj) {
    var formObj = $(obj).closest(".valid-form-area");
    var formConObj = $(obj).next(".valid-form-con");
    var okFlag = true;
    
    $(formConObj).find("input,select,textarea").each(function() {
        var formTag = $(this).prop("tagName").toLowerCase();
        var formType = $(this).attr("type");
        var formId = $(this).attr("id");
        var formName = $(this).attr("name");
        var formVal = "";
        
        if ($(this).prop("disabled") !== true) {
            //입력값 가져오기
            if (formTag == "input") {
                switch (formType) {
                    case "text" : 
                    case "password" : 
                    case "email" : 
                    case "tel" : 
                    case "number" : 
                    case "file" : 
                    case "hidden" :
                        formVal = $(this).val();
                        break;
                    case "checkbox" : 
                    case "radio" : 
                        if (formName != undefined && formName != "") {
                            formVal = $(formObj).find("input[type='" + formType + "'][name='" + formName + "']:checked").val();
                        }
                        break;
                    default : 
                        formVal = "";
                        break;

                }
            } else if (formTag == "select") {
                formVal = $(this).children("option:selected").val();
            } else if (formTag == "textarea") {
                formVal = $(this).val();
            }
            
            //조건 체크하기
            if ($(this).attr("data-event-flag") == "Y") {
                //data-event-flag : 버튼을 눌러서 유효성을 체크할 경우, data-old-val : 기존의 값으로 data-event-flag가 Y일 경우 사용됨
                if ($(this).attr("data-old-val") != undefined && $(this).attr("data-old-val") != "") {
                    if (formVal != $(this).attr("data-old-val")) {
                        okFlag = false;
                    }
                } else {
                    okFlag = false;
                }
            } else if ($(this).attr("data-compare-id") != undefined && $(this).attr("data-compare-id") != "") {
                //data-compare-id : 해당 id를 가진 항목과 값이 같은지 여부를 비교할 경우
                var compareVal = $(formObj).find("#" + $(this).attr("data-compare-id")).val();
                
                if (compareVal != undefined && compareVal != "") {
                    if (formVal != compareVal) {
                        okFlag = false;
                    }
                } else {
                    okFlag = false;
                }
            } else if ($(this).prop("required") !== false) {
                //required : 필수값일 경우
                if (formVal == undefined || formVal == "") {
                    okFlag = false;
                }
            }
            
            //정규식 체크하기
            if ((formType == "password" && !chkpwExp.test(formVal)) || (formType == "email" && !chkEmailExp.test(formVal)) || (formType == "tel" && !chkNumberExp.test(formVal)) || (formType == "number" && !chkNumberExp.test(formVal))) {
                okFlag = false;
            }
            
            //해당 항목이 비교대상일 경우 체크하기
            if ($(formObj).find("*[data-compare-id='" + formId + "']").length > 0) {
                var compareObj = $(formObj).find("*[data-compare-id='" + formId + "']");
                var compareVal = $(compareObj).val();
                
                if (compareVal != undefined && compareVal != "" && formVal == compareVal && okFlag) {
                    $(compareObj).closest(".valid-form-con").prev(".valid-form-tit").addClass("ok");
                } else {
                    $(compareObj).closest(".valid-form-con").prev(".valid-form-tit").removeClass("ok");
                }
            }
        }
    });
    
    if (okFlag) {
        $(obj).addClass("ok");
    } else {
        $(obj).removeClass("ok");
    }
    
    return false;
}

//이메일 중복확인시
function chkEmailValid(obj) {
    var formTitObj = $(obj).closest(".valid-form-con").prev(".valid-form-tit");
    var formVal = $(obj).prev("input").val();
    
    if (formVal != undefined && formVal != "" && chkEmailExp.test(formVal)) {
        //유효할 경우
        $(formTitObj).addClass("ok");
    } else {
        //유효하지 않을 경우
        $(formTitObj).removeClass("ok");
    }
}

//연락처 인증요청시
function chkPhoneValid(obj) {
    var formConObj = $(obj).closest(".valid-form-con");
    var formTitObj = $(formConObj).prev(".valid-form-tit");
    var formVal = $(obj).prev("input").val();
    var formHtml = "";
    
    $(formTitObj).removeClass("ok");
    $(formConObj).find(".certify-valid-input").remove();
    
    if (formVal != undefined && formVal != "" && chkPhoneExp.test(formVal)) {
        //유효할 경우
        //certify-valid-input : 인증번호 입력폼
        formHtml += "<div class='c-inline-input certify-valid-input'>";
        formHtml += "    <input type='text' id='' name='' required placeholder='인증번호 입력' data-event-flag='Y'>";
        
        //20230223 수정부분 start
        if ($(".wrap.commonWrap").length > 0) {
            //반응형일 경우
            formHtml += "    <button type='button' class='default-btn07 round-btn only-pc' onclick='chkCertifyValid(this);'>";
            formHtml += "        <span>인증완료</span>";
            formHtml += "    </button>";
            formHtml += "    <button type='button' class='default-btn01 only-mobile' onclick='chkCertifyValid(this);'>";
            formHtml += "        <span>인증완료</span>";
            formHtml += "    </button>";
        } else if ($(".wrap.mobileWrap").length > 0) {
            //mobile일 경우
            formHtml += "    <button type='button' class='default-btn01' onclick='chkCertifyValid(this);'>";
            formHtml += "        <span>인증완료</span>";
            formHtml += "    </button>";
        } else {
            //pc일 경우
            formHtml += "    <button type='button' class='default-btn07 round-btn' onclick='chkCertifyValid(this);'>";
            formHtml += "        <span>인증완료</span>";
            formHtml += "    </button>";
        }
        //20230223 수정부분 end
        
        formHtml += "</div>";
        
        $(formConObj).append(formHtml);
    }
    
    //입력시 입력폼 유효성 체크하기
    $(".valid-form-area .valid-form-con input,.valid-form-area .valid-form-con select,.valid-form-area .valid-form-con textarea").on("propertychange change keyup paste input", function() {
        var formTitObj = $(this).closest(".valid-form-con").prev(".valid-form-tit");
        
        if ($(formTitObj).length > 0) {
            chkFormValid(formTitObj);
        }
    });
}

//연락처 인증번호 인증완료시
function chkCertifyValid(obj) {
    var formTitObj = $(obj).closest(".valid-form-con").prev(".valid-form-tit");
    var formVal = $(obj).prev("input").val();
    
    if (formVal != undefined && formVal != "") {
        //유효할 경우
        $(formTitObj).addClass("ok");
    } else {
        //유효하지 않을 경우
        $(formTitObj).removeClass("ok");
    }
}

//사업자등록번호 중복확인시
function chkCorporateValid(obj) {
    var formTitObj = $(obj).closest(".valid-form-con").prev(".valid-form-tit");
    var formVal = $(obj).prev("input").val();
    
    if (formVal != undefined && formVal != "" && chkCorporateExp.test(formVal)) {
        //유효할 경우
        $(formTitObj).addClass("ok");
    } else {
        //유효하지 않을 경우
        $(formTitObj).removeClass("ok");
    }
}

//차량번호 조회하기시
function chkCarnumberValid(obj) {
    var formTitObj = $(obj).closest(".valid-form-con").prev(".valid-form-tit");
    var formVal = $(obj).prev("input").val();
    
    if (formVal != undefined && formVal != "") {
        //유효할 경우
        $(formTitObj).addClass("ok");
    } else {
        //유효하지 않을 경우
        $(formTitObj).removeClass("ok");
    }
}

//입력폼 유효성 체크 결과 확인하기
function chkFormValidResult(obj,page) {
    var formObj = $(obj).closest(".valid-form-area");
    
    if ($(formObj).find(".valid-form-tit").not(".valid-form-tit.ok").length > 0) {
        openLayer("alert","유효하지 않은 항목이 있습니다.<br>다시 확인해주세요.","");
    } else {
        if (page != "") {
            location.href = page;
        } else {
            location.reload();
        }
    }
    
    return false;
}

//회원정보에서 비밀번호 변경 항목 보이기&숨기기
function setPasswordChange(obj) {
    var formObj = $(obj).closest(".valid-form-area");
    
    if ($(obj).is(":checked")) {
        $(formObj).find(".password-change-area").addClass("on");
        $(formObj).find(".password-change-area").find("input").prop("disabled",false);
    } else {
        $(formObj).find(".password-change-area").removeClass("on");
        $(formObj).find(".password-change-area").find("input").prop("disabled",true);
        $(formObj).find(".password-change-area").find("input").val("");
    }
    
    $(formObj).find(".password-change-area").find("input").each(function() {
        var formTitObj = $(this).closest(".valid-form-con").prev(".valid-form-tit");
        
        chkFormValid(formTitObj);
    });
}

//회원탈퇴에서 탈퇴사유 입력 항목 보이기&숨기기
function setLeaveReason(obj) {
    var formObj = $(obj).closest(".valid-form-area");
    
    if ($(obj).val() == "직접입력") {
        $(formObj).find(".leave-reason-area").css("display","block");
        $(formObj).find(".leave-reason-area").find("input").prop("disabled",false);
    } else {
        $(formObj).find(".leave-reason-area").css("display","none");
        $(formObj).find(".leave-reason-area").find("input").prop("disabled",true);
        $(formObj).find(".leave-reason-area").find("input").val("");
    }
    
    $(formObj).find(".leave-reason-area").find("input").each(function() {
        var formTitObj = $(this).closest(".valid-form-con").prev(".valid-form-tit");
        
        chkFormValid(formTitObj);
    });
}

//20230414 수정부분 start
//차량정보 등록시 안심번호 활성화&비활성화
function setSafenumberInput(obj) {
    var formObj = $(obj).closest(".valid-form-area");
    
    if ($(formObj).length > 0) {
        if ($(obj).is(":checked")) {
            $(formObj).find(".safenumber-input-area").find(".safenumber-first").next("input").prop("disabled",false);
        } else {
            $(formObj).find(".safenumber-input-area").find(".safenumber-first").next("input").prop("disabled",true);
            $(formObj).find(".safenumber-input-area").find(".safenumber-first").next("input").val("");
        }

        $(formObj).find(".safenumber-input-area").find(".safenumber-first").next("input").each(function() {
            var formTitObj = $(this).closest(".valid-form-con").prev(".valid-form-tit");

            chkFormValid(formTitObj);
        });
    }
}
//20230414 수정부분 end

//20230223 수정부분 start
//모바일 메뉴창 열기
function openMobileMenu(obj) {
    $(".m-wrap").addClass("on");
}

//모바일 메뉴창 닫기
function closeMobileMenu(obj) {
    $(".m-wrap").removeClass("on");
}

//안심번호 연결에서 전송사유 선택시 문자내용 예시 변경하기
function setSendReason(obj) {
    var formObj = $(obj).closest(".valid-form-area");
    var placeholder = "";
    
    if ($(obj).val() == "차량이동") {
        placeholder = "예) 차량이동으로 연락드립니다. 8282";
    } else if ($(obj).val() == "사고발생") {
        placeholder = "예) 접촉사고 때문에 010-1234-5678로 연락해주세요.";
    } else if ($(obj).val() == "긴급연락") {
        placeholder = "예) 010-1234-5678로 연락해주세요.";
    }
    
    $(formObj).find("#send-content").attr("placeholder", placeholder);
}
//20230223 수정부분 end

//20230502 수정부분 start
//이미지 인쇄하기
function openCanvasPrint(canvasUrl) {
    var printWindow = window.open('', '_blank', 'width=1080,height=764');
    
    printWindow.document.write('<html><head><title></title>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<img src="' + canvasUrl + '" style="max-width: 100%;">');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus(); 
    
    setTimeout(function() {
        printWindow.print();
        printWindow.close();
    }, 400);
}

//선택한 QR코드 템플릿 프린트하기
function printQrcodeTemplate(obj) {
    var qtAreaObj = $(obj).closest(".qrcode-template-area");
    
    if ($(qtAreaObj).length > 0) {
        var qtActiveObj = $(qtAreaObj).find(".swiper-for").find(".swiper-slide-active");
        
        if ($(qtActiveObj).length > 0) {
            var dataSafenumber = $(qtActiveObj).attr("data-safenumber");
            var dataBackground = $(qtActiveObj).attr("data-background");
            var dataPosition = $(qtActiveObj).attr("data-position");
            var dataPosition2 = $(qtActiveObj).attr("data-position2");
            
            if (dataSafenumber != undefined && dataBackground != undefined && dataPosition != undefined && dataPosition2 != undefined) {
                var qtCanvas = document.createElement("canvas");
                var qtImage = new Image();
                var qtQrcode;
                var qtQrcodeUrl = "https://davidshimjs.github.io/qrcodejs/?safenumber=" + dataSafenumber;

                qtImage.src = dataBackground;
                
                qtImage.onload = function() {
                    if (qtQrcode != undefined) {
                        qtQrcode.clear();
                    }

                    if ($("#qt-qrcode").length > 0) {
                        $("#qt-qrcode").empty();
                    } else {
                        $("body").append("<div id='qt-qrcode' style='display: none;'></div>");
                    }
                    
                    //QR코드 생성
                    qtQrcode = new QRCode(document.getElementById("qt-qrcode"), {
                        text: qtQrcodeUrl,
                        width: 84,
                        height: 84,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.L
                    });
                    
                    if (qtImage.width > qtImage.height) {
                        //가로템플릿일 경우
                        qtImage.width = 324;
                        qtImage.height = 204;
                    } else {
                        //세로템플릿일 경우
                        qtImage.width = 204;
                        qtImage.height = 324;
                    }

                    qtCanvas.width = qtImage.width;
                    qtCanvas.height = qtImage.height;

                    var qtCtx = qtCanvas.getContext("2d");

                    qtCtx.globalCompositeOperation = "source-over";
                    qtCtx.fillStyle = "white";
                    qtCtx.fillRect(0, 0, qtCanvas.width, qtCanvas.height);
                    qtCtx.drawImage(this, 0, 0, qtImage.width, qtImage.height);

                    var qtDataURL = qtCanvas.toDataURL("image/png");
                    var dataPositionArr = dataPosition.split(',');
                    
                    if (dataPositionArr.length > 1) {
                        setTimeout(() => {
                            //console.log(qtQrcode);
                            //console.log(qtQrcode._oDrawing._elImage.currentSrc);
                            //console.log(qtQrcode._oDrawing._elImage.width);
                            //console.log(qtQrcode._oDrawing._elImage.height);

                            qtImage.src = qtQrcode._oDrawing._elImage.currentSrc;

                            qtImage.onload = function() {
                                qtCtx.globalCompositeOperation = "darker";
                                qtCtx.drawImage(this, dataPositionArr[0], dataPositionArr[1], 84, 84);
                                qtDataURL = qtCanvas.toDataURL("image/png");
                                
                                var dataPositionArr2 = dataPosition2.split(',');
                                
                                if (dataPosition2.length > 1) {
                                    qtCtx.globalCompositeOperation = "darker";
                                    qtCtx.font = "bold 16px GmarketSans";
                                    qtCtx.fillStyle = "#181818";
                                    qtCtx.fillText(dataSafenumber, dataPositionArr2[0], dataPositionArr2[1]);
                                    qtDataURL = qtCanvas.toDataURL("image/png");

                                    //console.log(qtDataURL);
                                    openCanvasPrint(qtDataURL);
                                }
                            }
                        }, 100);
                    } 
                }
            }
        }
    }
}
//20230502 수정부분 end

//레이어창 열기
function openLayer(type, msg, fun) {
    $("#" + type + "-layer .l-box .l-con-area .l-con").html(msg);
    
    $("#" + type + "-layer .l-box .l-btn-area .confirm-btn").removeAttr("onclick");
    $("#" + type + "-layer .l-box .l-btn-area .confirm-btn").attr("onclick","closeLayer(this);" + fun);
    
    $("#" + type + "-layer").addClass("on");
    $("#" + type + "-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//QR코드 보기창 열기
function openQrcodeViewLayer(obj) {
    $("#qrcode-view-layer").addClass("on");
    $("#qrcode-view-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//20230223 수정부분 start
//위치정보 제공 약관동의창 열기
function openPositionAgreementLayer(obj) {
    $("#position-agreement-layer").addClass("on");
    $("#position-agreement-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//연락처 제공 약관동의창 열기
function openPhoneAgreementLayer(obj) {
    $("#phone-agreement-layer").addClass("on");
    $("#phone-agreement-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}
//20230223 수정부분 end

//20230309 수정부분 start
//SNS 회원가입창 열기
function openSnsJoinLayer(obj) {
    $("#sns-join-layer").addClass("on");
    $("#sns-join-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}
//20230309 수정부분 end

//20230329 수정부분 start
//QR코드 만드는 방법창 열기
function openQrcodeHelpLayer(obj) {
    $("#qrcode-help-layer").addClass("on");
    $("#qrcode-help-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}
//20230329 수정부분 end

//20230502 수정부분 start
//QR코드 템플릿 보기창 열기
function openQrcodeTemplateLayer(obj) {
    var swiperNav;
    var swiperFor;
    
    //swiper 슬라이드 (QR코드 템플릿 목록)
    if ($(".qrcode-template-area .swiper-nav").length > 0) {
        swiperNav = new Swiper(".qrcode-template-area .swiper-nav", {
            observer: true,
            observeParents: true,
            slidesPerView: 'auto',
            spaceBetween: 10,
            mousewheelControl: true,
            freeMode: true,
            watchSlidesProgress: true,
            watchOverflow: true
        });
    }
    
    //swiper 슬라이드 (선택한 QR코드 템플릿)
    if ($(".qrcode-template-area .swiper-for").length > 0) {
        swiperFor = new Swiper(".qrcode-template-area .swiper-for", {
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 10,
            watchOverflow: true,
            navigation: {
                prevEl: '.swiper-for-prev-arrow',
                nextEl: '.swiper-for-next-arrow',
                clickable: true,
            },
            thumbs: {
                swiper: swiperNav
            }
        });
    }
    
    $("#qrcode-template-layer").addClass("on");
    $("#qrcode-template-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}
//20230502 수정부분 end

//레이어창 닫기
function closeLayer(obj) {
    //20230320 수정부분 start
    //notice창의 오늘 하루동안 열지 않기 체크할 경우
    if ($(obj).closest(".l-area").attr("id") == "notice-layer") {
        if ($("#today-close").is(":checked")) {
            setCookie("cookieTodayClose", "Y", 1);
        }
    }
    //20230320 수정부분 end
    
    $(obj).closest(".l-area").removeClass("on");
    $(obj).closest(".l-area").stop(true,true).slideUp(300);
    
    if ($(".l-area.on").length == 0) {
        $("body").removeClass("scroll-disable").off('scroll touchmove');

        var scrollTop = Math.abs(parseInt($("body").css("top")));

        $("html,body").animate({scrollTop: scrollTop}, 0);
    }
}

