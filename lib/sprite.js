
/**
 * 
 * @param {Object} setup
 * @returns {Sprite}
 */
function Sprite( setup ){

    var _sprite = {
        'image': typeof setup.image === 'string' ? setup.image : false,
        'rows': typeof setup.rows === 'number' ? setup.rows : 1,
        'cols': typeof setup.cols === 'number' ? setup.cols : 1,
        'width': typeof setup.width === 'number' ? setup.width : 0,
        'height': typeof setup.height === 'number' ? setup.height : 0,
        'name': typeof setup.name === 'string' ? setup.name : 'New Sprite',

        'speed': typeof setup.speed === 'number' ? new Vector( setup.speed ) : Vector.One,
        'position': Vector.Zero,
        'scale': 1.0,
        //sprite runtime properties
        'ticks': typeof setup.time === 'number' ? setup.time : 100,
        //frame collection (columns and rows)
        'frames': Array.isArray( setup.frames ) ? setup.frames : [0],
        //frame index
        'frame_id': 0,
        'status': Sprite.Status.Invalid
    };
    /**
     * @returns {Object}
     */
    this.export = () => {
        
        var sprite = Object.assign( _sprite );
        sprite.position = Vector.Zero;
        sprite.speed = Vector.Zero;
        sprite.scale = 1;
        sprite.frames = _sprite.frames.slice();
        return sprite;
    };
    /**
     * @param {Number} scale
     * @param {Number|Vector} position
     * @param {Number|Vector} scale
     * @returns {Sprite}
     */
    this.instance = function( scale , position , speed ){
        
        var spr = new Sprite( this.export( ) );
        
        spr.scale( scale );
        
        spr.moveTo( position ).speed( speed );
        
        spr.status( Sprite.Status.Active );
        
        return spr;
    };
    /**
     * @returns {Number}
     */
    this.X = function( ){
    
        return _sprite.position.X;
    };
    /**
     * @returns {Number}
     */
    this.Y = function( y ){
    
        if( typeof y === 'number'){

            _sprite.position.Y = y;
        }

        return _sprite.position.Y;
    };
    /**
     * @param {Number} scale
     * @returns {Sprite}
     */
    this.scale = ( scale ) =>{
        
        if( typeof scale === 'number' ){
            _sprite.scale = scale;
        }

        return this;
    };
    /**
     * @param {Number|Vector} speed 
     * @returns {Vector}
     */
    this.speed = ( speed ) => {

        switch( true ){
            case speed === 'random':
                _sprite.speed.set( Math.random() * 2 - 1, Math.random() * 2 - 1);
                break;
            case typeof speed === 'number':
                _sprite.speed.set(speed);
                break;
            case speed instanceof Vector:
                _sprite.speed.set(speed.X,speed.Y);
                break;
        }
        
        return _sprite.speed;
    };
    /**
     * @returns {Boolean}
     */
    this.validate = function(){

        if( _sprite.image !== false && _sprite.image.length && _sprite.frames.length > 0 ){
            
            if( _sprite.status === Sprite.Status.Invalid ){
                
                _sprite.status = Sprite.Status.Hidden;
            }
            
            return true;
        }
        
        return false;
    };
    /**
     * @returns {Boolean}
     */
    this.valid = function(){ return _sprite.status > Sprite.Status.Invalid; };
    /**
     * @param {Number} newStatus 
     * @returns {Number}
     */
    this.status = function( newStatus ){
        
        if( _sprite.status > Sprite.Status.Invalid ){
            if( typeof newStatus === 'number' && _sprite.status !== newStatus ){
                _sprite.status = newStatus;
            }
        }
        
        return _sprite.status;
    };
    /**
     * @returns {Number}
     */
    this.width = function(){ return Math.floor( _sprite.width / _sprite.cols ) * _sprite.scale; };
    /**
     * @returns {Number}
     */
    this.height = function(){ return Math.floor( _sprite.height / _sprite.rows ) * _sprite.scale; };
    /**
     * @returns {Number} 
     */
    this.tileWidth = () => parseInt( _sprite.width / _sprite.cols );
    /**
     * @returns {Number} 
     */
    this.tileHeight = () => parseInt( _sprite.height / _sprite.rows );
    /**
     * @returns {Number}
     */
    this.columns = () => _sprite.cols;
    /**
     * @returns {Number}
     */
    this.rows = () => _sprite.rows;
    /**
     * @returns {Number}
     */
    this.index = function(){ return 0; };
    /**
     * @returns {String}
     */
    this.name = function(){ return _sprite.name; };
    /**
     * @returns {Number}
     */
    this.image = function(){ return _sprite.image; };
    /**
     * @returns {Number}
     */
    this.ticks = function(){ return _sprite.ticks; };
    /**
     * @returns {Number}
     */
    this.frameCount = function(){ return _sprite.frames.length; };
    /**
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Sprite}
     */
    this.move = ( x , y ) => {

        if( typeof x === 'number' ){
            _sprite.position.X += x;
        }
        
        if( typeof y === 'number' ){
            _sprite.position.Y += y;
        }
        
        return this;
    };
    /**
     * @param {Number|Vector} x 
     * @param {Number} y 
     * @returns {Sprite}
     */
    this.moveTo = ( x , y ) => {

        switch( true ){
            case typeof x === 'number':
                _sprite.position.X = x;
                break;
            case typeof y === 'number':
                _sprite.position.Y = y;
                break;
            case x instanceof Vector:
                _sprite.position.set(x.X,x.Y);
                break;
        }
        
        return this;
    };
    /**
     * @returns {Vector}
     */
    this.position = function( ){ return _sprite.position; };
    /**
     * @returns {Area}
     */
    this.area = () => new Area( _sprite.position.X , _sprite.position.Y , this.width() , this.height() );
    /**
     * @param {Number} x
     * @param {Number} y
     * @returns {Boolean}
     */
    this.click = function( x ,y ){
        
        if( this.area().intersect(new Vector(x,y))){

            return true;
        }
        
        return false;
    };
    /**
     * @param {Number} elapsed
     * @returns {Sprite}
     */
    this.update = function( elapsed ){
        
        if( _sprite.frame_id < _sprite.frames.length - 1 ){
            _sprite.frame_id++;
        }
        else{
            _sprite.frame_id = 0;
        }
        
        this.move( _sprite.speed.X , _sprite.speed.Y );
        
        return this;
    };
    /**
     * @type Sprite.currentFrame
     */
    this.currentFrame = {
        'id': ()=> _sprite.frames[ _sprite.frame_id ],
        'column': () => parseInt( _sprite.frames[ _sprite.frame_id ] % _sprite.cols ),
        'row': () => parseInt( _sprite.frames[ _sprite.frame_id ] / _sprite.cols )
    };
    
    return this;
}
/**
 * @type Object
 */
Sprite.Status = {
    'Invalid': 0,
    'Template': 1,
    'Active': 2,
    'Removed':3
};


