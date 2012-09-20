 var backgroundPage;
            var errorVisible = false;
            var timeLate=false;
            
            function defPosition(event) {
                var x = y = 0;
                if (document.attachEvent != null) { // Internet Explorer & Opera
                    x = window.event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
                    y = window.event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
                } else if (!document.attachEvent && document.addEventListener) { // Gecko
                    x = event.clientX + window.scrollX;
                    y = event.clientY + window.scrollY;
                } 
                return {x:x, y:y};
            }
            // Простая проверка
            // С помощью document.write выведем координаты прямо в окно браузера
            // Они будут обновлять при движении мыши
            document.onmousemove = function(event) {
                var event = event || window.event;


            //Здесь координаты присваиватся положению слоя относительно окна и к координате х плюсуется 15 пикселов, чтоб курсор не был на подсказке.
                    document.getElementById('help').style.left = defPosition(event).x + 45 + "px";
                    document.getElementById('help').style.top = defPosition(event).y -200+ "px";
            }

            //Функция, которая делает видимым наш слой и вкладывает в него необходимый текст.
            function helpBox(title, text) {
            //Вкладываем текст
                    document.getElementById('helpTitle').innerHTML = title;
                    document.getElementById('helpText').innerHTML = text;

            //Делаем видимым\невидимым
                    if(document.getElementById('help').style.display == 'none'){
                            document.getElementById('help').style.display = 'block';
                    }else{
                            document.getElementById('help').style.display = 'none';
                    }
            }
            
            $(document).ready(function() {
            	$("#mimg").mouseover(function(){
            		helpBox('Управление с помощью клавиатуры', 'С помощью сочетаний клавиш -  ctrl + alt + стрелки вверх, вниз, влево, вправо происходит управление плеером');
            	});
            	$("#mimg").mouseout(function(){
            		helpBox();
            	});
            	backgroundPage = chrome.extension.getBackgroundPage();
                var maccount = backgroundPage.maccount;
               
                
                if (maccount.length != 0) {
                	$("#account-table tbody").append($("<tr id=\"account-1\">"));
                    $("#account-1").append("<td>" + maccount[0].login+"@"+ maccount[0].region+ "</td>");
                    $("#remove-account").show();
                    $("#account-table").fadeIn();
                    $(".spacer").show();
                } else {
                    $("#add-account-form").fadeIn();
                    $("#username").focus();
                }
                
              
                
                $("#remove-account").click(function() {
            		$("#error-message2").text("Аккаунт успешно удален");
                    showError2();
                	backgroundPage.removeAccount();
                	document.getElementById("account-table").deleteRow(1);
                    $("#account-table").hide();
                    $("#remove-account").hide();
                    $(".spacer").hide();
                    $("#add-account-form").fadeIn();
                    $("#username").focus();
                });
                
                
                
                function showError(){
                    if (!errorVisible) {
                        $('#error-form').fadeIn(function(){
                            errorVisible = true;
                          
                        }); 
                    }
                }
                function showError2(){
                    if (!errorVisible) {
                        $('#error-form2').fadeIn(function(){
                            errorVisible = true;
                            $(this).delay(2000).fadeOut(function(){
                                errorVisible = false;
                            });
                        }); 
                    }
                }
                
                
                function checktimeLate(){
                    if (timeLate) {
                    	$("#error-message").text("Сервер не отвечает. Возможно отсутствует подключение к интернету. Попробуйте позже.");
                    }
                }
                function stopError(){
                    
                        $('#error-form').fadeOut(function(){
                            errorVisible = false;
                        }); 
                }
                $("#add-account-form").keypress(function (e) {
                    if(e.which == 13) {
                    	 $("#add-account").click();
                    }
                });
                
                
                $("#add-account").click(function() {
                    var username = $("#username").val();
                    if (username.length > 0 ) {
                    	var oregion = username.split('@');
                    	if(oregion[1]){
                    	  if(oregion[1]=="namba.kg"||oregion[1]=="namba.kz"){
                    		 	var xmlhttp3 = new XMLHttpRequest();
                           	 	xmlhttp3.onreadystatechange = function() {       	
                                    if ( xmlhttp3.readyState == 4 && xmlhttp3.status == 200) { 
                            			var response3 = xmlhttp3.responseXML;
                            			if ($(response3).find("login").text()==oregion[0]){
	                                        	var id = $('#account-table tbody tr').length;
				                                $("#account-table tbody").append($("<tr id=\"account-" + id + "\">"));
					                            $("#account-" + id).append("<td>" + username + "</td>");
				                               	var newAccount = { 
				                                    login:  oregion[0],
				                                    region: oregion[1]
				                                    }
				                               	
			                              			backgroundPage.addAccount(newAccount);
				                               		
					                                $("#add-account-form").fadeOut();
					                                $("#account-table").fadeIn();
					                                $("#remove-account").fadeIn();
					                                $(".spacer").fadeIn();
					                                $("#username").val("");
					                            	$('#error-form').fadeOut(function(){
					                                 errorVisible = false;});
					                                $("#error-message2").text("Ваш Намба аккаунт успешно принят");
					                                stopError();
					                                showError2();
					                                timeLate=false;
				                        		}else{
		                                            $("#error-message").text("Неверные почтовый адрес");
		                                            showError();timeLate=false;
                                      				}
                                    	
                                    }else{
                                        $("#error-message").text("Ожидание ответа от сервера");
                                        showError();
                                        timeLate=true;
                                        setTimeout(checktimeLate, 1000 * 5);
                                        
                                    }
                            	}
            	            	
                                    var params3 = "username=" + encodeURIComponent(oregion[0]) +"&outputType="+"xml";
                                    xmlhttp3.open("POST", "http://api."+oregion[1]+"/getUserInfo.php", true);
                                    xmlhttp3.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                    xmlhttp3.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
                                    xmlhttp3.setRequestHeader("Connection", "close");
                                    xmlhttp3.send(params3);	  
                        	
                         
                    	  }else {
                            $("#error-message").text("Данные введены не верно");
                            showError();
                    	  }
                    	}else {
                            $("#error-message").text("Данные введены не верно");
                            showError();
                    	}
                    }
                    else
                    {
                        	if ($("#username").val().length < 1) {
                                $("#error-message").text("Введите почтовый адрес");
                            } 

                        showError();
                    }
                    
                });
            });  