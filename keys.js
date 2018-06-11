var app = angular.module("appX", ['ngSanitize']);
app.controller("appCtrl", function($scope, $sanitize, $http, $q) {
  
  $scope.parse = function() {
    switch(parseInt($scope.origem)) {
      case 1: 
        $scope.parseBundlestar();
        break;
      case 2: 
        $scope.parseGogobundle();
        break;
      case 3:
        $scope.parseRemoveKeys();
	      break;
      case 4:
        $scope.parseRemoveDescs();
	      break;
      case 5:
	      $scope.keysRepeats();
	      break; 
      case 6:
        $scope.descRepeats();
        break;
      case 7:
        $scope.addGamesDB();
        break;
      case 8:
        $scope.addGamesKeysDB();
        break;
      case 9:
        $scope.findGamesKeysDB();
        break;
      case 10:
        $scope.listRandomGamesKeysDB();
        break;
    }
  }

  $scope.keysRepeats = function() {
    var arrTemp = [];
    var arrResult = [];
    var arr =  $scope.keystext.split('\n');
    for (var i in arr) {
      var linha = arr[i];
      var desc = arr[i].substr(linha.search(/[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}/g)).trim();
      arrTemp.push(desc);
    }

    for (var i in arrTemp) {
      var item = $scope._getLinhaRepeat(i,arrTemp);
      if (item) {
	      arrResult.push(item);
      }
    }

   $scope.result = $sanitize(arrResult.join('\n'));
  }

  $scope.descRepeats = function() {
    var arrTemp = [];
    var arrResult = [];
    var arr =  $scope.keystext.split('\n');
    for (var i in arr) {
      var linha = arr[i];
      var desc = arr[i].substr(0, linha.search(/[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}/g)).trim();
      arrTemp.push(desc);
    }

    for (var i in arrTemp) {
      var item = $scope._getLinhaRepeat(i,arrTemp);
      if (item) {
	      arrResult.push(item);
      }
    }

   $scope.result = $sanitize(arrResult.join('\n'));
  }

  $scope._getLinhaRepeat = function(index,arr) {
    for (var i in arr) {
      if (i != index && arr[i] == arr[index]) {
	      return "linha:"+i+" item:" + arr[i] + "\n";
      }
    }
    return undefined;
  }

  $scope.parseRemoveKeys = function() {
    var arrResult = [];
    var arr =  $scope.keystext.split('\n');
    arr =  $scope._removeKeys(arr);
    for (var i in arr) {
      arrResult.push("- " + arr[i]);
    }
   $scope.result = $sanitize(arrResult.join('\n'));
  }

  $scope.parseRemoveDescs = function() {
    var arrResult = [];
    var arr =  $scope.keystext.split('\n');
    arr =  $scope._removeDesc(arr);
    for (var i in arr) {
      arrResult.push(arr[i]);
    }
   $scope.result = $sanitize(arrResult.join('\n'));
  }

  $scope._removeKeys = function(arr) {
    var arrResult = [];
    for (var i in arr) {
      var linha = arr[i];
      var desc = arr[i].substr(0,linha.search(/[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}/g)).trim();
      arrResult.push(desc);
    }
    return arrResult;
  }

  $scope._removeDesc = function(arr) {
    var arrResult = [];
    for (var i in arr) {
      var linha = arr[i];
      var desc = arr[i].substr(linha.search(/[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}/g)).trim();
      arrResult.push(desc);
    }
    return arrResult;
  }
  
  $scope.parseGogobundle = function() {
    var arr =  $scope.keystext.split('\n');
    var arrResult = [];
    var arrDesc = [];    
    var ret = [];

    for (var i in arr) {
      var linha = arr[i].substr(0,arr[i].search(/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/g)).trim();
      var desc = linha.substr(0,linha.search(/[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}/g)).trim();
      arrResult.push(linha);
    }

    var adicionados = []

    for (var i in arrResult) {
      if (adicionados.indexOf(arrResult[i]) == -1) {
        var desc = arrResult[i].substr(0,arrResult[i].search(/[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}/g)).trim();
        var repeats = $scope.getGogoRepetidos(arrResult,desc);
        for (var j in repeats) {
          if (!ret[j]) {
            ret[j] = [];
          }
	        ret[j].push(repeats[j]);
	        adicionados.push(repeats[j]);
        }
      }
    }	
    
    var strRes = '';
    for (var i=0;i<ret.length;i++) {
      strRes += ret[i].join('\n') + '\n\n';
    }

    console.log(ret);
    $scope.result = $sanitize(strRes);
  }

  $scope.getGogoRepetidos = function(arr, desc) {
    var arrRes = [];
    for (var i in arr) {
      var descArr = arr[i].substr(0,arr[i].search(/[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}/g)).trim();
      if (desc == descArr) {
  	arrRes.push(arr[i]);
      }
    }
   return arrRes;
  }


  $scope.parseBundlestar = function() {
    var arr =  $scope.keystext.split("Copy");
    var result = "";
    for (var i=0;i<arr.length;i++) {
       var res = arr[i].replace(/(\r\n|\n|\r)/gm, "");
       if (!$scope.withkeys) {
         res = "- " + res.replace(/[\w]{5}-[\w]{5}-[\w]{5}/g,"");
       }
       result += $scope.removeDuplicates(res) + "<br>";
    }
   	
    $scope.result = $sanitize(result);
  }

  $scope.removeDuplicates = function(str) {
    str = str.split(/\s+/g);
    var result = [];
    for(var i =0; i < str.length ; i++){
      if(result.indexOf(str[i]) == -1) {
 	result.push(str[i]);
      }
    }
    result=result.join(" ");
    return result;
  }

  $scope.copyAll = function () {
    if (!navigator.clipboard) {
      $scope.fallbackCopyTextToClipboard($scope.result);
      return;
    }

    navigator.clipboard.writeText($scope.result).then(function() {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

  $scope.fallbackCopyTextToClipboard = function (text) {

    let target = document.getElementById('result');
    let range; 
    let selection;
    
    if (document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(target);
      range.select();
    } else if (window.getSelection) {
      selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(target);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
  }


  $scope.addGamesDB = function() {
    let arr =  $scope.keystext.split('\n');
    let arrResult = [];
    let arrDesc = [];    
    let ret = [];

    for (let i in arr) {
      let linha = arr[i];
      let id = linha.substr(0,linha.search(/\s/g)).trim();
      let desc = linha.substr(linha.search(/[a-zA-Z]/g)).trim();
      arrResult.push({appId:id, description:desc});
    }

    this.insert(arrResult,'games');
  }

  $scope.insert = function(games, dbname) {
    var req = {
      method: 'POST',
      url: 'https://api.mlab.com/api/1/databases/randomkeysbox/collections/'+dbname+'?apiKey=tqiAxDRIsNok9xYG0ldq0B6RD1b9tUJw',
      headers: {
        'Content-Type': "application/json"
      },
      data: JSON.stringify(games)
     }

     $http(req).then((data)=> this.result = 'Insert Suceffull', (data)=> this.result = "error:" + data);
  }

  $scope.addGamesKeysDB = function() {
    let arr =  $scope.keystext.split('\n');
    let arrResult = [];

    for (let i in arr) {
      let linha = arr[i];
      let regex = linha.search(/[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}/g)
      let desc = linha.substr(0,regex).trim();
      let key = linha.substr(regex).trim();
      arrResult.push({
        appId:undefined, 
        description:desc, 
        key:key,
        priceRS:undefined,
        priceUS:undefined, 
        active:true});
    }

    this.insert(arrResult,'gameskeys');
  }

  $scope.findGamesKeysDB = function() {
    let arr =  $scope.keystext.split('\n');
    let promises = [];

    for (let i in arr) {
      let linha = arr[i].trim();
      promises.push($scope.getGameKeysDB({description:linha, active:true}));
    }

    $scope.executeFindKeysPromisse(promises);
  }

  $scope.executeFindKeysPromisse = function(promises) {
    $q.all(promises).then((values) => {
      let arrResult = values.map((item)=>{
        return item.data[0].description + '  ' + item.data[0].key;
      }); 
      
      this.result = '';
      for (let i in arrResult) {
        this.result += arrResult[i] + "\n";
      }
    });
  }

  $scope.listRandomGamesKeysDB = function() {
    let quantidade =  parseInt($scope.keystext.trim());
    let promises = [];
    
    $scope.listDistinctDB('randomkeysbox', 'gameskeys', 'description', {active:true})
      .then((res)=>{
        console.log(res);
        let arrResult = res.data.values;
        console.log(arrResult);

        arrResult = $scope.shuffle(arrResult);
        let max = (quantidade > arrResult.length)?arrResult.length:quantidade;

        for (let i = 0;i < max; i++) {
          let description = arrResult[i].trim();
          promises.push($scope.getGameKeysDB({description:description, active:true}));
        }

        $scope.executeFindKeysPromisse(promises);
      }
    );
  }


  $scope.getGameKeysDB = function(params, limit) {
    
    let strparams = JSON.stringify(params);
    let query = 'https://api.mlab.com/api/1/databases/randomkeysbox/collections/gameskeys?q='+strparams;
    if (limit && limit > 0) {
      query += 'l=' + limit;
    }
    
    query += '&apiKey=tqiAxDRIsNok9xYG0ldq0B6RD1b9tUJw';
    console.log(query);
    
    return $http({
      method: 'GET',
      url: query
    });
  }

  $scope.listDistinctDB = function(dbname, colldistinct, fieldDistinct, params) {
    
    let command = JSON.stringify( {"distinct": colldistinct,"key": fieldDistinct,"query": params} );

    let url = 'https://api.mlab.com/api/1/databases/'+dbname+'/runCommand?apiKey=tqiAxDRIsNok9xYG0ldq0B6RD1b9tUJw'
    console.log(url);
    console.log(command);

    var req = {
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': "application/json"
      },
      data: command
     }

     return $http(req);
  }

  $scope.shuffle = function(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

});
