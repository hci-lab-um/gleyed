/*global responsiveVoice $ localStorage r deferred openDatabase indexedDB*/

(function($){
    $.fn.keyboardLayout=function(language,layout,ms)
    {
        //var db;
        var keyboard, ready=false;
        
        //--START Load keyboard layout--//
        var loadKeyboard = $.getJSON('assets/keyboard-layouts.json', function(data)
        {
            keyboard = data[layout];
        });
        //--END Load keyboard layout--//

        if(layout=='newKeyboard')
        {
            document.getElementById("separator1").className = document.getElementById("separator1").className.replace('hidden','visible');
            document.getElementById("separator2").className = document.getElementById("separator2").className.replace('hidden','visible');
        }

        loadKeyboard.done(function()
        {
            function loadKeys() 
            {
                var deferred = $.Deferred();
               //--START load keyboard keys--//
                
               //--generating distinct row values from json layout--//
               var arr=[''];
               var j=0;
               for (var i = 0; i < keyboard.length; i++) 
               {
                    if($.inArray(keyboard[i]["row"],arr)<0)
                    {
                        arr[j]=keyboard[i]["row"];
                        j++;
                    }
               }
    
                var r,rowCreated = false;
               
                $('<table id="keyboardstructure">').appendTo('#keyboard');
    
                for (var i=0;i<arr.length;i++)
                {
                    r=arr[i];
                    for (var c=0; c<keyboard.length; c++)
                	{
                	    if(keyboard[c].row<=r)
                	    {
                	        if(keyboard[c].row==r)
                	        {
                	            if(rowCreated)
                	            {
                	                if(keyboard[c].value=='')
                	                {
                	                    $('<td rowspan="'+ keyboard[c].rowspan + '" colspan="' + keyboard[c].colspan + '" class="' +  keyboard[c].class +'"></td>').appendTo('#row-' + r);                	                    
                	                }
                	                else
                	                {
                	                    if(keyboard[c].value=='Enter')
                	                    {
                	                        $('<td rowspan="'+ keyboard[c].rowspan + '" colspan="' + keyboard[c].colspan + '"><div class="' + keyboard[c].class + '" id="button_' + keyboard[c].value + '"><div class="button-value-enter button-value">' + keyboard[c].characterValue + '</div><div class="button-pie"></div></div></td>').appendTo('#row-' + r);
                	                    }
                	                    else if(keyboard[c].value=='J')
                	                    {
                	                        $('<td rowspan="'+ keyboard[c].rowspan + '" colspan="' + keyboard[c].colspan + '"><div class="' + keyboard[c].class + '" id="button_' + keyboard[c].value + '"><div class="button-value-j button-value">' + keyboard[c].characterValue + '</div><div class="button-pie"></div></div></td>').appendTo('#row-' + r);
                	                    }
                	                    else if(keyboard[c].value=='M')
                	                    {
                	                        $('<td rowspan="'+ keyboard[c].rowspan + '" colspan="' + keyboard[c].colspan + '"><div class="' + keyboard[c].class + '" id="button_' + keyboard[c].value + '"><div class="button-value-m button-value">' + keyboard[c].characterValue + '</div><div class="button-pie"></div></div></td>').appendTo('#row-' + r);
                	                    }
                	                    else if(keyboard[c].value=='Backspace')
                	                    {
                	                        $('<td rowspan="'+ keyboard[c].rowspan + '" colspan="' + keyboard[c].colspan + '"><div class="' + keyboard[c].class + '" id="button_' + keyboard[c].value + '"><div class="button-value-backspace button-value">' + keyboard[c].characterValue + '</div><div class="button-pie"></div></div></td>').appendTo('#row-' + r);
                	                    }
                	                    else
                	                    {
                	                        $('<td rowspan="'+ keyboard[c].rowspan + '" colspan="' + keyboard[c].colspan + '"><div class="' + keyboard[c].class + '" id="button_' + keyboard[c].value + '"><div class="button-value">' + keyboard[c].characterValue + '</div><div class="button-pie"></div></div></td>').appendTo('#row-' + r);
                	                    }
                	                }
                	            }
                	            else
                	            {
                	                $('<tr id="row-' + r + '">').appendTo('#keyboardstructure');
                	                if(keyboard[c].value=='')
                	                {
                	                    $('<td rowspan="'+ keyboard[c].rowspan + '" colspan="' + keyboard[c].colspan + '"></td>').appendTo('#row-' + r);
                	                }else
                	                {
                	                    if(keyboard[c].value=='Enter')
                	                    {
                	                        $('<td rowspan="'+ keyboard[c].rowspan + '" colspan="' + keyboard[c].colspan + '"><div class="' + keyboard[c].class + '" id="button_' + keyboard[c].value + '"><div class="button-value-enter button-value">' + keyboard[c].characterValue + '</div><div class="button-pie"></div></div></td>').appendTo('#row-' + r);
                	                    }
                	                    else if(keyboard[c].value=='J')
                	                    {
                	                        $('<td rowspan="'+ keyboard[c].rowspan + '" colspan="' + keyboard[c].colspan + '"><div class="' + keyboard[c].class + '" id="button_' + keyboard[c].value + '"><div class="button-value-j button-value">' + keyboard[c].characterValue + '</div><div class="button-pie"></div></div></td>').appendTo('#row-' + r);
                	                    }
                	                    else if(keyboard[c].value=='M')
                	                    {
                	                        $('<td rowspan="'+ keyboard[c].rowspan + '" colspan="' + keyboard[c].colspan + '"><div class="' + keyboard[c].class + '" id="button_' + keyboard[c].value + '"><div class="button-value-m button-value">' + keyboard[c].characterValue + '</div><div class="button-pie"></div></div></td>').appendTo('#row-' + r);
                	                    }
                	                    else if(keyboard[c].value=='Backspace')
                	                    {
                	                        $('<td rowspan="'+ keyboard[c].rowspan + '" colspan="' + keyboard[c].colspan + '"><div class="' + keyboard[c].class + '" id="button_' + keyboard[c].value + '"><div class="button-value-backspace button-value">' + keyboard[c].characterValue + '</div><div class="button-pie"></div></div></td>').appendTo('#row-' + r);
                	                    }
                	                    else
                	                    {
                	                        $('<td rowspan="'+ keyboard[c].rowspan + '" colspan="' + keyboard[c].colspan + '"><div class="' + keyboard[c].class + '" id="button_' + keyboard[c].value + '"><div class="button-value">' + keyboard[c].characterValue + '</div><div class="button-pie"></div></div></td>').appendTo('#row-' + r);
                	                    }
                	                }
                	                rowCreated=true;
                	            }
                	        }
                	    }else
                	    {
                	        $('</tr>').appendTo('#keyboardstructure')
                	        rowCreated=false;
                	        break;
                	    }
                	}
                }
    
                $('</table>').appendTo('#keyboard');
                //--END load keyboard keys--//
                return deferred.promise();
            }
            

            $('#yes').click(function()
            {
                var inputString = $('#write').clone().children().find('.primary').text().trim();
                inputString=inputString.replace(/\n/ig, '');
                var stringLength = inputString.length;
                var wpm = ((stringLength/5)/(timeOnTask/60)).toFixed(2);
                document.getElementById('wpm').value = wpm;
                document.getElementById('inputString').value = inputString
            });

            //--START: production of speech--//
            var timeoutId;
            $('#Speech').hover(function()
        	{
                if($('#write').text()!='')
                {
                	updateTimeOnTask();
                	console.log(timeOnTask);
                	document.getElementById('tot').value = timeOnTask;
                    document.getElementById('layout').value = layout;
                    var write;
                    if(ms==0)
                	{
                		write = $('#write').clone().children().find('.primary').text();
                	}else
                	{
                		write = $('#write').text();
                	}
                    var parameters = {
                        onend: voiceEndCallback
                    }
                    if(!timeoutId)
                    {
                        timeoutId=window.setTimeout(function()
                        {
                            timeoutId=null;
                            responsiveVoice.speak(write, "UK English Female", parameters);
                        }, ms);
                    }
                }
            },
            function()
            {
                if(timeoutId)
                {
                    window.clearTimeout(timeoutId);
                    timeoutId=null;
                }
        	});
            //--END: production of speech--//
            
            function voiceEndCallback()
            {
                document.getElementById("readyConfirmation").className = document.getElementById("readyConfirmation").className.replace('hidden','visible');
            }
                
            var dwellFreeStringBuffer='';
            var updateText = null;
            $('#write').hover(function()
            {
                if(returnedFromWorker==false)
                {
                    document.getElementById("preloader").className = 'preloader visible';
                }
                if(ms==0)
                {
                    var write = $('#write');
                    if(dwellFreeStringBuffer != '')
                    {
                        document.getElementById("Speech").className = document.getElementById("Speech").className.replace('hidden','visible');
                        write.html(write.html() + dwellFreeStringBuffer);
                        dwellFreeStringBuffer='';
                    }                   

                    updateText = setInterval(function()
                    {
                        if(returnedFromWorker==false)
                        {
                            document.getElementById("preloader").className = 'preloader visible';
                        }else
                        {
                            document.getElementById("preloader").className = 'hidden preloader';
                        }
                        if(dwellFreeStringBuffer != '')
                        {
                            write.html(write.html() + dwellFreeStringBuffer);
                            dwellFreeStringBuffer='';
                            document.getElementById("Speech").className = document.getElementById("Speech").className.replace('hidden','visible');
                        }
                    },500);
                }
            },
            function(e)
            {
                document.getElementById("preloader").className = 'hidden preloader';
                clearInterval(updateText);
            });

            //--choosing word from pop-up list--//
			 $(document).on("mouseover", ".popUpWord", function(e)
			 {
			 	if(!timeoutId)
				{
					timeoutId=window.setTimeout(function()
					{
						timeoutId=null;
						var text = e.currentTarget.innerHTML + " ";
						var child = e.currentTarget,
			            parent = e.currentTarget.offsetParent.offsetParent.firstChild,
			            childtext = child.innerText + " ",
			            parenttext = parent.innerText;

				        child.innerHTML = parenttext;
				        parent.innerHTML = childtext;
				        e.currentTarget.attributes.innerText.nodeValue = child.innerHTML;

					},1500);
				}
			 }).on('mouseout', '.popUpWord', function(e)
			 {
			 	if(timeoutId)
				{
					window.clearTimeout(timeoutId);
					timeoutId=null;
				}
			});

			
			$('#button_delete').hover(function(e)
            {
            	var seconds = 1000 * 0.001;
                        
                $(this).find('.button-pie').pietimer({
                    seconds: seconds,
                    color: '#7FC6A4'
                });

                $(this).find('.button-pie').pietimer('start');

                if(!timeoutId)
                {
                    timeoutId=window.setTimeout(function()
                    {
                        timeoutId=null;
						if(ms==0)
		            	{
		            		deleteWordDwellFree();
		            	}else
		            	{
		            		var write = $('#write');
							var html = write.html();
							write.html(html.substr(0, html.length - 1));
							return false;
		            	}						
                    }, 300);
                }
            },
            function(e)
            {
                window.clearTimeout(timeoutId);
                timeoutId=null;
                $('canvas').remove();
            });

			function deleteWordDwellFree()
            {
            	var write = $('#write');
            	$('#write').children().last().remove();
            }

            //--START: producing text in text area once it's entered - dwell based--//
            function simulateKeyboardClicksDwellBased(value)
            {
                var write = $('#write');
                var character=value;

                if(character.toLowerCase())
                {
                    write.html(write.html() + character.toLowerCase());
                }
                document.getElementById("Speech").className = document.getElementById("Speech").className.replace('hidden','visible');
            }
            //--END: producing text in text area--//
        
            //--START: Load character coordinates in Local Storage--//
            function loadCoordinates () 
            {
                var deferred  = $.Deferred();
                var element, coordinate, width, height;
                //localStorage.clear();
                for (var c=0; c<keyboard.length; c++)
                {
                    if(keyboard[c].value!='')
                    {
                        element = $('#button_' + keyboard[c].value);
                        coordinate = element.offset();
                        width= element.outerWidth();
                        height = element.outerHeight();
                        localStorage.setItem("#button_"+keyboard[c].value + "-top_left", coordinate.left + ',' + coordinate.top);
                        localStorage.setItem("#button_"+keyboard[c].value + "-top_right", (coordinate.left+width) + ',' + coordinate.top);
                        localStorage.setItem("#button_"+keyboard[c].value + "-bottom_left", coordinate.left + ',' + (coordinate.top+height));
                        localStorage.setItem("#button_"+keyboard[c].value + "-bottom_right", (coordinate.left+width) + ',' + (coordinate.top+height));
                    }
                }
                
                //Coordinates of keyboard area
                element = $('#keyboard');
                coordinate = element.offset();
                width = element.outerWidth(true); //to include margin and padding
                height = element.outerHeight(true); //to include margin and padding
                var marginLength = (width - element.outerWidth())/2;
                localStorage.setItem("#keyboard-top_left", (coordinate.left-marginLength) + ',' + coordinate.top);
                localStorage.setItem("#keyboard-top_right", ((coordinate.left+width)-marginLength) + ',' + coordinate.top);
                localStorage.setItem("#keyboard-bottom_left", coordinate.left + ',' + (coordinate.top+height));
                localStorage.setItem("#keyboard-bottom_right", (coordinate.left+width) + ',' + (coordinate.top+height));

                //Coordinates of Space key
                element = $('#button_Space');
                coordinate = element.offset();
                width= element.outerWidth();
                height = element.outerHeight();
                localStorage.setItem("#button_Space-top_left", coordinate.left + ',' + coordinate.top);
                localStorage.setItem("#button_Space-top_right", (coordinate.left+width) + ',' + coordinate.top);
                localStorage.setItem("#button_Space-bottom_left", coordinate.left + ',' + (coordinate.top+height));
                localStorage.setItem("#button_Space-bottom_right", (coordinate.left+width) + ',' + (coordinate.top+height));
            }
            //--END: Load character coordinates in Local Storage--//
            
          	var sentenceArray = new Object ();
            var currentString = '';
            var arrayCount = 0, prevSpace=false, wholeString='', spaceFirstTime=true;

            function trackMouseDwellBased()
            {
                console.log('dwell based');
                var deferred = $.Deferred();
                var cursorX, cursorY, closeLetter;
                
                document.onmousemove = function(e){
                    cursorX = e.pageX;
                    cursorY = e.pageY;
                }
                
                if (window.Worker)
                {
                    var myWorker = new Worker("scripts/web-worker.js");
                    var request = window.indexedDB.deleteDatabase('dwellfree');
                    request.onsuccess = function(e)
                    {
                        console.log('successfully deleted db');
                    }
                    request.onerror = function(e)
                    {
                    	console.log('error deleting db');
                    }
                    
                    $(".button-space").hover(function(e)
                    {
                        var seconds = ms * 0.001;
                        
                        $(this).find('.button-pie').pietimer({
                            seconds: seconds,
                            color: '#7FC6A4'
                        });
                         $(this).children('.button-pie').addClass('button-pie-space');
                         $(this).find('.button-pie').pietimer('start');
                         
                         if(!timeoutId)
                         {
                            timeoutId=window.setTimeout(function()
                            {
                                simulateKeyboardClicksDwellBased(' ');
                                timeoutId=null;
                            }, ms);
                        }
                    },
                    function(e)
                    {
                        if(timeoutId)
                        {
                            window.clearTimeout(timeoutId);
                            timeoutId=null;
                            $('canvas').remove();
                        }
                    });

                    $(".button").hover(function(e)
                    {
                        e.currentTarget.style.color = "white";                        
                        closeLetter = calculcateClosestLetter(cursorX,cursorY);
                        console.log(closeLetter);
                        var seconds = ms * 0.001;
                        
                        $(this).find('.button-pie').pietimer({
                            seconds: seconds,
                            color: '#7FC6A4'
                        });                        
                        
                        if(e.target.className== 'button button-space')
                        {
                           $(this).children('.button-pie').addClass('button-pie-space');
                        }else if(e.target.className == 'button button-enter')
                        {
                            $(this).children('.button-pie').addClass('button-pie-enter');
                        }
                        
                        $(this).find('.button-pie').pietimer('start');
                        
                        
                        if(!timeoutId)
                        {
                            timeoutId=window.setTimeout(function()
                            {
                                timeoutId=null;
                                
                                //closeLetter = calculcateClosestLetter(cursorX,cursorY);
                                simulateKeyboardClicksDwellBased(closeLetter);
                                if(closeLetter!=null)
                                {
                                    if(ready)
                                    {
                                    	if(closeLetter == ' ' && prevSpace == false) //calculate potential words only once + save 'space' in gaze data history
                                        {
                                        	prevSpace = true;
                                        	myWorker.postMessage('Keyboard:' + layout + ';Insert ObservableStates:' + cursorX + ' ' + cursorY + ' ' + closeLetter + ';calculatePotential:' + currentString);
                                            currentString = '';

                                            myWorker.onmessage = function(e)
    			                            {
    			                            	var popUpValues = '';
    			                                var string = e.data;
    			                                console.log(string);
    			                                string = string.split("\r\n");
    			                                for(var i=1; i<string.length;i++)
    			                               	{
    			                               		sentenceArray[string[arrayCount]] += string[i] + ",";
    			                               		if(i+1==string.length)
    			                               		{
    			                               			popUpValues += "<span class='popUpWord' innertext=" + string[i] + ">" + string[i] + "</span>";
    			                               		}else
    			                               		{
    			                               			popUpValues += "<span class='popUpWord' innertext=" + string[i] + ">" + string[i] + "</span><br>";
    			                               		}
    			                               	}
    			                               	dwellFreeStringBuffer += '<div class="tooltip"><span class="primary">' + string[0] + " </span> &nbsp; <span class='tooltiptext'>" + popUpValues + '</span> </div>';
    			                               	arrayCount += 1;
    			                            }

                                        }else
                                        {
                                        	if(closeLetter == ' ')
                                        	{
                                        		myWorker.postMessage('Keyboard:' + layout + ';Insert ObservableStates:' + cursorX + ' ' + cursorY + ' ' + closeLetter);
                                        	}else
                                        	{
                                        		if(prevSpace == true)
                                        		{
                                        			prevSpace = false;
                                        		}
                                        	}
                                        	currentString += closeLetter;
                                        	myWorker.postMessage('Keyboard:' + layout + ';Insert ObservableStates:' + cursorX + ' ' + cursorY + ' ' + closeLetter);
                                        }
                                    }                          
                                }
                            }, ms);
                        }
                    },
                    function(e)
                    {
                        if(timeoutId)
                        {
                            window.clearTimeout(timeoutId);
                            timeoutId=null;
                            $('canvas').remove();
                        }
                    });
                }
                return deferred.promise();
            }

            function triggerCloseLetter(closeLetter)
            {
                if(ready)
                {
                    if(closeLetter=='?')
                    {
                        $('.button').css('color','white');
                        $('#button_Question').css('color', 'red');
                    }else if(closeLetter == '.')
                    {
                        $('.button').css('color','white');
                        $('#button_Fullstop').css('color', 'red');
                    }else if(closeLetter == '!')
                    {
                        $('.button').css('color','white');
                        $('#button_ExclamationMark').css('color', 'red');
                    }else if(closeLetter == '\'')
                    {
                        $('.button').css('color','white');
                        $('#button_Apostrophe').css('color', 'red');
                    }else
                    {
                        $('.button').css('color','white');
                        $('#button_' + closeLetter.toUpperCase()).css('color', 'red');
                    }
                }
            };

            var returnedFromWorker = true, sendToWorker='';
            function trackMouseDwellFree()
            {
                console.log('dwell free');
                var deferred = $.Deferred();
                var cursorX, cursorY, closeLetter;
                
                document.onmousemove = function(e){
                    cursorX = e.pageX;
                    cursorY = e.pageY;
                }
                
                if (window.Worker)
                {
                    var myWorker = new Worker("scripts/web-worker.js");
                    var request = window.indexedDB.deleteDatabase('dwellfree');
                    request.onsuccess = function(e)
                    {
                        console.log('successfully deleted db');
                    }
                    
                    setInterval(function() //calculate closest letter every 25ms - if not null & fixation, send it to worker to calculate potential words
                    {
                        //--check if saccade vs fixation--//
                        closeLetter = calculcateClosestLetter(cursorX,cursorY);                        

                        //--if fixation, store in db--//
                        if(closeLetter!=null)
                        {
                            triggerCloseLetter(closeLetter);

                            if(ready)
                            {
                            	console.log(closeLetter);
                            	if(closeLetter!=' ' && spaceFirstTime==true)
                            	{
                            		spaceFirstTime=false;
                            	}
                            	if(closeLetter == ' ' && prevSpace == false && currentString!='' && spaceFirstTime==false) //calculate potential words only once
                            	{
                            		prevSpace=true;
                                    if(returnedFromWorker==true)
                                    {
                                        returnedFromWorker = false;
                                        console.log('posting message ' +currentString);
                            		    myWorker.postMessage('Keyboard:' + layout + ';Insert ObservableStates:' + cursorX + ' ' + cursorY + ' ' + closeLetter + ';calculatePotential:' + currentString);
                                	    currentString = '';
                                    }else
                                    {
                                        sendToWorker+='Keyboard:' + layout + ';Insert ObservableStates:' + cursorX + ' ' + cursorY + ' ' + closeLetter + ';calculatePotential:' + currentString + ' - ';
                                        currentString = '';
                                    }
                                	myWorker.onmessage = function(e)
    	                            {
                                        console.log('returned message');
    	                            	var popUpValues = '';
    	                                var string = e.data;
    	                                console.log(string);
    	                                string = string.split("\r\n");
    	                                for(var i=1; i<string.length;i++)
    	                               	{
    	                               		sentenceArray[string[arrayCount]] += string[i] + ",";
    	                               		if(i+1==string.length)
    	                               		{
    	                               			popUpValues += "<span class='popUpWord' innertext=" + string[i] + ">" + string[i] + "</span>";
    	                               		}else
    	                               		{
    	                               			popUpValues += "<span class='popUpWord' innertext=" + string[i] + ">" + string[i] + "</span><br>";
    	                               		}
    	                               	}
    	                               	dwellFreeStringBuffer += '<div class="tooltip"><span class="primary">' + string[0] + " </span> &nbsp; <span class='tooltiptext'>" + popUpValues + '</span> </div>';
    	                               	arrayCount += 1;                         
                                        returnedFromWorker = true;
                                        if(sendToWorker!='')
                                        {
                                            console.log(sendToWorker);
                                            returnedFromWorker=false;
                                            var send=sendToWorker.split(' - ');
                                            console.log(send);
                                            sendToWorker = '';
                                            for(var i=1;i<=sendToWorker.split(' - ').length;i++)
                                            {
                                                if(send[i] != '') 
                                                {
                                                    sendToWorker+=send[i] +' - ';
                                                }
                                            }
                                            console.log('posting message' + send[0]);
                                            myWorker.postMessage(send[0]);                                  
                                        }
                                    }
                            	}else
                            	{
                            		if(closeLetter == ' ') //previous letter was already a space - save in gaze history only
                            		{
                            			myWorker.postMessage('Keyboard:' + layout + ';Insert ObservableStates:' + cursorX + ' ' + cursorY + ' ' + closeLetter);
                            		}else //save in gaze history + add to letter to current string
                            		{
                            			if(prevSpace==true)
                            			{
                            				prevSpace = false;
                            			}
                            			currentString += closeLetter;
                            			myWorker.postMessage('Keyboard:' + layout + ';Insert ObservableStates:' + cursorX + ' ' + cursorY + ' ' + closeLetter);
                            		}                        		                            	
                            	}
                            }                            
                        }
                    },60);
                }
                
                return deferred.promise();
            }
            
            var iLastTime = 0, iTime = 0, iTotal = 0, timeOnTask = 0;
            function updateTimeOnTask()
            {
            	iTime = new Date().getTime();
            	if (iLastTime != 0)
            	{
			        iTotal += iTime - iLastTime;
			    }
				timeOnTask = iTotal/1000;
			    iLastTime = iTime;
            }

            //--Start time on task--//
            $('#keyboard').mouseenter(function()
            {
            	updateTimeOnTask();
            });

            //update all keyboard characters to white
            $('#keyboard').mouseleave(function()
            {
                $('.button').css('color','white');
            });

            var currentFixation, currentFixationDistance, potentialFixation, savedPotentialFixation, distance, minDistance, dx, dy, closer, saccadeThreshold=40;
            function filterData(pointX, pointY)
            {
                if(currentFixation==null)
                {
                    currentFixation = pointX + ',' + pointY;
                    return;  //return currentFixation(?)
                }
                if(currentFixation!=null && potentialFixation!=null)
                {
                    //--START calculating distance of the point from each fixation--//
                    dx = currentFixation.split(',')[0] - pointX;
                    dy = currentFixation.split(',')[1] - pointY;
                    distance = Math.sqrt((dx*dx) + (dy*dy));
                    currentFixationDistance = distance;
                    minDistance = distance;
                    closer = "currentFixation";
                    dx = potentialFixation.split(',')[0] - pointX;
                    dy = potentialFixation.split(',')[1] - pointY; 
                    distance = Math.sqrt((dx*dx) + (dy*dy));
                    if(distance<minDistance)
                    {
                        minDistance = distance;
                        closer = "potentialFixation";
                    }
                    //--END calculating distance of the point from each fixation--//
                    
                    if(closer=="currentFixation")
                    {
                        if(distance<saccadeThreshold)
                        {
                            currentFixation = pointX + ',' + pointY;
                            potentialFixation = null;
                            return currentFixation;            
                        }else
                        {
                            potentialFixation=null;
                            potentialFixation = pointX + ',' + pointY;
                            return currentFixation;
                        }
                    }else
                    {
                        if(distance<saccadeThreshold)
                        {
                            potentialFixation = pointX + ',' + pointY;
                            currentFixation = potentialFixation;
                            potentialFixation=null;
                        }else
                        {
                            savedPotentialFixation = potentialFixation;
                            potentialFixation=null;
                            potentialFixation = pointX + ',' + pointY;
                            return savedPotentialFixation;
                        }
                    }
                }else
                {
                    if(currentFixationDistance > saccadeThreshold)
                    {
                        potentialFixation = pointX + ',' + pointY;
                        return currentFixation;
                    }else
                    {
                        currentFixation = pointX + ',' + pointY;
                        return currentFixation;
                    }
                }
            }

            //--START: Calculate Closest Letter Algorithm--//
            function calculcateClosestLetter(x,y)
            {
                var el = null, distance, dx, dy, minDistance, offsets;
                var topRightX, topRightY, topLeftX, topLeftY,bottomRightX, bottomRightY, bottomLeftX, bottomLeftY; //end points
                var midTopX, midTopY, midBottomX, midBottomY, midLeftX, midLeftY, midRightX, midRightY; //middle points
                var midTop1X, midTop1Y, midTop2X, midTop2Y, midRight1X, midRight1Y, midRight2X, midRight2Y, midBottom1X, midBottom1Y, midBottom2X, midBottom2Y, midLeft1X, midLeft1Y, midLeft2X, midLeft2Y;  //middle of mid-points
                
                topRightX = localStorage.getItem('#keyboard-top_right').split(',')[0];
                topRightY = localStorage.getItem('#keyboard-top_right').split(',')[1];
                topLeftX = localStorage.getItem('#keyboard-top_left').split(',')[0];
                topLeftY = localStorage.getItem('#keyboard-top_left').split(',')[1];
                bottomRightX = localStorage.getItem('#keyboard-bottom_right').split(',')[0];
                bottomRightY = localStorage.getItem('#keyboard-bottom_right').split(',')[1];
                bottomLeftX = localStorage.getItem('#keyboard-bottom_left').split(',')[0];
                bottomLeftY = localStorage.getItem('#keyboard-bottom_left').split(',')[1];

                var spacetopRightX, spacetopRightY, spacetopLeftX, spacetopLeftY, spacebottomRightX, spacebottomRightY, spacebottomLeftX, spacebottomLeftY;

                spacetopRightX = localStorage.getItem('#button_Space-top_right').split(',')[0];
                spacetopRightY = localStorage.getItem('#button_Space-top_right').split(',')[1];
                spacetopLeftX = localStorage.getItem('#button_Space-top_left').split(',')[0];
                spacetopLeftY = localStorage.getItem('#button_Space-top_left').split(',')[1];
                spacebottomRightX = localStorage.getItem('#button_Space-bottom_right').split(',')[0];
                spacebottomRightY = localStorage.getItem('#button_Space-bottom_right').split(',')[1];
                spacebottomLeftX = localStorage.getItem('#button_Space-bottom_left').split(',')[0];
                spacebottomLeftY = localStorage.getItem('#button_Space-bottom_left').split(',')[1];

                
                //Check if x and y coordinates are inside keyboard area
                if (!((x >= topLeftX) && (x <= topRightX) && (y >= topLeftY) && (y <= bottomLeftY)) && (!((x >= spacetopLeftX) && (x <= spacetopRightX) && (y >= spacetopLeftY) && (y <= spacebottomLeftY))))
                {
                    return null;
                }

                if((x >= spacetopLeftX) && (x <= spacetopRightX) && (y >= spacetopLeftY) && (y <= spacebottomLeftY))
                {
                    return ' ';
                }
                
                for(var i=0 ; i<keyboard.length;i++)
                {
                    if(keyboard[i].value!='')
                    {
                        var currentLetter = keyboard[i].characterValue;//$('#button_' + keyboard[i].value);//change to letter when tested
                        
                        //end points
                        topRightX = localStorage.getItem('#button_' + keyboard[i].value + '-top_right').split(',')[0];
                        topRightY = localStorage.getItem('#button_' + keyboard[i].value + '-top_right').split(',')[1];
                        topLeftX = localStorage.getItem('#button_' + keyboard[i].value + '-top_left').split(',')[0];
                        topLeftY = localStorage.getItem('#button_' + keyboard[i].value + '-top_left').split(',')[1];
                        bottomRightX = localStorage.getItem('#button_' + keyboard[i].value + '-bottom_right').split(',')[0];
                        bottomRightY = localStorage.getItem('#button_' + keyboard[i].value + '-bottom_right').split(',')[1];
                        bottomLeftX = localStorage.getItem('#button_' + keyboard[i].value + '-bottom_left').split(',')[0];
                        bottomLeftY = localStorage.getItem('#button_' + keyboard[i].value + '-bottom_left').split(',')[1];
                        
                        //cursor on button
                        if ((x >= topLeftX) && (x <= topRightX) && (y >= topLeftY) && (y <= bottomLeftY)) 
                        {
                            el = currentLetter;
                            return el;
                        }
                        
                        if(keyboard[i].rowspan>1 || keyboard[i].colspan>1)
                        {
                            //mid-points
                            midTopX = (parseInt(topLeftX) + parseInt(topRightX))/2;
                            midTopY = (parseInt(topLeftY) + parseInt(topRightY))/2;
                            midBottomX = (parseInt(bottomLeftX) + parseInt(bottomRightX))/2;
                            midBottomY = (parseInt(bottomLeftY) + parseInt(bottomRightY))/2;
                            midLeftX = (parseInt(topLeftX) + parseInt(bottomLeftX))/2;
                            midLeftY = (parseInt(topLeftY) + parseInt(bottomLeftY))/2;
                            midRightX = (parseInt(topRightX) + parseInt(bottomRightX))/2;
                            midRightY = (parseInt(topRightY) + parseInt(bottomRightY))/2;
                            
                            //middle of mid-points
                            midTop1X = (parseInt(topLeftX) + parseInt(midTopX))/2; 
                            midTop1Y = (parseInt(topLeftY) + parseInt(midTopY))/2;
                            midTop2X = (parseInt(midTopX) + parseInt(topRightX))/2;
                            midTop2Y = (parseInt(midTopY) + parseInt(topRightY))/2;
                            midRight1X = (parseInt(topRightX) + parseInt(midRightX))/2; 
                            midRight1Y = (parseInt(topRightY) + parseInt(midRightY))/2;
                            midRight2X = (parseInt(midRightX) + parseInt(bottomRightX))/2;
                            midRight2Y = (parseInt(midRightY) + parseInt(bottomRightY))/2;
                            midBottom1X = (parseInt(bottomLeftX) + parseInt(midBottomX))/2; 
                            midBottom1Y = (parseInt(bottomLeftY) + parseInt(midBottomY))/2;
                            midBottom2X = (parseInt(midBottomX) + parseInt(bottomRightX))/2;
                            midBottom2Y = (parseInt(midBottomY) + parseInt(bottomRightY))/2;
                            midLeft1X = (parseInt(topLeftX) + parseInt(midLeftX))/2; 
                            midLeft1Y = (parseInt(topLeftY) + parseInt(midLeftY))/2;
                            midLeft2X = (parseInt(midLeftX) + parseInt(bottomLeftX))/2;
                            midLeft2Y = (parseInt(midLeftY) + parseInt(bottomLeftY))/2;
                            
                            offsets = [[topLeftX, topLeftY], [midTop1X, midTop1Y], [midTopX,midTopY], [midTop2X, midTop2Y], [topRightX, topRightY] , [midRight1X, midRight1Y], [midRightX, midRightY] , [midRight2X, midRight2Y] ,[bottomRightX, bottomRightY], [midBottom2X, midBottom2Y] ,[midBottomX, midBottomY], [midBottom1X, midBottom1Y], [bottomLeftX, bottomLeftY], [midLeft2X, midLeft2Y], [midLeftX, midLeftY], [midLeft1X, midLeft1Y]];
                        } else
                        {
                            offsets = [[topLeftX, topLeftY], [topRightX, topRightY] , [bottomLeftX, bottomLeftY] , [bottomRightX, bottomRightY]];
                        }
                        for (var off in offsets) 
                        {
                            dx = offsets[off][0] - x;
                            dy = offsets[off][1] - y;
                            distance = Math.sqrt((dx*dx) + (dy*dy));
                            if (minDistance === undefined || ((distance < minDistance))) {
                                minDistance = distance;
                                el = currentLetter;
                            }
                        }
                    }
                }
                return el;
            }
            //--END: Calculate Closest Letter Algorithm--//
 
            function startTimer(duration, display) {
                var timer = duration, minutes, seconds;
                setInterval(function () {
                    seconds = parseInt(timer % 60, 10);
                    seconds = seconds < 10 ? "0" + seconds : seconds;

                    display.innerHTML = seconds;

                    if (--timer < 0) {
                        timer = duration;
                    }
                }, 1000);
            }

          var modal;
          if(ms==0) //dwell-free
          {
            loadKeys()
                .done(loadCoordinates())
                .done(trackMouseDwellFree())
                .then(
                    modal = document.getElementById('myModal'),
                    display = document.getElementById('countdown-sec'),
                    startTimer(10, display),
                    $("body").css('cursor', 'none'),
                    modal.style.display = "block",                                      
                    console.log(currentString),

                    setTimeout(function(){
                    $("body").css('cursor', 'auto');
                    dwellFreeStringBuffer="";
                    currentString="";
                    ready=true;
                    console.log('hello');                    
                    modal.style.display = "none";
                    console.log(currentString);
                },11400));
          }else //dwell-based
          {
            loadKeys()
                .done(loadCoordinates())
                .done(trackMouseDwellBased());
          }
        });
    }
}($));