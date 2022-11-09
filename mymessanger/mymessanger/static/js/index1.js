$(document).ready(function() {

	const mediaQuery = window.matchMedia('(orientation: portrait)')

	setInterval( function() {
		var date = new Date()
		var hours = date.getHours()
	    var minutes = date.getMinutes()
	    var seconds = date.getSeconds()
			if (hours < 10) hours = "0" + hours
			if (minutes < 10) minutes = "0" + minutes
		$(".time").text(hours + ":" + minutes)
		}, 1000)

	$(".edit-hw__button").click(
		function (){
			EditHomework()
		}
	)

	$(".cansel").click(
		function (){
			EditHomework()
		}
	)

	$(".agree").click(
		function () {
			var lessons      = [],
				tasks        = [],
				descriptions = []

			for (var i=1; i < 9; i++){
				lessons.push($($(".class")[i]).children().val())
				tasks.push($($(".task")[i]).children().val())
				descriptions.push($($(".description")[i]).children().val())
			}

			token    = $(".send-button").attr('token')
			link     = $(".agree").attr("link-to-send-hw") 
			homework = [lessons, tasks, descriptions]

			console.log($(".class"))
			console.log("asfafaf")

			$.ajax({
            url: link,
            type: "POST",
            dataType: "json",
            data: {
                day_number: Number($(".homework").attr("day-number")) + DAY_NUMBER_CHANGES,
                homework: homework,
                csrfmiddlewaretoken: token,
                },
            success : function(json) {
            	
            },
            error : function(xhr,errmsg,err) {
                alert("Could not send URL to Django. Error: " + xhr.status + ": " + xhr.responseText)
            }
        })

			$("td").text("")
			$(".c-title").text("Предмет")
			$(".t-title").text("Задание")
			$(".d-title").text("Описание урока")

			for(var i=1; i < 9; i++){
				$(".c" + i).append(lessons[i-1])
				$(".t" + i).append(tasks[i-1])
				$(".d" + i).append(descriptions[i-1])
			}
			$(".edit-hw__button").attr("active", "false")
			$(".end-edit").css("display", "none")
		}
	)

	function EditHomework () {
		var lessons      = [],
			tasks        = [],
			descriptions = []
		
		if (JSON.parse($(".edit-hw__button").attr("active"))){

			for (var i=1; i < 9; i++){
				lessons.push($($(".class")[i]).text())
				tasks.push($($(".task")[i]).text())
				descriptions.push($($(".description")[i]).text())
			}
			$("td").text("")
			$(".c-title").text("Предмет")
			$(".t-title").text("Задание")
			$(".d-title").text("Описание урока")

			for(var i=1; i < 9; i++){
				$(".c" + i).append(lessons[i-1])
				$(".t" + i).append(tasks[i-1])
				$(".d" + i).append(descriptions[i-1])
			}
			$(".edit-hw__button").attr("active", "false")
			$(".end-edit").css("display", "none")
		}
		else {

			for (var i=1; i < 9; i++){
				lessons.push($($(".class")[i]).text())
				tasks.push($($(".task")[i]).text())
				descriptions.push($($(".description")[i]).text())
			}
			$("td").text("")
			$(".c-title").text("Предмет")
			$(".t-title").text("Задание")
			$(".d-title").text("Описание урока")

			for(var i=1; i < 9; i++){
				$(".c" + i).append("<textarea>" + lessons[i-1] + "</textarea>")
				$(".t" + i).append("<textarea>" + tasks[i-1] + "</textarea>")
				$(".d" + i).append("<textarea>" + descriptions[i-1] + "</textarea>")
			}
			$(".edit-hw__button").attr("active", "true")
			$(".end-edit").css("display", "block")
		}
		

	}

    $(".homework").click(function () {
        $("#HW-Overlay").fadeIn(297, function () {
            $("#HW-Modal")
                .css("display", "block")
                .animate({ opacity: 1 }, 198);
        })
    })

    $("#Modal__close, #Overlay").click(function () {
        $("#HW-Modal").animate({ opacity: 0 }, 198, function () {
            $(this).css("display", "none");
            $("#HW-Overlay").fadeOut(297);
        })
    })
	
    var DAY_NUMBER_CHANGES = 0

	$(".last-day").click(function() {
		if ( Number($(".homework").attr("day-number")) + DAY_NUMBER_CHANGES - 1 > 0 ){
			DAY_NUMBER_CHANGES -= 1
		}
		change_day()
    })

	$(".next-day").click(function() {
		DAY_NUMBER_CHANGES += 1
		change_day()
    })

	function change_day() {
		$(".edit-hw__button").attr("active", "false")
		$(".end-edit").css("display", "none")

		link = $(".homework").attr("day-link")
        if (link[link.length-3] != '/') {
        	if (link[link.length-4] != '/') {
        		link = link.slice(0, link.length-4)
        	}
        	else {
        		link = link.slice(0, link.length-3)
        	}
        }
        else {
        	link = link.slice(0, link.length-2)
        }

        link += (Number($(".homework").attr("day-number")) + DAY_NUMBER_CHANGES) + "/"
        $.ajax({
            url: link,
            type: "GET",
            success : function(json) {
       		
            	for (var i=0; i < 8; i++){
            		$(".c" + (i+1)).text(json["lessons"][i])
            		$(".t" + (i+1)).text(json["tasks"][i])
            		$(".d" + (i+1)).text(json["descriptions"][i])
            	}

            },
            error : function(xhr,errmsg,err) {
            	if (DAY_NUMBER_CHANGES > 0) DAY_NUMBER_CHANGES -= 1
            	else DAY_NUMBER_CHANGES += 1
            }
        })
	}

	$( ".search" ).change(function() {

		var searching = $(this).val()
		
	    $(".item_chat").not(":contains(" + searching +")").remove()
	    
	    if ($('.chats .item_chat').length <= 3 && searching != "") {
	        $.ajax({
            url: searching,
            type: "GET",
            success : function(json) {
            	$('.breaker').remove()
            	$('.finded').remove()
            	if (JSON.stringify(json)){
	            	var breaker = 
	            		$('<div>', {
	                        'class': 'breaker',
	                        text: "Найденые"
	                    })
	                $('.chats').append(breaker)
	            }
	            var flag = true
                for (var i in json){
                	var newFindedUser = 
            		$('<a>', {
                        'class': 'item_chat finded',
                        text: json[String(i)][0],
                        base: "new_chat/" + json[String(i)][1]
                    })
                	$('.chats').append(newFindedUser)
                	flag = false
                }
                if (flag){
                 	$('.breaker').remove()
                }
            },
            error : function(xhr,errmsg,err) {
                alert("Could not send URL to Django. Error: " + xhr.status + ": " + xhr.responseText)
            }
        })	
	    }
	})

	function sendMessage() {
        var 
            message = $('#message-text').val(),
            toUser  = $('.send-button').attr('user'),
            link    = $('.send-button').attr('data-ajax-target'),
            token   = $('.send-button').attr('token')

        if (message == ""){
            return
        }
        $.ajax({
            url: link,
            type: "POST",
            dataType: "json",
            data: {
                to_user: toUser,
                message: message,
                csrfmiddlewaretoken: token
                },
            success : function(json) {
            	var myNewMessage =
            		$('<div>', {
                		'class': 'message my',
            		})
            	var myNewMessage_text =
        			$('<span>', {
            			'class': 'message-text',
            			text: message
        			})
        		var date = new Date()
        		var hours = date.getHours()
			    var minutes = date.getMinutes()
	  			if (hours < 10) hours = "0" + hours
	  			if (minutes < 10) minutes = "0" + minutes
        		var myNewMessage_time = 
        			$('<span>', {
            			'class': 'message-time',
            			text: hours + ":" + minutes
        			})
        		myNewMessage.append(myNewMessage_text)
        		myNewMessage.append(myNewMessage_time)
                $('.message-my').append(myNewMessage)
                $('.message-my').append("<br />")
                emptyHeight = $($(".op").slice(-1)).height() + 20
                var empty = $('<div>', {
                	'class': 'empty',
                	'style': "height: " + emptyHeight + "px"
                })
                $('.message-op').append(empty)
                $('.message-op').append("<br />")
                $('#message-text').val('')
                $('.chating').scrollTop($('.messages').height())
            },
            error : function(xhr,errmsg,err) {
                alert("Could not send URL to Django. Error: " + xhr.status + ": " + xhr.responseText)
            }
        })
    }

	$('.chating').scrollTop($('.messages').height())
	$( ".send" ).change(function() {
    	sendMessage()
    })

    var gettingData = function () {
        var 
            link = $('.send-button').attr('link-to-get'),
            chat = $('.send-button').attr('user')

        $.ajax({
            url: link,
            type: "GET",
            success : function(json) {
                var n = 0
                for (var i in json){
                    n+=1
                }
                if (n > 0){
                    for (var i in json){
                        if (json[String(i)]["message_chat_id"] == chat){
                        	var opNewMessage = 
	                            $('<div>', {
	                        		'class': 'message op',
	                    		})
	                    	var opNewMessage_text = 
                    			$('<span>', {
                        			'class': 'message-text',
                        			text: json[String(i)]["message_text"]
                    			})
                    		var opNewMessage_time = 
                    			$('<span>', {
                        			'class': 'message-time',
                        			text: json[String(i)]["message_time"]
                    			})
                    		opNewMessage.append(opNewMessage_text)
							opNewMessage.append(opNewMessage_time)
                            $('.message-op').append(opNewMessage)
                            $('.message-op').append("<br />")
                            emptyHeight = $($(".my").slice(-1)).height() + 20
			                var empty = $('<div>', {
			                	'class': 'empty',
			                	'style': "height: " + emptyHeight + "px"
			                })
			                $('.message-op').append(empty)
                            $('.message-my').append("<div class='empty'></div>")
                            $('.message-my').append("<br />")
                        }
                    }
                }
            },
            error : function(xhr,errmsg,err) {
                alert("Could not send URL to Django. Error: " + xhr.status + ": " + xhr.responseText)
            }
        })
    }
    setInterval(gettingData, 10000);
	
    $(".menu").click(function(){
    	$(".settings-sidebar").css("display", "block")
    })

    $(".settings-sidebar").on('click', ".closer", function(){
    	$(".settings-sidebar").css("display", "none")
    })

    $(".chats").on('click', ".item_chat", function(){
    	openChat($(this).attr('base'))
    })
    $(".chats").on('click', ".item_chat finded", function(){
    	openChat($(this).attr('base'))
    })

    function openChat (link){

    	$.ajax({
            url: link,
            type: "GET",
            success : function(json) {

                $(".message-op").empty();
                $(".message-my").empty();
                $(".time-breaker").empty();
                $(".chat-name").text(json["opname"])

                let messageTime = []
                let last = []
                let nowTime = []

                for (var i in json["messages"]){
                	last = messageTime
                	nt = new Date()
                	nowTime = [nt.getFullYear(),nt.getMonth(),nt.getDate(),nt.getHours(),nt.getMinutes()]
                	mt = new Date(json["messages"][i][2] * 1000)
                	messageTime = [mt.getFullYear(),mt.getMonth(),mt.getDate(),mt.getHours(),mt.getMinutes()]

                	if(last == ''){
                		last = [-2,-2,-2,-2,-2]
                	}
         			
            		if (last[0] != messageTime[0] && messageTime[0] != nowTime[0]){  
            			var breakerTime =
                    		$('<div>', {
                        		'class': 'time_breaker',
                        		text: messageTime[2].toString() + " " + messageTime[1].toString() + " " +  messageTime[0].toString() + " года"    
                    		})
                    	var n = $(".message-my").children().length / 2
                    	for (var j=0;j<n;j++){
                    		$('.time-breaker').append("<div class='empty'></div>")
                        	$('.time-breaker').append("<br />")
                    	}
                    	$('.time-breaker').append(breakerTime)
                    	
                    	$(".message-my").append("<div class='howitcan'></div>")
                    	$(".message-my").append("<br />")
            		}

            		let message_Minutes = mt.getMinutes()			// добавление нуля перед значением когда было отправленно сообщение
            		if (mt.getMinutes() < 10) {
            			message_Minutes = "0" + mt.getMinutes()
            		}

                	if (json["messages"][i][0] == json["me"]){
                		var myNewMessage =
                    		$('<div>', {
                        		'class': 'message my',
                    		})
                    	var myNewMessage_text =
                			$('<span>', {
                    			'class': 'message-text',
                    			text: json["messages"][i][1]
                			})
                		var myNewMessage_time = 
                			$('<span>', {
                    			'class': 'message-time',
                    			text: mt.getHours() + ":" + message_Minutes
                			})
                		myNewMessage.append(myNewMessage_text)
                		myNewMessage.append(myNewMessage_time)
                		$('.message-my').append(myNewMessage)
                		$('.message-my').append("<br />")
                        $('.message-op').append("<div class='empty'></div>")
                        $('.message-op').append("<br />")
                	}
                	else{
                		var opNewMessage = 
                            $('<div>', {
                        		'class': 'message op',
                    		})
                    	var opNewMessage_text = 
                			$('<span>', {
                    			'class': 'message-text',
                    			text: json["messages"][i][1]
                			})
                		var opNewMessage_time = 
                			$('<span>', {
                    			'class': 'message-time',
                    			text: mt.getHours() + ":" + message_Minutes
                			})
                		opNewMessage.append(opNewMessage_text)
						opNewMessage.append(opNewMessage_time)
                        $('.message-op').append(opNewMessage)
                        $('.message-op').append("<br />")
                        $('.message-my').append("<div class='empty'></div>")
                        $('.message-my').append("<br />")
                	}
                }

                $('.send-button').attr('user', json['chat'][0])

            },
            error : function(xhr,errmsg,err) {
                alert("Could not send URL to Django. Error: " + xhr.status + ": " + xhr.responseText)
            }
        })

		if(mediaQuery.matches){
			$(".chat-list").css("display", "none")
			$(".main-chat").css(
				{
					"display": "block",
					"width": "100%",
					"height": "100%",
					"margin-left": "0",
				}
			)
			$(".chating").css("height", "86%")
			$(".back-button").css("display", "block")
		}

    }
    $(".back-button").click(function (){
    	$(".chat-list").css("display", "block")
		$(".main-chat").css("display", "none")
		$(".back-button").css("display", "none")
    })
})