'use strict'

var app = angular.module('app', ['ngAnimate']);

app.controller('Controller', ['$scope', function($scope) {
	$scope.msg = 'hi';

	function Point(x, y){
		this.x = x;
		this.y = y;
	}

	function HalfEdge(Point a, Point b){
		this.a = a;
		this.b = b;
	}
}])