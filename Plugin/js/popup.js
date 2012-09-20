var backgroundPage = chrome.extension.getBackgroundPage();
				  
        function slider(elemId, sliderWidth, range1, range2, step) {
        	var knobWidth = 14;				
        	var knobHeight = 20;			
        	var sliderHeight = 20;			
        	var offsX,tmp;					
        	var d = document;
        	var isIE = d.all || window.opera;	
        	var point = (sliderWidth-knobWidth)/(range2-range1);
        	var slider = d.createElement('DIV'); 
        	slider.id = elemId + '_slider';
        	slider.className = 'slider';
        	d.getElementById(elemId).appendChild(slider);	
        	var knob = d.createElement('DIV');	
        	knob.id = elemId + '_knob';
        	knob.className = 'knob';
        	slider.appendChild(knob); 
        	knob.style.left = 0;			
        	knob.style.width = knobWidth+'px';	
        	knob.style.height = knobHeight+'px';
        	slider.style.width = sliderWidth+'px';
        	slider.style.height = sliderHeight+'px';
        	var sliderOffset = slider.offsetLeft;			
        	tmp = slider.offsetParent;		
        	while(tmp.tagName != 'BODY') {
        		sliderOffset += tmp.offsetLeft;		
        		tmp = tmp.offsetParent;
        	}
        		knob.addEventListener("mousedown", startCoord, true);		
        		slider.addEventListener("click", sliderClick, true);		
        		knob.addEventListener("mouseup", endCoord, true);	
        		slider.addEventListener("mouseup", endCoord, true);	
        	function setValue(x)	
        	{	
        		if(x < 0) knob.style.left = 0; 
        		else if(x > sliderWidth-knobWidth) knob.style.left = (sliderWidth-knobWidth)+'px';
        		else {
        			if(step == 0) knob.style.left = x+'px';			
        			else knob.style.left = Math.round(x/(step*point))*step*point+'px';
        		}
        		
        	}
        	function setValue2(x)	
        	{
        		if(x < range1){x=range1};
        		if(x > range2) {x=range2};
        		setValue((x-range1)*point);
        	}
        	function getValue() 
        	{return Math.round(parseInt(knob.style.left)/point)+range1;}
        	function sliderClick(e) {	
        		var x;
        		x = e.pageX-sliderOffset-knobWidth/2;
        		setValue(x);
        		var cur_val=getValue();
        		if(elemId=="sl2"){
        			backgroundPage.playHead(cur_val);
        		}
        		if(elemId=="sl1"){
        			backgroundPage.$("#jquery_audioPlayer").jPlayer("volume",cur_val/10);
					backgroundPage.plStatus.volume= cur_val/10;
        		}
        	}
        	function startCoord(e) {			
        		slider.addEventListener("mousemove", mov, true);
        	}
        	function mov(e)	{
        		var x;	
        		x = e.pageX-sliderOffset-knobWidth/2;
        		setValue(x);
        		var cur_val=getValue();
        		if(elemId=="sl2"){
        			backgroundPage.playHead(cur_val);
        		}
        		if(elemId=="sl1"){
        			backgroundPage.$("#jquery_audioPlayer").jPlayer("volume",cur_val/10);
					backgroundPage.plStatus.volume= cur_val/10;
        		}
        	}
        	function endCoord()	{
        		slider.removeEventListener("mousemove", mov, true);
        	}
        	this.setValue = setValue2;
        	this.getValue = getValue;
        } 
					
					function writeTable(){
						ClearTable();
						if (backgroundPage.plStatus.playListReady==true){ReadPlayList(backgroundPage.playList);
						}else{
							setTimeout(writeTable,500);$('#load').fadeIn();
						}
					}
					 function ReadPlayList(list){
			            	if (list!=null){
			            			for( x in list)
			            				{$('#load').fadeOut();
			            					var id = $('#playList-table tbody tr').length;
			            					if (backgroundPage.tPlayListCur.length>0&backgroundPage.plStatus.titlePlaylist==list[x].name){  	
			            						$("#playList-table tbody").append($("<tr id=\"playList-" + id + "\" class=\"selected\">"));
			            					}else{
			            						$("#playList-table tbody").append($("<tr id=\"playList-" + id + "\" >"));
			                                }
			            					$("#playList-" + id).append("<td id=\""+id+"\">" + list[x].name + "</td>");
			                                
			                            }
			            	}else{ClearTable();$("#playList-table tbody").append($("<tr><td> Плейлисты отсутствуют или сервер не доступен. Попробуйте позже</b></td>"));
			            	backgroundPage.getPlaylist();setTimeout(writeTable,1000);
			            	}
			         }
					function ClearTable(){
	                	try {
	                        var table = document.getElementById("playList-table");
	                        var rowCount = table.rows.length;
	             
	                        for(var i=0; i<rowCount; i++) {
	                            var row = table.rows[i];
	                            
	                                table.deleteRow(i);
	                                rowCount--;
	                                i--;
	                        }
	                        }catch(e) {
	                         }
	                }
	           		function ClearTable2(){
	                	try {
	                        var table = document.getElementById("mp3playList-table");
	                        var rowCount = table.rows.length;
	             
	                        for(var i=0; i<rowCount; i++) {
	                            var row = table.rows[i];
	                            
	                                table.deleteRow(i);
	                                rowCount--;
	                                i--;
	                        }
	                        }catch(e) {
	                         }
	                }
	           		function writeTable2(){
	           			if( backgroundPage.plStatus.mp3PlayListReady==false){
	           				setTimeout(writeTable2,500);$('#load').fadeIn();
	           			}else{
	           				$('#load').fadeOut();
	           				writeMp3Table();
	           			}
	           			
	           		}
	           		
	           		function loading(){
		           		if(backgroundPage.plStatus.playing==false){ $('#load').fadeIn(); setTimeout(loading,500)
		           		}else{$('#load').fadeOut()
		           		}
	                }
	           		function writeMp3Table(){
	           			if (backgroundPage.tPlayList.length>0){
	           				$('#load').fadeOut();
	           				ClearTable2();
	           				for( var x=0;x<backgroundPage.tPlayList.length;x++){
	            				var id = $('#mp3playList-table tbody tr').length;
                                $("#mp3playList-table tbody").append($("<tr id=\"mp3playList-" + id + "\">"));
                                $("#mp3playList-" + id).append("<td id=\""+id+"\">" + backgroundPage.tPlayList[x].title + "</td>");
	           				}
	            			setTimeout(writeMp3TableTime2,2000);
		            	}else{ClearTable2();$("#mp3playList-table tbody").append($("<tr><td> Мелодии отсутствуют или сервер не доступен. Попробуйте позже</b></td>"));
		            	}
	           		}
	           		
	           		
	           		
	           		function writeMp3TableTime2(){
	           			for( var x=$('#mp3playList-table tbody tr').length;x<backgroundPage.tPlayList.length;x++)
	            				{$('#load').fadeOut();
	           					var id = $('#mp3playList-table tbody tr').length;
                                $("#mp3playList-table tbody").append($("<tr id=\"mp3playList-" + id + "\">"));
                                $("#mp3playList-" + id).append("<td id=\""+id+"\">" + backgroundPage.tPlayList[x].title + "</td>");
	            				} 
	                 	}
	           		
	           		function writeMp3TableCur(){
	           			if (backgroundPage.tPlayListCur.length>0)
	           			{
	           				ClearTable2();
	           				for( var x=0;x<backgroundPage.tPlayListCur.length;x++)
	            				{
	            					var id = $('#mp3playList-table tbody tr').length;
	            					if(backgroundPage.plStatus.current!=id){$("#mp3playList-table tbody").append($("<tr id=\"mp3playList-" + id + "\">"));
	            					}else{
	            						$("#mp3playList-table tbody").append($("<tr id=\"mp3playList-" + id + "\" class=\"selected\">"));
	            					}
	                                $("#mp3playList-" + id).append("<td id=\""+id+"\">" + backgroundPage.tPlayListCur[x].title + "</td>");
	            				} 
	            			
		            	}
	           		}
	           		
	           		$(document).ready(function() {
	                	
	    	            var account = backgroundPage.maccount;
	    	            var curPlaylist=0;
	    		   		window.titlePlaylist="";
	    		   		var myNot=-2;
	    		   		$('#load').fadeOut();
	    		   		var mysl1 = new slider('sl1', 50, 0, 10, 1); 
	    		   		mysl1.setValue(backgroundPage.plStatus.volume*10);
	    		   		var mysl2 = new slider('sl2', 230, 0, 100, 1); 
	    		   		mysl2.setValue(Math.ceil(backgroundPage.plStatus.procent));
	    		   		if(backgroundPage.plStatus.shuffle==true){$('#pl_shuffle').fadeOut();$('#pl_noshuffle').fadeIn();
	    		   			}else{$('#pl_shuffle').fadeIn();$('#pl_noshuffle').fadeOut();}
	    		   				
	    	       		listen();
	    	       		function listen(){
	    	       			setTimeout(listen,1000);
	    	       			if(backgroundPage.plStatus.procent>0){
	    	       				mysl2.setValue(Math.ceil(backgroundPage.plStatus.procent));
	    	       				$("#cur_time").text(correctTime(backgroundPage.plStatus.currentTime));
	    	       				$("#end_time").text(correctTime(backgroundPage.plStatus.duration));
	    	       				$("#pl_title").text(backgroundPage.tPlayListCur[backgroundPage.plStatus.current].title);
	    	       			}
	    	       		}
	    	       		
	    	       		function correctTime(number){
	    	       			var minute=parseInt(number/60);
	    	       			var seconds=parseInt(number%60);
	    	       			var m="";var s="";
	    	       			if (minute<10){m="0"+minute}else{m=minute}
	    	       			if (seconds<10){v="0"+seconds}else{v=seconds}
	    	       			return m+":"+v;
	    	       		}
	    	       		
	    	       		if (backgroundPage.plStatus.opened==0){
	    	       			myNot=1;
	    	   	            backgroundPage.plStatus.list=0;
	    	   	            backgroundPage.getPlaylist();
	    	   	            backgroundPage.plStatus.playListReady=false;
	    	   	            setTimeout(writeTable,1000);$('#load').fadeIn();
	    	       			
	    	       		}else{
	    	       			writeTable();
	    	       		}
	    	       		if (backgroundPage.plStatus.list==0){
	    	       			$("#pl-favorite").addClass("unselected");
	    	   	            $("#pl-playList").removeClass("unselected");
	    	   	            
	    	       		}else{
	    	       			$("#pl-favorite").removeClass("unselected");
	    	   	            $("#pl-playList").addClass("unselected");
	    	       		}
	           		
	               
	                   $("span").live("click", function(e) {
	                   		chrome.tabs.create({
	                           url: "http://"+backgroundPage.maccount[0].region
	                            });
	                    });
	                   
	                  
	                   
	                 	$("#pl_play").click(function() {
	             			if(backgroundPage.plStatus.opened!=1){
	           			   		backgroundPage.playNumber(0);
	    	                    backgroundPage.plStatus.opened=1;
	    	                    loading();
	    	                    backgroundPage.plStatus.myNot=myNot;
	    	                    writeMp3TableCur();
	             			}else{
	    	            	   	backgroundPage.play();
	    	            	   	loading();
	    	            	  	backgroundPage.plStatus.play=true;
	               			}
	               		});
	                 
	                 	$("#pl_pause").click(function() {
	    	           	   backgroundPage.pause();
	    	           	   $("#jplayer_pause").hide();
	    	           	   $("#jplayer_play").show();
	    	           	   backgroundPage.plStatus.play=false;
	                	});
	                
	    	            $("#pl_next").click(function() {
	    	            	backgroundPage.playNext();
	    	            	writeMp3TableCur();
	    	            	loading();
	    	            	
	    	           	});
	    	           	$("#pl_prev").click(function() {
	    	           		backgroundPage.playPrev();
	    	           		writeMp3TableCur();
	    	           		loading();
	    	           	});
	    	              
	    	            $("#pl-favorite").click(function() {
	    	           		backgroundPage.getToken();
	    	            	$("#pl-playList").addClass("unselected");
	    		            $("#pl-favorite").removeClass("unselected");
	    		            myNot=0;
	    		            backgroundPage.plStatus.list=1;
	    		            backgroundPage.getFavorlist();
	    		            backgroundPage.plStatus.playListReady=false;
	    		            writeTable();
	    		        });
	    		   		 $("#pl-playList").click(function() {
	    			   		backgroundPage.getToken();
	    		   			$("#pl-favorite").addClass("unselected");
	    	    	        $("#pl-playList").removeClass("unselected");
	    		            myNot=1;
	    		            backgroundPage.plStatus.list=0;
	    		            backgroundPage.getPlaylist();
	    		            backgroundPage.plStatus.playListReady=false;
	    		            writeTable();
	    		            
	    		   		});
	    		   		$("#pl_refresh").click(function() {
	    		   			ClearTable();
	    		   			ClearTable2();
	    		   			$("#pl-favorite").addClass("unselected");
	    	    	        $("#pl-playList").removeClass("unselected");
	    		   			backgroundPage.stop();
	    		           	backgroundPage.plStatus.play=false;
	    		   			$('#load').fadeIn();
	    		   			myNot=1;
	    		            backgroundPage.plStatus.list=0;
	    		            backgroundPage.getPlaylist();
	    		            backgroundPage.plStatus.playListReady=false;
	    		            backgroundPage.plStatus.curPlaylist=-1;
	    		            setTimeout(writeTable,1000);$('#load').fadeIn();
	    		            backgroundPage.plStatus.titlePlaylist="";
	    		            backgroundPage.plStatus.opened=0;
	    		            $("#pl_title").text("");
	    		   		});
	    		   		$("#pl_shuffle").click(function() {
	    		   			backgroundPage.plStatus.shuffle=true;
	    		   			$('#pl_shuffle').hide();
	    		   			$('#pl_noshuffle').show();
	    		   		});
	    		   		$("#pl_noshuffle").click(function() {
	    		   			backgroundPage.plStatus.shuffle=false;
	    		   			$('#pl_noshuffle').hide();
	    		   			$('#pl_shuffle').show();
	    		   		});
	    		   		 if(backgroundPage.plStatus.opened==1){
	    		   			writeMp3TableCur();
	    		   			 }
	    		   		 
	    		   		 $("#playList-table tbody tr").live("click", function() {
	    		   					$('#playList-table tr').not('thead tr').not("tfoot tr").removeClass("selected");
	    		              		if (!$(this).hasClass("selected")) {
	    		                        $(this).addClass("selected");
	    		                        backgroundPage.Getmp3(backgroundPage.playList[$($(this).find("td")[0]).attr("id")]);
	    		                        curPlaylist=$($(this).find("td")[0]).attr("id");
	    		                        backgroundPage.plStatus.mp3PlayListReady=false;
	    		                        writeTable2();
	    		                        titlePlaylist=backgroundPage.playList[$($(this).find("td")[0]).attr("id")].name;
	    		                    }else {
	    		                       $(this).removeClass("selected");
	    		                    }
	    		   		});
	    		   		$("#mp3playList-table tbody tr").live("click", function() {
	    			   			$('#mp3playList-table tr').not('thead tr').not("tfoot tr").removeClass("selected");
	    	                	if(backgroundPage.plStatus.curPlaylist!=curPlaylist || backgroundPage.plStatus.myNot!=myNot){backgroundPage.addPlaylist();}
	    	                	if (!$(this).hasClass("selected")) {
	    	                        $(this).addClass("selected");
	    	                        backgroundPage.playNumber($($(this).find("td")[0]).attr("id"));
	    	                     	loading();
	    	                      	backgroundPage.plStatus.play=true;
	    	                    }else {
	    	                    	$(this).removeClass("selected");
	    	                    }
	    	              		backgroundPage.plStatus.titlePlaylist=titlePlaylist;
	    	                    backgroundPage.plStatus.opened=1;
	    	                    backgroundPage.plStatus.curPlaylist=curPlaylist;
	    	                    backgroundPage.plStatus.myNot=myNot;
	    	            });
	    	   	})