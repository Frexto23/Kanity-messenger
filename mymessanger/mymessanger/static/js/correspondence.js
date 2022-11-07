$(document).ready(function() {
			$( ".search" ).change(function() {

				var searching = $(this).val()
				
			    $(".item_chat").not(":contains(" + searching +")").remove()
			    
			    if ($('.chats .item_chat').length <= 3) {
			        $.ajax({
		            url: searching,
		            type: "GET",
		            success : function(json) {
		                l = json['len']
		                n = json['number']	
		                for (let i = 0; i < l; i++){
		                	if (i < n){
		                		var item = $('<a>', {
                        			'class': 'item_chat',
                        			'href': "../../chats/" + json[i][1],
                        			text: json[i][0]
                    			})
		                		$('.chats').append(item)
		                	}
		                	else {
		                		var item = $('<a>', {
                        			'class': 'item_chat',
                        			'href': "../findedchat/" + json[i][1],
                        			text: json[i][0]
                    			})	
		                		$('.chats').append(item)
		                	}
		                }
		            },
		            error : function(xhr,errmsg,err) {
		                alert("Could not send URL to Django. Error: " + xhr.status + ": " + xhr.responseText);
		            }
		        });		
			    }
			});

			$('.chating').scrollTop($('.messages').height())
		    $(".send-button").click(function() {
		        var 
		            message = $('#message-text').val(),
		            toUser  = $(this).attr('user'),
		            link    = $(this).attr('data-ajax-target'),
		            token   = $(this).attr('token')
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
		                        text: message
		                    })
		                $('.message-my').append(myNewMessage)
		                $('.message-my').append("<br />")
		                $('.message-op').append("<div class='empty'></div>")
		                $('.message-op').append("<br />")
		                $('#message-text').val('')
		                $('.chating').scrollTop($('.messages').height())
		            },
		            error : function(xhr,errmsg,err) {
		                alert("Could not send URL to Django. Error: " + xhr.status + ": " + xhr.responseText);
		            }
		        });
		    });


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
		                                    'class': 'message',
		                                    text: json[String(i)]["message_text"]
		                                })
		                            $('.message-op').append(opNewMessage)
		                            $('.message-op').append("<br />")
		                            $('.message-my').append("<div class='empty'></div>")
		                            $('.message-my').append("<br />")
		                        }
		                    }
		                }
		            },
		            error : function(xhr,errmsg,err) {
		                alert("Could not send URL to Django. Error: " + xhr.status + ": " + xhr.responseText);
		            }
		        });
		    }
		    setInterval(gettingData, 1000);

		})