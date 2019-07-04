/*global indexedDB IDBKeyRange $ jQuery*/

importScripts('jquery.nodom.js');

var db, coordinateX, coordinateY, l, count=0, request, prevLetter, observableState, timeSeries, cursor, stringTimeSeriesTableData="", interval;

var currentString='', keyboard, layout,potentialWords='';

//--Start: dwell-free technique--//
//--Trie Node--//
    class TrieNode
    {
        constructor(time)
        {
            if(time==="1")
                return;
            switch(arguments.length)
            {
                case 0 : this.constructorNoParam();
                         break;
                case 1 : this.constructorOneParam(arguments[0]);
                         break;
            }
        }

        constructorOneParam(c)
        {
            this.children = new TrieNode("1");
            this.c = c;
            this.isLeaf;
        }
        
        constructorNoParam()
        {
            this.children = new TrieNode("1");
            this.c;
            this.isLeaf;
        }
    }
    
    //--Trie--//
    class Trie
    {
        constructor()
        {
            this.count=1;
            this.root = new TrieNode();
        }
        
        insert(word)
        {
            var children = this.root.children;
            
            for(var i=0; i<word.length; i++)
            {
                var c = word.charAt(i).toLowerCase();
    
                var t;
                if(children[c]){
                    t = children[c];
                }else{
                    t = new TrieNode(c);
                    children[c]=t;//.children
                }
    
                children = t.children;
                
                //set leaf node
                if(i==(word.length-1))
                    t.isLeaf = true; 
            }
        }
        
        traverseLeaf(node, string, number)
        {   
            var children = node.children;
            
            string += node.c;
                
            number++;
            for (var child in children) 
            {             
                this.traverseLeaf(children[child], string,number);            
            }
        }
        
        traverseTree(node)
        {
            var children = node.children;
            
            if(children.length > 1)
                this.count+=(children.length-1);
            
            for(var value in children)
            {
                this.traverseTree(value);
            }
        }
        
        startsWith(prefix)
        {
            if(this.searchNode(prefix)==null)
                return false;
            else
                return true;
        }
        
        searchNode(str)
        {
            var children = this.root.children;
            var t = null;
            for(var i=0;i<str.length;i++)
            {
                var c = str.charAt(i);
                if(children[c])
                {
                    t=children[c];
                    children=t.children;
                }else
                {
                    return null;
                }
            }
            return t;
        }
        
        search(word)
        {
            var t = this.searchNode(word);
            
            if(t != null && t.isLeaf)
                return true;
            else
                return false;
        }
    }
    
    //--Tree Matching--//
    
    class TreeMatching
    {
        constructor() 
        {}
         
        createTree()
        {
            var deferred = $.Deferred();
            var self=this;
            var list_Dictionary;
            this.loadWordList = $.get("../assets/wordFrequencyDolchWords.txt", function(data)
            {
                list_Dictionary = data.split("\n");
                
                for(var i=0;i<list_Dictionary.length;i++)
                {
                    var string = list_Dictionary[i];
                    TreeMatching.tree.insert(string);
                    deferred.resolve();
                }
            });
            console.log("Tree created!")
            return deferred.promise();
        }
        
        getCandidateWords(seq)
        {
            this.createLetterList(seq);
            var matching = new TreeMatching();
            
            var bestPath = new Array(TreeMatching.listSeq.length+1);
            for (var i = 0; i < bestPath.length; i++) {
                bestPath[i] = "";
            }
            
            var scoreArray = [];
            for(var i=0;i<TreeMatching.listSeq.length+1;i++)
            {
                scoreArray[i] = "0";
            }
            
            matching.traverseLeaf(TreeMatching.tree.root, "", 0, scoreArray, bestPath);
            
            var numberSort = function(a,b)
            {
                return b-a;
            }

            //--Sorting potential words--//
            TreeMatching.mapScore.sort(function(a,b){return b.score-a.score;}); //sorting in descending order of score
            //console.log(TreeMatching.mapScore); /*remove*/

            var list_candidateWords = "";
            
            for(var listCount = 0; listCount < 6; listCount++)
            { 
              list_candidateWords += TreeMatching.mapScore[listCount].word + "\r\n";
            }
            
            return list_candidateWords;
        }
        
        createLetterList(seq)
        {
            TreeMatching.totalFrequency = seq.length;        
            TreeMatching.listSeq= [];
            TreeMatching.listFreq= [];
            
            var seqs = seq.toLowerCase().split("");
            var currentLetter = seqs[0];
            var count = 1;
            
            for(var i = 1; i < seqs.length; i++){
                
                var Nextletter = seqs[i];
                
                if(currentLetter == Nextletter){            
                    count++;
                }
                else{
                    if(count > TreeMatching.thresholdPoints)
                    {
                        TreeMatching.listSeq.push(currentLetter);
                        TreeMatching.listFreq.push(count);              
                    }
                    currentLetter = Nextletter; 
                    count = 1;
                }
                
                if(i == seqs.length - 1){
                    if(count > TreeMatching.thresholdPoints)
                    {
                        TreeMatching.listSeq.push(currentLetter);
                        TreeMatching.listFreq.push(count);
                                
                    }
                }
            }
        }
        
        traverseLeaf(node,string,number,scoreArray,bestPath)
        {
            var children = node.children;
            var flag = true;
            var isNeighbour = false, neighbours = [];
            if(number>0)
            {
                var letter = node.c+"";
                
                string += letter;
                if(number>1)
                if(letter == (string.substring(number-2, number-1)))
                {
                    flag = false;
                }
                if(flag == true)
                    for(var j = 0; j < TreeMatching.listSeq.length; j++)
                    {
                        var tempFreq = 0.0;
                        
                        if(letter.toLowerCase()==(TreeMatching.listSeq[j].toLowerCase())){
                            tempFreq = TreeMatching.listFreq[j];            
                        }
                        else
                        {
                            neighbours = getNeighbourLetters(letter.toUpperCase());
                            for(var k=0;k<neighbours.length;k++)
                            {
                                if(TreeMatching.listSeq[j].toLowerCase() == neighbours[k].toLowerCase())
                                {
                                    isNeighbour = true;
                                }
                            }
                            if(isNeighbour)
                                tempFreq = TreeMatching.listFreq[j]*TreeMatching.neighborWeight;
                        }
                        
                        if(parseInt(scoreArray[j] + tempFreq,10) > parseInt(scoreArray[j+1],10))
                        {
                            scoreArray[j+1] = parseInt(scoreArray[j] + tempFreq);
                            bestPath[j+1] = bestPath[j]+number+",";
                        }
                        else{
                                        
                            scoreArray[j+1] = scoreArray[j+1];
                            bestPath[j+1] = bestPath[j+1];
                        }                        
                    }
            }   
    
            if(flag == true)
                number++;
            
            if(node.isLeaf)
            {   
                var path = bestPath[TreeMatching.listSeq.length];
                var num = path.split(",");
                
                var temp = num[0];
                var size = 1;
            
                for(var i = 1; i < num.length; i++){
                    if(!(temp == (num[i]))){
                        temp = num[i];                  
                        size++;
                    }
                }
                
                var wordScore = size/number;
                var matrixScore = scoreArray[TreeMatching.listSeq.length]/TreeMatching.totalFrequency;
                TreeMatching.mapScore.push({'word': string, 'score' : (wordScore+matrixScore)*100});/*modified*/ //TreeMatching.mapScore[string] = (wordScore+matrixScore)*100;
            }   
            
            for (var child in children) 
            {     
                this.traverseLeaf(children[child], string,number, jQuery.extend(true, {}, scoreArray), jQuery.extend(true, {}, bestPath)); 
            }
        }
    }
    TreeMatching.thresholdPoints = 0;
    TreeMatching.neighborWeight = 0.4;
    TreeMatching.totalFrequency = 0.0;
    TreeMatching.listSeq = [];
    TreeMatching.listFreq = [];
    TreeMatching.mapScore = [];// /*modified*/ /TreeMatching.mapScore = new Object();
    TreeMatching.tree = new Trie();

