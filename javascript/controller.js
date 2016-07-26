
var app = angular.module('app', ['ngAnimate']);

app.controller('Controller', ['$scope', function($scope) {

	var Point = function(x, y){
		this.x = x;
		this.y = y;
	}

	var Triangle = function(v1, v2, v3, verde){
		this.v1 = v1;
		this.v2 = v2;
		this.v3 = v3;
		this.verde; // boolean
	}

	var getSampleData = function(){
		var v1 = new Point(700, 700);
		var v2 = new Point(650, 800);
		var v3 = new Point(750, 800);
		var v4 = new Point(900, 900);

		var tri = new Triangle(v1, v2, v3, false);
		var tri2 = new Triangle(v2, v3, v4, false);

		var ret = [];
		ret.push(tri);
		ret.push(tri2);
		return ret;
	}

	$scope.triangles = [];
	var data = getSampleData();

	for (var item of data){
		$scope.triangles.push(item);
	}

	$scope.info = '';
	$scope.click = function (t){
		disableAll();
		t.verde = !t.verde;
		$scope.info = 'Triangle vertices = {(' + t.v1.x  + ', ' + t.v1.y + ') ' +
										   '(' + t.v2.x  + ', ' + t.v2.y + ') ' +
										   '(' + t.v3.x  + ', ' + t.v3.y + ')}';
	}

	var disableAll = function(){
		for(i in $scope.triangles){
			$scope.triangles[i].verde = false;
		}
	}


}])