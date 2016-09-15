$(function(){

  $(".eight").find("span").addClass("disable");



  $("form").submit(function(){
    var phone=$.trim($("input[name='phone']").val())
    if(!phone){
        simpleTip("请输入手机号")
        return false
    }
    if(!/^[0-9]{11}$/.test(phone)){
       simpleTip("仅限输入11位手机号");
       return false;
    }

    $(".dialog").length?$(".dialog").remove():"";
    request("/getAward",{phone:phone},"GET",function(data){
      if(data.resultCode=="0"){
          var list=data.data.data;
          $("body").append(getDialogHtml(list));
          $("#closeDialog").on("click",function(){
            $(".dialog").remove();
          })
          console.log(list)
      }else if(data.resultCode=="2"){
        $("body").append(getDialogHtml([],"1"));
        $("#closeDialog").on("click",function(){
          $(".dialog").remove();
        })
      }else{
        simpleTip(data.msg)
      }
    },function(error){
       
    })

    return false;
  })
  
  showShop();
  initData()

  function getDialogHtml(list,flag){
    var imgUrl=""
    var tip=""
    if(flag){
        imgUrl="bwq_dialog_phone.png"
        tip="亲，请绑定手机号再来查询！"
    }else{
      imgUrl=list.length?"bwq_dialog_smile.png":"bwq_dialog_sad.png";
      tip=!list.length?"亲，您没中奖哦，感谢您的参与，后面还有大奖等着您，请继续关注哦！":"恭喜您获得"+list.length+"张优惠券，就放在“卡包”里，请赶快去消费吧！"
    }
    var html='<div class="dialog">'+
          '<div class="head"><img src="images/bwq_tips_head.png" width="100%"></div>'+
          '<div class="medium">'+
            '<div class="face"><img src="images/'+imgUrl+'"></div>'+
            '<div class="tip">'+tip+'</div>'+
            '<div class="btn-wrap">'+
              '<span class="btn" id="closeDialog">关闭</span>'+
            '</div>'+
          '</div>'+
        '</div>'
        return html;
  }

  function showShop(){    
      // var hour=[12,14,15,17,18];
      var hour=[10,20,30,40,50];

      var date=new Date();
      var currentDate=date.getDate();//当月几号
      var currentHour=date.getHours();//当天时刻
      var currentSecond=date.getSeconds();//秒
      var index=hour.indexOf(currentSecond);
      console.log(currentSecond)

      if(+currentSecond>hour[4]){
              $($(".seven")[4]).find("span").addClass("disable")
      }
      if(index<0){
          return;
      }
      if(currentDate==3){
          var list=$(".seven").slice(0,index+1);
          var restList=$(".seven").slice(index+1);
          for(var i=0;i<list.length;i++){
              if(i==list.length-1){
                  $($(list[i]).find("span")[0]).removeClass("disable");
                  $(list[i]).find("span~span").each(function(pos,item){
                    $(item).removeClass("disable").text($(item).data("name"))
                  })                                 
              }else{
                  $($(list[i]).find("span")[0]).addClass("disable");
                  $(list[i]).find("span~span").each(function(pos,item){
                      $(item).addClass("disable").text($(item).data("name"))
                  })
              }
          }

          for(var i=0;i<restList.length;i++){
              $($(restList[i]).find("span")[0]).removeClass("disable");
              $(restList[i]).find("span~span").each(function(pos,item){
                $(item).removeClass("disable").text("神秘商家");
              })
          }
          //修改
          // $(".seven").slice(0,index+1).each(function(pos,item){
          //     if(pos==index){
          //       $(item).find("span~span").each(function(i,value){
          //           $(value).removeClass("disable").text($(value).data("name"));
          //       })
          //     }else{
          //       $(item).find("span~span").each(function(i,value){
          //         $(value).addClass("disable").text($(value).data("name"));
          //       })
          //     }
          // })
          // $(".seven").find("span").addClass("disable");
          // $($(".seven")[index]).find("span").removeClass("disable");
      }else if(currentDate==8){

          var sevenList=$(".seven");
          for(var i=0;i<sevenList.length;i++){
            $($(sevenList[i]).find("span")[0]).addClass("disable");
            $(sevenList[i]).find("span~span").each(function(pos,item){
                $(item).addClass("disable").text($(item).data("name"));
            })
          }
          

          $(".eight").find("span").addClass("disable");
          $($(".eight")[index]).find("span").removeClass("disable")
      }
  }


  setInterval(showShop,1000);

  function initData(){
    request("/getAward",{},"GET",function(data){
      if(data.resultCode=="0"){
          $("#awardList").empty();
          var list=data.data.data;
          $(list).each(function(index,value){
            $("#awardList").append(structHtml(value));
          });
      }else{
        simpleTip(data.msg)
      }
    },function(error){

    })
  }
function structHtml(obj){
  var html='<div class="user common">'+ 
        '<span class="bg5">'+omitName(obj.name)+'</span><span class="bg5">'+omit(obj.phone)+'</span><span class="bg5 ">'+obj.award+'</span>'+
  '</div>'
  return html;
}
  function simpleTip(text, time) {
    if (!$('#weile-tip').length) $('body').append('<div id="weile-tip" style="position:fixed;width:100%;text-align:center;bottom:120px;z-index:99999"></div>');
    var $t = $('#weile-tip');
    $t.html('<span style="padding:6px 12px;background:#222;color: #ccc;border-radius:2px;">' + text + '<span>');
    setTimeout(function() {
      $t.html('');
    }, +time || 1500);
  }


  function request(url,data,method,success,error){
    $.ajax({
       type: method || "POST",
       url: url,
       dataType:"json",
       data:data,
       success: success,
       error:error
    });
  }
  function omit(phone){
    return phone.substring(0,3)+"****"+phone.substring(7,phone.length)
  }
  function omitName(name){
    var str="",i=0;
   while(i<name.length){
      (i==name.length-1 || i==0)?(str+=name[i]):(str+="*");
      i++;
   } 
    return str
  }
})