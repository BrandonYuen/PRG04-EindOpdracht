
class Util {

    public static getCoords(elem:HTMLElement):Array<number> { // crossbrowser version
        var box = elem.getBoundingClientRect();

        var body = document.body;
        var docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top  = box.top +  scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        return [Math.round(left), Math.round(top) ];
    }

    //Adds div's in the corner of the html element for collision detection purposes
    public static addCollisionCorners(_div:HTMLElement){
        let leftTop = document.createElement("div");
        leftTop.classList.add("left-top")
        _div.appendChild(leftTop);
        
        let rightTop = document.createElement("div");
        rightTop.classList.add("right-top")
        _div.appendChild(rightTop);
        
        let leftBottom = document.createElement("div");
        leftBottom.classList.add("left-bottom")
        _div.appendChild(leftBottom);
        
        let rightBottom = document.createElement("div");
        rightBottom.classList.add("right-bottom")
        _div.appendChild(rightBottom);
    }

    //This function returns the coordinates of the middle of a bounding box of the input element
    //NOTE: Took me a whole day to get this working :/ #noregrets

    public static getMiddleOfRect(rect:ClientRect, angle:number):Array<number> {
        let middle = new Array<number>();

        //x0 and y0 is the centerpoint of the given rectengle object
        let x0 = rect.left+rect.width/2;
        let y0 = rect.top+rect.height/2;

        //Calculated all 4 corners of rotated element
        let newX1 = x0 + (rect.left-x0) * Math.cos(angle * Math.PI / 180) + (rect.top-y0) * Math.sin(angle * Math.PI / 180)
        let newY1 = y0 - (rect.left-x0) * Math.sin(angle * Math.PI / 180) + (rect.top-y0) * Math.cos(angle * Math.PI / 180)
        let newX2 = x0 + (rect.left+rect.width-x0) * Math.cos(angle * Math.PI / 180) + (rect.top+rect.height-y0) * Math.sin(angle * Math.PI / 180)
        let newY2 = y0 - (rect.left+rect.width-x0) * Math.sin(angle * Math.PI / 180) + (rect.top+rect.height-y0) * Math.cos(angle * Math.PI / 180)
        let newX3 = x0 + (rect.left-x0) * Math.cos(angle * Math.PI / 180) + (rect.top+rect.height-y0) * Math.sin(angle * Math.PI / 180)
        let newY3 = y0 - (rect.left-x0) * Math.sin(angle * Math.PI / 180) + (rect.top+rect.height-y0) * Math.cos(angle * Math.PI / 180)
        let newX4 = x0 + (rect.left+rect.width-x0) * Math.cos(angle * Math.PI / 180) + (rect.top-y0) * Math.sin(angle * Math.PI / 180)
        let newY4 = y0 - (rect.left+rect.width-x0) * Math.sin(angle * Math.PI / 180) + (rect.top-y0) * Math.cos(angle * Math.PI / 180)

        //Calculate the Smalles X, Y and Biggest X, Y
        let allX = new Array<number>();
        allX.push(Math.round(newX1));
        allX.push(Math.round(newX2));
        allX.push(Math.round(newX3));
        allX.push(Math.round(newX4));
        //console.log("allX = "+allX);

        let allY = new Array<number>();
        allY.push(Math.round(newY1));
        allY.push(Math.round(newY2));
        allY.push(Math.round(newY3));
        allY.push(Math.round(newY4));
        //console.log("allY = "+allY);

        let smallX = allX[0];
        for (let i=1; i<4; i++){
            if (allX[i] < smallX){
                smallX = allX[i];
            }
        }
        //console.log("smalles X: "+smallX);

        let smallY = allY[0];
        for (let i=1; i<4; i++){
            if (allY[i] < smallY){
                smallY = allY[i];
            }
        }
        //console.log("smalles Y: "+smallY);

        let bigX = allX[0];
        for (let i=1; i<4; i++){
            if (allX[i] > bigX){
                bigX = allX[i];
            }
        }
        //console.log("biggest X: "+bigX);

        let bigY = allY[0];
        for (let i=1; i<4; i++){
            if (allY[i] > bigY){
                bigY = allY[i];
            }
        }
        //console.log("biggest y: "+bigY);

        //We now have the bounding box rectangle, because we have the 4 coordinates (smallX,smallY,bigX,bigY)
        //Then we calculate the middle of this bounding box by adding half of the width and height
        let x = (smallX + ((bigX-smallX) / 2));
        let y = (smallY + ((bigY-smallY) / 2));
        console.log("middle: "+x+", "+y);
        console.log("-----------------------");
        console.log(" ");

        middle.push(x);
        middle.push(y);

        return middle;
    }


    //This function checks if 2 div elements intersect (collide) with eachother, even when rotated!
    //NOTE: ALSO took way too much time (but worth it)
    public static doPolygonsIntersect (_div1:HTMLElement, _div2:HTMLElement):boolean {

        type Coords = {
            x: number;
            y: number;
        };

        function isUndefined(a:number) {
            return a === undefined;
        }

        //Get all corner div's from element
        let children1 = _div1.getElementsByTagName('div');

        //Polygon A
        var a = new Array<Coords>();
        for (let i = 0; i < children1.length; i++) {
            a.push({x: Util.getCoords(children1[i])[0], y: Util.getCoords(children1[i])[1]});
        }

        //Get all corner div's from element
        let children2 = _div2.getElementsByTagName('div');

        //Polygon B
        var b = new Array<Coords>();
        for (let i = 0; i < children2.length; i++) {
            b.push({x: Util.getCoords(children2[i])[0], y: Util.getCoords(children2[i])[1]});
        }


        /** DO NOT EDIT BELOW THIS LINE
         * Helper function to determine whether there is an intersection between the two polygons described
         * by the lists of vertices. Uses the Separating Axis Theorem
         *
         * @param a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
         * @param b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
         * @return true if there is any intersection between the 2 polygons, false otherwise
         */
        var polygons = [a, b];
        var minA, maxA, projected, i, i1, j, minB, maxB;

        for (i = 0; i < polygons.length; i++) {

            // for each polygon, look at each edge of the polygon, and determine if it separates
            // the two shapes
            var polygon = polygons[i];
            for (i1 = 0; i1 < polygon.length; i1++) {

                // grab 2 vertices to create an edge
                var i2 = (i1 + 1) % polygon.length;
                var p1 = polygon[i1];
                var p2 = polygon[i2];

                // find the line perpendicular to this edge
                var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

                minA = maxA = undefined;
                // for each vertex in the first shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values
                for (j = 0; j < a.length; j++) {
                    projected = normal.x * a[j].x + normal.y * a[j].y;
                    if (isUndefined(minA) || projected < minA) {
                        minA = projected;
                    }
                    if (isUndefined(maxA) || projected > maxA) {
                        maxA = projected;
                    }
                }

                // for each vertex in the second shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values
                minB = maxB = undefined;
                for (j = 0; j < b.length; j++) {
                    projected = normal.x * b[j].x + normal.y * b[j].y;
                    if (isUndefined(minB) || projected < minB) {
                        minB = projected;
                    }
                    if (isUndefined(maxB) || projected > maxB) {
                        maxB = projected;
                    }
                }

                // if there is no overlap between the projects, the edge we are looking at separates the two
                // polygons, and we know there is no overlap
                if (maxA < minB || maxB < minA) {
                    return false;
                }
            }
        }
        return true;
    };
}