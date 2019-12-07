/**
 * 
 * @param {Number} x
 * @param {Number} y
 * @returns {Vector}
 */
function Vector( x , y ){
    
    this.X = typeof x === 'number' ? x : 0;
    
    this.Y = typeof y === 'number' ? y : this.X;
    /**
     * @param {Number} x
     * @param {Number} y
     * @returns {Vector}
     */
    this.set = ( x , y ) => {
        this.X = x;
        this.Y = typeof y === 'number' ? y : this.X;
        return this;
    };
    /**
     * @param {Number} x
     * @param {Number} y
     * @returns {Vector}
     */
    this.add = ( x , y ) => {
        this.X += x;
        this.Y += typeof y === 'number' ? y : x;
        return this;
    };
    /**
     * @param {Number} x
     * @param {Number} y
     * @returns {Vector}
     */
    this.mult = ( x , y ) => {
        this.X *= x;
        this.Y *= typeof y === 'number' ? y : x;
        return this;
    };
    /**
     * @returns {Vector}
     */
    this.copy = () => new Vector( this.X , this.Y );
}
/**
 * 
 * @returns {Vector}
 */
Vector.Zero = (function(){ return new Vector(0,0); })();
/**
 * @type Vector
 */
Vector.One = (function(){ return new Vector(1,1); })();
/**
 * @type Vector
 */
Vector.Random = (function(){ return new Vector( ScenePlayer.Random(400) , ScenePlayer.Random(400) ); })();
//Object.freeze(Vector.Zero);
/**
 * 
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @returns {Area}
 */
function Area( x , y , width,  height ){
    
    this.X = x;
    this.Y = y;
    this.width = width;
    this.height = height;
    
    this.left = () => this.X;
    this.right = () => this.X + this.width;
    this.top = () => this.Y;
    this.bottom = () => this.Y + this.height;
    /**
     * 
     * @param {Vector|Area} element
     * @returns {Boolean}
     */
    this.intersect = ( element ) => {
        
        if( element instanceof Vector ){
            
            return ( element.X >= this.left() && element.X <= this.right() )
                && ( element.Y >= this.top() && element.Y <= this.bottom() );
        }
        
        return false;
    };
    
    return this;
}

