var app = angular.module("appX", ['ngSanitize']);
app.controller("appCtrl", function($scope, $sanitize) {
  $scope.parse = function() {
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

});
