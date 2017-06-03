
class Util {

    public static getMidPointX(x:number, y:number, width:number, height:number, angle_degrees:number):number {

        var angle_rad = angle_degrees * Math.PI / 180;
        var cosa = Math.cos(angle_rad);
        var sina = Math.sin(angle_rad);
        var wp = width/2;
        var hp = height/2;
        return ( x + wp * cosa - hp * sina);
    }

    public static getMidPointY(x:number, y:number, width:number, height:number, angle_degrees:number):number {

        var angle_rad = angle_degrees * Math.PI / 180;
        var cosa = Math.cos(angle_rad);
        var sina = Math.sin(angle_rad);
        var wp = width/2;
        var hp = height/2;
        return ( y + wp * sina + hp * cosa );
    }
}