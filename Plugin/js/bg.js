//document.addEventListener('DOMContentLoaded', init());
chrome.extension.onRequest.addListener(
  			  function(request, sender, sendResponse) {
  			    if (request.nambaplayerNext) {playNext();}
  				if (request.nambaplayerPlay) {play();}
  				if (request.nambaplayerPrev) {playPrev();}
  				if (request.nambaplayerPause) {pause();}
  			  }
  		);
        var maccount = [];
    	var token="";
        var playList = [];
        var mp3s=[];
        var mp3files=[];
        var tPlayList=[];
        var tPlayListCur=[];
        var mp3Summer=0;
            
            if(!localStorage.maccount){
    			window.open(chrome.extension.getURL('options.html'))
    		}
            
            $(document).ready(function() {
            	
            	 window.$("#jquery_audioPlayer").jPlayer({
            	        swfPath: "/js",
            	        wmode: "window",
            	        supplied: "mp3"
            	    });
				window.plStatus = {
            	 play:false,
            	 volume:0.8,
            	 list:0,
            	 opened:0,
            	 current:0,
            	 titlePlaylist:"",
            	 curPlaylist:-1,
            	 myNot:-1,
            	 procent:0,
            	 playing:false,
            	 duration:"00:00",
            	 currentTime:"00:00",
            	 playListReady:false,
            	 mp3PlayListReady:false,
            	 shuffle:false
            	};
            	
            	
            	window.eventOn= function() {
	            	$('#jquery_audioPlayer').bind($.jPlayer.event.error , function(event) { // binding to the play event so this runs every time media is played
	                    plStatus.play=false;
	                    plStatus.procent=0;
	                    plStatus.playing=false;
	                    playNext();
         			});
	            	$('#jquery_audioPlayer').bind($.jPlayer.event.ended , function(event) { // binding to the play event so this runs every time media is played
	                  plStatus.play=false;
	                  plStatus.procent=0;
	                  plStatus.playing=false;
	                   playNext();
         			});
         			$('#jquery_audioPlayer').bind($.jPlayer.event.timeupdate  , function(event) { // binding to the play event so this runs every time media is played
	                    plStatus.procent=event.jPlayer.status.currentPercentAbsolute;
	                    plStatus.currentTime=event.jPlayer.status.currentTime;
	                    plStatus.duration=event.jPlayer.status.duration;
         			});
         			$('#jquery_audioPlayer').bind($.jPlayer.event.playing  , function(event) { // binding to the play event so this runs every time media is played
	                    plStatus.playing=true;	                   
         			});
            	}
            	init();
            });
            function playHead(number){
            	plStatus.playing=false;
            	$("#jquery_audioPlayer").jPlayer("playHead", number);
            }
           
            function stop(){
            	$('#jquery_audioPlayer').jPlayer("stop");
            	plStatus.procent=0;
            	plStatus.playing=false;
        	}
			function play(){
            	$('#jquery_audioPlayer').jPlayer("play");
        	}
			function pause(){
            	$('#jquery_audioPlayer').jPlayer("pause");
            	plStatus.playing=false;
        	}
            function playNumber(number){
            	plStatus.playing=false;
            	plStatus.procent=0;
            	if(tPlayListCur.length>0){$('#jquery_audioPlayer').jPlayer("setMedia", {mp3:tPlayListCur[number].mp3});}else{
            		tPlayListCur=tPlayList; 
            		$('#jquery_audioPlayer').jPlayer("setMedia", {mp3:tPlayListCur[number].mp3});}
            	$('#jquery_audioPlayer').jPlayer("play");
        	   	plStatus.current=number;
            }
    		
    		function playNext(){
    			if(plStatus.shuffle==false){
	    			plStatus.current=parseInt(plStatus.current)+1;
	    			plStatus.playing=false;
	    			plStatus.procent=0;
	    			if(tPlayListCur.length>(parseInt(plStatus.current))){
	    			$('#jquery_audioPlayer').jPlayer("setMedia", {mp3:tPlayListCur[parseInt(plStatus.current)].mp3});
	        	   	$('#jquery_audioPlayer').jPlayer("play");
	        	   	plStatus.play=true;
	    			}else //if(plStatus.repeat==true)
	    			{playNumber(0);plStatus.current=0;plStatus.play=true;}
    			}else{
    				plStatus.current =Math.round(getRandomArbitary(0,tPlayListCur.length-1));
    				plStatus.playing=false;
	    			plStatus.procent=0;
	    			$('#jquery_audioPlayer').jPlayer("setMedia", {mp3:tPlayListCur[parseInt(plStatus.current)].mp3});
	        	   	$('#jquery_audioPlayer').jPlayer("play");
	        	   	plStatus.play=true;
    			}
    		}
    		function getRandomArbitary (min, max) {
    		    return Math.random() * (max - min) + min;
    		}
    		function playPrev(){
    			plStatus.playing=false;
    			plStatus.procent=0;
    			if(parseInt(plStatus.current)!=0){
    			$('#jquery_audioPlayer').jPlayer("setMedia", {mp3:tPlayListCur[plStatus.current-1].mp3});
        	   	$('#jquery_audioPlayer').jPlayer("play");
        	   	plStatus.current=parseInt(plStatus.current)-1;plStatus.play=true;
    			}else {playNumber(tPlayListCur.length-1);plStatus.current=tPlayListCur.length-1;plStatus.play=true;}
    		}
            function init() {
            	chrome.browserAction.setBadgeBackgroundColor({
                    color:[0, 134, 255, 255]
                });
				if (localStorage.maccount) {
                    maccount = JSON.parse(localStorage.maccount);
                    disablePopup();
                } 
                if (maccount.length > 0) {
                	enablePopup();
                    chrome.browserAction.setIcon({
                        path: "../img/namba.png"
                    });
                } else {
                    chrome.browserAction.setIcon({
                        path: "../img/namba_gray.png"
                    });
                    chrome.browserAction.setTitle({
                        title: "Добавьте аккаунт"
                    });
                    disablePopup();
                }
                
                chrome.browserAction.onClicked.addListener(function() {
                    if (showOptions) {
                        chrome.tabs.create({
                            url: chrome.extension.getURL('options.html')
                        }); 
                    }
                });
                setTimeout(initializeRequests, 500 * 1);
            }
            
            function addAccount(account) {
               		chrome.browserAction.setIcon({
                        path: "../img/namba.png"
                    });
                    chrome.browserAction.setTitle({
                        title: ""
                    });
                    maccount.push(account);
                    localStorage.maccount = JSON.stringify(maccount);
                    
                    initializeRequests();
             }
            
            function removeAccount() {
            				maccount = [];
            				localStorage.maccount = JSON.stringify(maccount);
                        	chrome.browserAction.setIcon({
                                path: "../img/namba_gray.png"
                            });
                            chrome.browserAction.setBadgeText({
                                text: ""
                            });
                            chrome.browserAction.setTitle({
                                title: "Добавьте аккаунт"
                            });
                            disablePopup();
            }
            
            function enablePopup() {
                chrome.browserAction.setPopup({
                    popup: "popup.html"
                });
            }
            function disablePopup() {
                chrome.browserAction.setPopup({
                    popup: ""
                });
            }
            function getTokenTime() {
            	getToken();
            	setTimeout(getTokenTime, 1000*60*30);
            }
            function initializeRequests() {
            	 if (maccount.length > 0) {
	                enablePopup();
	                setTimeout(getToken, 500 * 1);
	                setTimeout(getTokenTime, 1000*60*10);
	                setTimeout(getPlaylist, 1000 * 1);
	                eventOn();
            	 }
            }
            
            
            
            
            function getToken(){
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                       var n =  xmlhttp.responseText.search("CSRF_TOKEN");	// n равно 11
                       var msubstr= xmlhttp.responseText.substring(n,n+50);
                       var tSplit = msubstr.split('\'');
                       token=tSplit[1];
                    }
                };
                xmlhttp.open("GET", "http://"+maccount[0].region, true);
                xmlhttp.send(null);
                
        	}
            
            function getPlaylist(){
            	var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    	
                       playList = JSON.parse(xmlhttp.responseText);
                       plStatus.playListReady=true;
                    }
                };
                xmlhttp.open("GET", "http://api."+maccount[0].region+"/getUserPlaylists.php?login="+maccount[0].login, true);
                xmlhttp.send(null); 
            }
            
            		
            function getFavorlist(){
            	var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                       playList = JSON.parse(xmlhttp.responseText);
                       plStatus.playListReady=true;
                     }
                };
                xmlhttp.open("GET", "http://api."+maccount[0].region+"/getFavoritePlaylists.php?login="+maccount[0].login, true);
                xmlhttp.send(null);
            }
            
            function Getmp3(mlist,mx){
            	tPlayList=[];
            	mp3Summer=0;
				var xmlhttp = new XMLHttpRequest();
	                xmlhttp.onreadystatechange = function() {
	                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	                    		mp3s[mx] = JSON.parse(xmlhttp.responseText);
	                    	 	if(mp3s[mx].mp3Files!=null){
	                    	 	
	                    			 for(var i=0;i<mp3s[mx].mp3Files.length;i++){
	                    			 	GetLinnks(mx,i);
	                    			 }
	                    	 	}
	                    }
	                }
				xmlhttp.open("GET", "http://"+maccount[0].region+"/api/?service=music&action=playlist_page&token="+token+"&id="+mlist.id+"", true);
	                xmlhttp.send(null);
            }
           
            function GetLinnks(mx,i){
            	 var xmlhttp = new XMLHttpRequest();
	                xmlhttp.onreadystatechange = function() {
	                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	                    	var n =  xmlhttp.responseText.search("http://download.files."+maccount[0].region+"/files/"+mp3s[mx].mp3Files[i].id+"");	// n равно 11
	                        var msubstr= xmlhttp.responseText.substring(n,n+400);
                        	var tSplit = msubstr.split('"');
	                        mp3files[mx,i]=tSplit[0];
 	                    	var newItemList={
 	                    		 title:mp3s[mx].mp3Files[i].filename,
 	                    		 mp3:tSplit[0]
 	                     	}
	                       	tPlayList[i]=newItemList;
 	                    	mp3Summer++;
 	                    	if(mp3Summer==mp3s[mx].mp3Files.length){plStatus.mp3PlayListReady=true}
	                    	
	                    }
	                }
	                xmlhttp.open("GET", "http://download.files."+maccount[0].region+"/files/"+mp3s[mx].mp3Files[i].id+"", true);
	                xmlhttp.send(null);
            
            }
            
           
            function addPlaylist(){
            	tPlayListCur=tPlayList;
            }