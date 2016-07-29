
var app = angular.module('app', ['ngAnimate']);

app.controller('Controller', ['$scope', '$timeout', function($scope, $timeout) {

	var HalfEdge = function(vert, pair, face, next){
		this.vert = vert; // vertex at the end of the half-edge
		this.pair = pair; // oppositely oriented adjacent half-edge
		this.face = face; // face the half-edge borders
		this.next = next; // next half-edge around the face
		this.active = false;
	}
	HalfEdge.prototype.type = function(){ return 'HalfEdge';}
	$scope.listOfHalfEdges = [];

	var Vert = function(x, y, edge){
		this.x = x;
		this.y = y;
		this.edge = edge; // one of the half-edges emantating from the vertex
		this.active = false;
	}
	Vert.prototype.type = function(){ return 'Vert';}
	$scope.listOfVerts = [];

	var Face = function(triangle, v1, v2, v3, edge){
		this.triangle = triangle;
		this.v1 = v1;
		this.v2 = v2;
		this.v3 = v3;
		this.edge = edge; // one of the half-edges bordering the face
		this.active = false;
	}
	Face.prototype.type = function(){ return 'Face';}
	$scope.listOfFaces = [];

	var Point = function(x, y){
		this.x = x;
		this.y = y;
		this.active = false;
	}
	$scope.points = [];

	var Line = function(xa, ya, xb, yb){
		this.xa = xa;
		this.ya = ya;
		this.xb = xb;
		this.yb = yb;
		this.active = false;
	}
	$scope.lines = [];

	var Triangle = function(v1, v2, v3){
		this.v1 = v1;
		this.v2 = v2;
		this.v3 = v3;
		this.active = false; // boolean
	}
	Triangle.prototype.type = function(){ return 'Triangle';}
	Triangle.prototype.printPoints = function(){
		console.log(this.v1.x + " " +
					this.v1.y + " " +
					this.v2.x + " " +
					this.v2.y + " " +
					this.v3.x + " " +
					this.v3.y);
	}
	$scope.triangles = [];

	/*var getSampleData = function(){
		var v1 = new Point(700, 700);
		var v2 = new Point(650, 800);
		var v3 = new Point(750, 800);
		var v4 = new Point(900, 900);

		var tri = new Triangle(v1, v2, v3);
		var tri2 = new Triangle(v2, v3, v4);

		var ret = [];
		ret.push(tri);
		ret.push(tri2);
		return ret;
	}

	var data = getSampleData();

	for (var item of data){
		$scope.triangles.push(item);
	}*/

	$scope.info = '';
	$scope.click = function (arg){
		if (arg.type() === 'Face'){
			let face = arg;
			let t = face.triangle;
			disableAll();
			face.active = true;
			
			if (isInListOfHalfEdgesToDraw(face.edge)){
				face.edge.active = true;
				if (face.edge.pair != null){
					face.edge.pair.face.active = true;
				}
			} else {
				face.edge.pair.active = true;
				face.edge.pair.face.active = true;
			}

			if ((face.edge.next !== null) && isInListOfHalfEdgesToDraw(face.edge.next)){
				face.edge.next.active = true;
				if (face.edge.next.pair != null)
					face.edge.next.pair.face.active = true;
			} else {
				face.edge.next.pair.active = true;
				face.edge.next.pair.face.active = true;
			}

			if ((face.edge.next.next !== null) && isInListOfHalfEdgesToDraw(face.edge.next.next)){
				face.edge.next.next.active = true;
				if (face.edge.next.next.pair != null)
					face.edge.next.next.pair.face.active = true;
			} else {
				face.edge.next.next.pair.active = true;
				face.edge.next.next.pair.face.active = true;
			}

			face.v1.active = true;
			face.v2.active = true;
			face.v3.active = true;

			let infoText;

			$scope.infoOne = 'Face vertices = {(' + t.v1.x  + ', ' + t.v1.y + '), ' +
											   '(' + t.v2.x  + ', ' + t.v2.y + '), ' +
											   '(' + t.v3.x  + ', ' + t.v3.y + ')}';

			$scope.infoTwo = "Other faces:";
			if (face.edge.pair.face !== null){
				$scope.infoThree = "{("+ face.edge.pair.face.v1.x + ", "+ face.edge.pair.face.v1.y + 
					 "), "+ "(" + face.edge.pair.next.face.v1.x + ", " + face.edge.pair.next.face.v1.y +
					 "), "+ "(" + face.edge.pair.next.next.face.v1.x + ", " + face.edge.pair.next.next.face.v1.y + ")}";
			} else {
				$scope.infoThree = "";
			}
			if (face.edge.next.pair !== null){
				$scope.infoFour = "{("+ face.edge.next.pair.face.v1.x + ", "+ face.edge.next.pair.face.v1.y + 
					   "), "+ "(" + face.edge.next.pair.next.face.v1.x + ", " + face.edge.next.pair.next.face.v1.y +
					   "), "+ "(" + face.edge.next.pair.next.next.face.v1.x + ", " + face.edge.next.pair.next.next.face.v1.y + ")}";
			} else {
				$scope.infoFour = "";
			}
			if (face.edge.next.next.pair.face !== null){
				$scope.infoFive = "{("+ face.edge.next.next.pair.face.v1.x + ", "+ face.edge.next.next.pair.face.v1.y + 
					   "), "+ "(" + face.edge.next.next.pair.next.face.v1.x + ", " + face.edge.next.next.pair.next.face.v1.y +
					   "), "+ "(" + face.edge.next.next.pair.next.next.face.v1.x + ", " + face.edge.next.next.pair.next.next.face.v1.y + ")}";
			} else {
				$scope.infoFive = "";
			}
		}
		if (arg.type() === 'HalfEdge'){
			let he = arg;
			disableAll();
			he.active = true;
			he.face.active = true;

			let v1 = findVerticeInList(he.vert);
			v1.active = true;

			let v2 = findVerticeInList(he.next.vert);
			v2.active = true;

			if (he.pair !== null){
				he.pair.face.active = true;
			}

			$scope.infoOne = "Edge vertices: {(" + he.vert.x + ", " + he.vert.y +"), " +
							 "(" + he.next.vert.x + ", " + he.next.vert.y + ")}";
			$scope.infoTwo = "Adjacent faces:";
			$scope.infoThree = 'Face vertices = {(' + he.face.v1.x  + ', ' + he.face.v1.y + '), ' +
											   '(' + he.face.v2.x  + ', ' + he.face.v2.y + '), ' +
											   '(' + he.face.v3.x  + ', ' + he.face.v3.y + ')}';
			if (he.pair !== null){
				$scope.infoFour = 'Face vertices = {(' + he.pair.face.v1.x  + ', ' + he.pair.face.v1.y + '), ' +
											   '(' + he.pair.face.v2.x  + ', ' + he.pair.face.v2.y + '), ' +
											   '(' + he.pair.face.v3.x  + ', ' + he.pair.face.v3.y + ')}';
			} else {
				$scope.infoFour = "";
			}
			$scope.infoFive = "";
		}
		if (arg.type() === 'Vert'){
			let v = arg;
			disableAll();
			v.active = true;

			let listOfFacesIndices = findFacesWithVertice(v);
			for(i of listOfFacesIndices){
				$scope.listOfFaces[i].active = true;
			}

			let listOfEdgesIndices = findEdgesWithVertice(v);
			for(i of listOfEdgesIndices){
				$scope.listOfHalfEdgesToDraw[i].active = true;
			}

			$scope.infoOne = "Vertice: (" + v.x + ", " + v.y + ")";
			$scope.infoTwo = "Number of adjacent edges: " + listOfEdgesIndices.length;
			$scope.infoThree = "Number of adjacent faces: " + listOfFacesIndices.length;
			$scope.infoFour = "";
			$scope.infoFive = "";

		}
	}

	var disableAll = function(){
		for (i in $scope.listOfFaces){
			$scope.listOfFaces[i].active = false;
		}
		for (i in $scope.listOfHalfEdgesToDraw){
			$scope.listOfHalfEdgesToDraw[i].active = false;
		}
		for (i in $scope.listOfVerts){
			$scope.listOfVerts[i].active = false;
		}
	}

	var findVerticeInList = function(v){
		for (i in $scope.listOfVerts){
			let vTemp = $scope.listOfVerts[i];
			if (v.x === vTemp.x && v.y === vTemp.y)
				return $scope.listOfVerts[i];
		}
		return null;
	}

	var findEdgesWithVertice = function(v){
		var listOfIndices = [];
		for (i in $scope.listOfHalfEdgesToDraw){
			let he = $scope.listOfHalfEdgesToDraw[i];
			if ((he.vert.x === v.x && he.vert.y === v.y) ||
				(he.next.vert.x === v.x && he.next.vert.y === v.y)){
				listOfIndices.push(i);
			}
		}
		return listOfIndices;
	}

	var findFacesWithVertice = function(v){
		var listOfIndices = [];
		for (i in $scope.listOfFaces){
			let face = $scope.listOfFaces[i];
			if ((face.v1.x === v.x && face.v1.y === v.y) ||
				(face.v2.x === v.x && face.v2.y === v.y) ||
				(face.v3.x === v.x && face.v3.y === v.y)) {
				listOfIndices.push(i);
			}
		}
		return listOfIndices;
	}

	/* FIRST IMPLEMENTATION TO LOAD SIMPLE POINTS
	$scope.loadData = function($fileContent){
        var lines = $fileContent.split( "\n" );
        $scope.inputPoints = [];
        for (line of lines){
        	let l = line.trim();
        	let itens = l.replace(/\r/, "").split(" ");
        	for (i=0; i<itens.length-1; i=i+2){
        		$scope.inputPoints.push({x: itens[i], y:itens[i+1]});
        	}
        }
        console.log('inputPoints: ', $scope.inputPoints);

        createPointsFromInputFile($scope.inputPoints);
        createTriangleFromInputFile($scope.inputPoints);
    }*/

    /* SECOND IMPLEMENTATION TO LOAD TRIANGLE POINTS IN A SINGLE LINE */
/*    $scope.loadData = function($fileContent){
        var lines = $fileContent.split( "\n" );
        for (line of lines){
        	let l = line.trim();
        	let points = l.replace(/\r/, "").split(" ");
        	let p0 = new Point(points[0], points[1]);
        	let p1 = new Point(points[2], points[3]);
        	let p2 = new Point(points[4], points[5]);
        	$scope.triangles.push(new Triangle(p0, p1, p2));
        	$scope.points.push(p0);
        	$scope.points.push(p1);
        	$scope.points.push(p2);
        }
    }*/

    /*THIRD IMPLEMENTATION TO CREATE HALF-EDGES STRUCTURE*/
    $scope.loadData = function($fileContent){
        var lines = $fileContent.split( "\n" );
        let count = 0;
        for (line of lines){
        	let l = line.trim();
        	let points = l.replace(/\r/, "").split(" ");

        	let p0 = new Point(points[0], points[1]);
        	let p1 = new Point(points[2], points[3]);
        	let p2 = new Point(points[4], points[5]);
        	let triangle = new Triangle(p0, p1, p2);

        	let v0 = new Vert(p0.x, p0.y, null);
        	let v1 = new Vert(p1.x, p1.y, null);
        	let v2 = new Vert(p2.x, p2.y, null);

        	let face = new Face(triangle, null, null, null, null);

        	let he0 = new HalfEdge(v1, null, face, null);
        	let he1 = new HalfEdge(v2, null, face, null);
        	let he2 = new HalfEdge(v0, null, face, null);

        	he0.next = he1;
        	he1.next = he2;
        	he2.next = he0;

        	v0.edge = he1;
        	v1.edge = he2;
        	v2.edge = he0;

        	face.edge = he0;

        	findHalfEdgePair(he0);
        	findHalfEdgePair(he1);
        	findHalfEdgePair(he2);

        	$scope.listOfHalfEdges.push(he0);
        	$scope.listOfHalfEdges.push(he1);
        	$scope.listOfHalfEdges.push(he2);
        	count += 3;

        	face.v1 = pushVertice(v0);
        	face.v2 = pushVertice(v1);
        	face.v3 = pushVertice(v2);

        	$scope.listOfFaces.push(face);
        }
        console.log('count: ' + count);
        buildListOfHalfEdgesToDraw();
        logLists();
    }

    var findHalfEdgePair = function(he){
    	for (i in $scope.listOfHalfEdges){
    		if (halfEdgesArePair(he, $scope.listOfHalfEdges[i])){
    			he.pair = $scope.listOfHalfEdges[i];
    			$scope.listOfHalfEdges[i].pair = he;
    			return;
    		}
    	}
    }

    var areVerticesTheSame = function(v0, v1){
    	if ((v0.x === v1.x) && (v0.y === v1.y))
    		return true;
    	return false;
    }

    var halfEdgesArePair = function(he0, he1){
    	let count = 0;
    	if (areVerticesTheSame(he0.vert, he1.vert))
    		count++;
    	if (areVerticesTheSame(he0.vert, he1.next.vert))
    		count++;
    	if (areVerticesTheSame(he0.next.vert, he1.vert))
    		count++;
    	if (areVerticesTheSame(he0.next.vert, he1.next.vert))
    		count++;
    	if (count === 2)
    		return true;
    	return false;
    }

    var pushVertice = function(v){
    	for (item of $scope.listOfVerts){
    		if (areVerticesTheSame(v, item)){
    			return item;
    		}
    	}
    	$scope.listOfVerts.push(v);
    	return v;
    }

    
    var buildListOfHalfEdgesToDraw = function(){
    	$scope.listOfHalfEdgesToDraw = [];
    	$scope.listOfHalfEdgesToDraw.push($scope.listOfHalfEdges[0]);
    	for (i in $scope.listOfHalfEdges){
    		let okToInsert = true;
    		for (he of $scope.listOfHalfEdgesToDraw){
    			if ($scope.listOfHalfEdges[i] === he){
    				okToInsert = false;
    				break;
    			}
    			if ($scope.listOfHalfEdges[i].pair === he){
    				okToInsert = false;
    				break;
    			}
    		}
    		if (okToInsert){
    			$scope.listOfHalfEdgesToDraw.push($scope.listOfHalfEdges[i]);
    		}
    	}
    	console.log('he to draw: ', $scope.listOfHalfEdgesToDraw);
    }

    var isInListOfHalfEdgesToDraw = function(halfEdge){
    	for (he of $scope.listOfHalfEdgesToDraw){
    		if (halfEdge === he)
    			return true;
    	}
    	return false;
    }

    var logLists = function(){
    	console.log('verts: ', $scope.listOfVerts);
    	console.log('faces: ', $scope.listOfFaces);
    	console.log('half edges: ', $scope.listOfHalfEdges);
    }


    var createPointsFromInputFile = function(points){
		for (p of points){
			$scope.points.push(new Point(p.x, p.y));
		}
    }

    var createTriangleFromInputFile = function(points){
    	let aux;
    	let p0 = new Point(points[0].x, points[0].y);
    	let p1 = new Point(points[1].x, points[1].y);
    	for(let i=2; i<points.length; i++){
    		aux = new Point(points[i].x, points[i].y);
    		$scope.triangles.push(new Triangle(p0, p1, aux));
    		p0 = p1;
    		p1 = aux;
    	}
    }

    $scope.pointClicked = false;
    $scope.clickOnScreen = function(event){
    	$timeout(function () {
    		if(!$scope.pointClicked){
    			$scope.points.push(new Point(event.offsetX, event.offsetY));
    			console.log("" + event.offsetX + " " + event.offsetY);
    		}
    		$scope.pointClicked = false;
	    }, 600);
    }

    $scope.clickOnPoint = function(point){
    	//console.log(event);
    	$scope.pointClicked = true;
    	$scope.points.push(new Point(point.x, point.y));
    	console.log("" + point.x + " " + point.y);
    }

    $scope.printTriangles = function(){
    	for (triangle of $scope.triangles){
    		triangle.printPoints();
    	}
    }


}])

app.directive('onReadFile', function ($parse) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
            
			element.on('change', function(onChangeEvent) {
				var reader = new FileReader();
                
				reader.onload = function(onLoadEvent) {
					scope.$apply(function() {
						fn(scope, {$fileContent:onLoadEvent.target.result});
					});
				};

				reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
			});
		}
	};
});