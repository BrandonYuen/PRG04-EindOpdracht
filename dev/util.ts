
class Util {

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
}