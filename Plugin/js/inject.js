// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
window.addEventListener("keydown", function(event) {
  // Bind to both command (for Mac) and control (for Win/Linux)
  var modifier = event.ctrlKey || event.metaKey;
  if (modifier && event.altKey && event.keyCode == 39) {
    // Send message to background page to toggle tab
    chrome.extension.sendRequest({nambaplayerNext: true}, function(response) {
      // Do stuff on successful response
    });
  }
  if (modifier && event.altKey && event.keyCode == 37) {
	    // Send message to background page to toggle tab
	    chrome.extension.sendRequest({nambaplayerPrev: true}, function(response) {
	      // Do stuff on successful response
	    });
	  }
  if (modifier && event.altKey && event.keyCode == 38) {
	    // Send message to background page to toggle tab
	    chrome.extension.sendRequest({nambaplayerPlay: true}, function(response) {
	      // Do stuff on successful response
	    });
	  }
  if (modifier && event.altKey && event.keyCode == 40) {
	    // Send message to background page to toggle tab
	    chrome.extension.sendRequest({nambaplayerPause: true}, function(response) {
	      // Do stuff on successful response
	    });
	  }
}, false);