//--End of dwell-free technique--//

//--Start: creating tree once--//
var tree = new TreeMatching();
tree.createTree();
//--End: creating tree once--//

var req = indexedDB.open('dwellfree');

req.onupgradeneeded = function (e) {
    db = e.target.result;
    
    if(!db.objectStoreNames.contains("GazeDataHistory")) {
        db.createObjectStore("GazeDataHistory", {autoIncrement: true});
    }
    console.log('successfully upgraded db');              
};

req.onsuccess = function (e) {
    db=e.target.result;
    console.log('successfully opened db');
};

req.onerror = function(e) {
    console.log('error opening db');    
}

function addRecordToHistory(cursor)
{
    if(db!=undefined)
    {
        var request = db.transaction(["GazeDataHistory"],"readwrite").objectStore("GazeDataHistory").add(cursor);
    
        request.onerror = function(event)
        {
            console.log("Unable to add record to history table");
        }
        
        request.onsuccess = function(event)
        {
            console.log("Record added to history table");
        }
    }
}

//--START: Return neighbour letters algorithm--//
function getNeighbourLetters(l)
{
    var neighbourLetters=[''], count=0, row, column,colspan, rowspan,tillRow, tillColumn;
    
    //Getting character
    for(var i=0; i<keyboard.length; i++)
    {
        if(keyboard[i].value == l)
        {
            row=parseInt(keyboard[i].row);
            column=parseInt(keyboard[i].column);
            rowspan = parseInt(keyboard[i].rowspan);
            colspan = parseInt(keyboard[i].colspan);
            break;
        }
    }
   
   //--Character has rowspan and colspan greater than 1, find all neighbours--//
   if(rowspan > 1 || colspan > 1)
   {
        tillRow = row + rowspan -1;
        tillColumn = column + colspan -1;
     
        for(var r=row; r<=tillRow; r++)
        {
            for(var c = column; c<=tillColumn; c++)
            {
                for(var i=0; i<keyboard.length; i++)
                {
                    if((keyboard[i].row==r && keyboard[i].column==tillColumn+1) || (keyboard[i].row==r && keyboard[i].column==column-keyboard[i].colspan) || (keyboard[i].row==row-keyboard[i].rowspan && keyboard[i].column==c) || (keyboard[i].row==tillRow+1 && keyboard[i].column==c))
                    {
                         if($.inArray((keyboard[i].value),neighbourLetters) == -1)
                         {
                             neighbourLetters[count] = keyboard[i].value;
                             count++;
                         }
                    }
                    
                    if((r+1)>tillRow)
                    {
                        if((keyboard[i].row==tillRow+1 && keyboard[i].column==c))
                        { 
                            if($.inArray((keyboard[i].value),neighbourLetters) == -1)
                            {
                                neighbourLetters[count] = keyboard[i].value;
                                count++;
                            }
                        }
                    }
                    
                    if((c+1)>tillColumn)
                    {
                        if((keyboard[i].row==r && keyboard[i].column==tillColumn+1))
                        {
                            if($.inArray((keyboard[i].value),neighbourLetters) == -1)
                            {
                                neighbourLetters[count] = keyboard[i].value;
                                count++;
                            }
                        }
                    }
                }
            }
        }
    }
    else //--Character has rowspan and colspan equal to 1, find all neighbours--//
    {
        for(var i=0; i<keyboard.length; i++)
        {
            //--Character is a neighbour to 'l'--//
            if((keyboard[i].row==row-1 && keyboard[i].column==column) || (keyboard[i].row==row && keyboard[i].column==column+1) || (keyboard[i].row==row && keyboard[i].column==column-1) || (keyboard[i].row==row+1 && keyboard[i].column==column))
            {
                if($.inArray((keyboard[i].value),neighbourLetters) == -1)
                {
                    neighbourLetters[count] = keyboard[i].value;
                    count++;
                }
            }else if(keyboard[i].colspan>1 || keyboard[i].rowspan>1)//--Character is not an immediate neighbour to 'l', but check whether with rowspan and colspan it becomes a neighbour--//
            {
                var tillColumn2, tillRow2;
                tillRow2 = parseInt(keyboard[i].row) + parseInt(keyboard[i].rowspan) -1;
                tillColumn2 = parseInt(keyboard[i].column) + parseInt(keyboard[i].colspan) -1;
                for(var r=keyboard[i].row; r<=tillRow2; r++)
                {
                    for(var c = keyboard[i].column; c<=tillColumn2; c++)
                    {
                        for(var k=0; k<keyboard.length; k++)
                        {
                            if((keyboard[k].row==r && keyboard[k].column==tillColumn2+1) || (keyboard[k].row==r && keyboard[k].column==c-1) || (keyboard[k].row==r-1 && keyboard[k].column==c) || (keyboard[k].row==tillRow2+1 && keyboard[k].column==c))
                            {
                                if(keyboard[k].value==l)
                                {
                                    if($.inArray((keyboard[i].value),neighbourLetters) == -1)
                                     {
                                         neighbourLetters[count] = keyboard[i].value;
                                         count++;
                                     }
                                }
                            }
                            
                            if((r+1)>tillRow2)
                            {
                                if((keyboard[k].row==tillRow2+1 && keyboard[k].column==c))
                                { 
                                    if((keyboard[k].row==row-1 && keyboard[k].column==column) || (keyboard[k].row==row && keyboard[k].column==column+1) || (keyboard[k].row==row && keyboard[k].column==column-1) || (keyboard[k].row==row+1 && keyboard[k].column==column))
                                    {
                                        if(keyboard[k].value==l)
                                        {
                                            if($.inArray((keyboard[i].value),neighbourLetters) == -1)
                                             {
                                                 neighbourLetters[count] = keyboard[i].value;
                                                 count++;
                                             }
                                        }
                                    }
                                }
                            }
                            
                            if((c+1)>tillColumn2)
                            {
                                if((keyboard[k].row==r && keyboard[k].column==tillColumn2+1))
                                {
                                    if(keyboard[k].value == l)
                                    {
                                        if($.inArray((keyboard[i].value),neighbourLetters) == -1)
                                         {
                                             neighbourLetters[count] = keyboard[i].value;
                                             count++;
                                         }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return neighbourLetters;
}
//--END: Return neighbour letters algorithm--//

var loadedKeyboard;
onmessage = function(e)
{
    potentialWords='';
    var data;
    var message = e.data;
    var semicolon = message.split(";");
    for (var i=0; i<semicolon.length;i++)
    {
        var colon= semicolon[i].split(":");
        for(var j=0; j<colon.length; j++)
        {
            if(colon[j] == "Keyboard")
            {
                layout = colon[j+1];
                
                loadedKeyboard = $.getJSON('../assets/keyboard-layouts.json', function(results)
                {
                    keyboard = results[layout];
                });
            }
            
            if(colon[j] == "calculatePotential")
            {
                currentString = colon[j+1];
                loadedKeyboard.done(function()
                {                    
                    //tree.createTree().done(function()
                    {
                        potentialWords = tree.getCandidateWords(currentString); //"caaaaaafarrrrrr"
                        TreeMatching.mapScore = [];
                        postMessage(potentialWords);
                    }//);
                });
            }

            if(colon[j] == "Insert ObservableStates")
            {
                data = colon[j+1].split(" ");
                coordinateX = data[0];
                coordinateY = data[1];
                l=data[2];
                observableState = {
                    x:coordinateX, y: coordinateY, l:l
                };
                addRecordToHistory(observableState);
            }
        }
    }
};