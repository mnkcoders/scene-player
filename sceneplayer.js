/**
 * @param {type} id
 * @returns {ScenePlayer}
 */
function ScenePlayer( id ){
    /**
     * @type ScenePlayer
     */
    var _controller = this;
    
    var _MANAGER = {
        /**
         * @type String
         */
        'id': typeof id === 'string' ? id : 'sceneplayer',
        /**
         * @type Element|null
         */
        'container': null,
        /**
         * @type Element|Canvas
         */
        'canvas': null,
        /**
         */
        'display': null,
        /**
         * @type Sprite[]
         */
        'sprites': [],
        /**
         * @type Image[]
         */
        'images': [],
        /**
         * @type Audio[]
         */
        'media':[],
        /**
         * @type Number
         */
        'framerate': 30
    };
    /**
     * @type SceneDataBase
     */
    var _DB = new SceneDataBase();
    /**
     * @param {Audio|String} media
     * @returns {ScenePlayer}
     */
    this.addMedia = function( media ){
        
        switch (true) {
            case typeof(media) === 'undefined':
                console.log('undefined media source');
                break;
            case typeof(media) === 'string':
                _MANAGER.media.push( new Audio( 'media/' + media ) );
                break;
            case media instanceof 'Audio':
                _MANAGER.media.push(media);
                break;
        }
        
        return this;
    };
    /**
     * @param {String} source
     * @param {Number} width
     * @param {Number} height
     * @returns {ScenePlayer}
     */
    this.addImage = function( source ){

        if( typeof source === 'string' && source.length && !_MANAGER.images.hasOwnProperty(source)){
            
            var img = new Image( /* no params */ );

            img.onload = function(){
                _MANAGER.images[ source ] = this;
                console.log( '[' + source + '] loaded (' + this.width + 'x' + this.height + ')' );
            };

            img.onerror = function(){

                console.log( 'Error loading [' + source + ']' );
            };
            
            img.src = 'sprites/' + source;
        }

        return this;
    };
    /**
     * @param {Sprite} sprite
     * @returns {ScenePlayer}
     */
    this.addSprite = function( setup ){
        //console.log(setup);
        var sprite = new Sprite({
            'image': typeof setup.image === 'string' ? setup.image : false,
            'name': typeof setup.name === 'string' ? setup.name : 'New Sprite',
            'src': typeof setup.src === 'string' ? setup.src : '',
            'rows': typeof setup.rows === 'number' ? setup.rows : 1,
            'cols': typeof setup.cols === 'number' ? setup.cols : 1,
            'width': typeof setup.width === 'number' ? setup.width : 0,
            'height': typeof setup.height === 'number' ? setup.height : 0,
            'time': typeof setup.time === 'number' ? setup.time : 100,
            'frames': Array.isArray( setup.frames ) ? setup.frames : [ 0 ],
            'speed': setup.speed || 1.0
        });
        //console.log(sprite.validate());
        if( sprite.validate() ){
            //console.log(sprite.validate());
            _MANAGER.sprites.push(sprite);
        }
        
        return this;
    };
    /**
     * @returns {Audio[]}
     */
    this.sounds = function(){ return _MANAGER.media; };
    /**
     * @returns {Sprite[]}
     */
    this.sprites = function(){ return _MANAGER.sprites; };
    /**
     * @returns {Image[]}
     */
    this.images = function(){ return _MANAGER.images; };
    /**
     * @param {Number|String} media_id
     * @returns {ScenePlayer}
     */
    this.playSound = (media_id) => {

        if( typeof media_id ==='undefined' || media_id === 'random' ){
            media_id = Math.floor( Math.random() * _MANAGER.media.length );
        }

        if( typeof media_id === 'number' && _MANAGER.media.length > media_id ){

            var player = _MANAGER.media[media_id].play();
            
            //console.log(player);

            if( typeof player !== 'undefined' ){
                player.then( function(){
                    //started
                }).catch ( error => {
                    console.log( error );
                });
            }
        }
        return this;
    };
    /**
     * @param {Number|String} sprite_id
     * @param {Number} x
     * @param {Number} y
     * @returns {ScenePlayer}
     */
    this.testSprite = function( sprite_id , x , y , scale ){
        
       if( typeof sprite_id == 'number' ){
           if( sprite_id >= 0 && _MANAGER.sprites.length > sprite_id ){
               _MANAGER.sprites[ sprite_id ].move(x,y).scale( scale ).status( Sprite.Status.Active );
           }
       }
       else if( typeof sprite_id === 'string' ){
           _MANAGER.sprites.forEach( function(sprite){
               if( sprite.name() === sprite_id ){
                   sprite.move(x,y).scale( scale ).status( Sprite.Status.Active );
               }
           });
       }
        
       return this; 
    };
    /**
     * @returns {ScenePlayer}
     */
    this.update = function( elapsed ){
        
        _MANAGER.sprites.forEach( function( sprite ){

            if ( sprite.area().right() > _MANAGER.canvas.width || sprite.area().left() < 0 ){
                sprite.speed().X *= -1;
            }
            
            if ( sprite.area().bottom() > _MANAGER.canvas.height || sprite.area().top() < 0 ){
                sprite.speed().Y *= -1;
            }

            //logics here
            sprite.update( elapsed );
            
        });
        
        return this;
    };
    /**
     * @returns {ScenePlayer}
     */
    this.render = function(){
        
        //window.requestAnimationFrame( this.render );
        // Clear the canvas
        _MANAGER.display.clearRect(0,0,_MANAGER.canvas.width,_MANAGER.canvas.height);

        _MANAGER.sprites.forEach( function(sprite){
            if( _MANAGER.images[ sprite.image() ] instanceof Image ){
                //display
                _MANAGER.display.drawImage(
                    //bitmap de origen
                    _MANAGER.images[ sprite.image() ],
                    //SX - columna desde la imagen de origen
                    sprite.currentFrame.column() * sprite.tileWidth(),
                    //SY - fila desde la imagen de origen
                    sprite.currentFrame.row() * sprite.tileHeight(),
                    //SW,SH - dimension desde el area del bitmap de origen a recortar
                    sprite.tileWidth(), sprite.tileHeight(),
                    //DX,DY - posición de destino sobre el display
                    sprite.X(), sprite.Y(),
                    //DW,DH - dimension sobre el display
                    sprite.width(), sprite.height());
            }
        });
        
        return this;
    };
    /**
     * 
     * @returns {ScenePlayer}
     */
    this.resize = function(){

        _MANAGER.canvas.width = _MANAGER.container.offsetWidth;

        _MANAGER.canvas.height = _MANAGER.container.offsetHeight;
        
        return this;
    };
    /**
     * @returns {ScenePlayer}
     */
    this.load = function(){

        _MANAGER.sprites.forEach(function (spr) {
            //console.log(spr);
            //_MANAGER.container.appendChild(spr.image());
        });


        return this;
    };
    /**
     * @returns {Element}
     */
    this.getContainer = function(){ return document.getElementById(_MANAGER.id); };
    /**
     * @param {Vector|Area} element
     * @returns {Boolean}
     */
    this.inDisplay = function( element ){
        
        if( element instanceof Area ){
            
            return element.left() < _MANAGER.canvas.width
                && element.right() > 0
                && element.top() > 0
                && element.bottom() < _MANAGER.canvas.height;
        }
        
        if( element instanceof Vector ){
            
            return element.X >= 0 && element.X < _MANAGER.canvas.width
                    && element.Y >= 0 && element.Y < _MANAGER.canvas.height;
        }
        
        
        return false;
    };
    /**
     * @param {Event} e
     * @returns {Boolean}
     */
    this.parseClickEvent = function( e ){
        
        for( var s = _MANAGER.sprites.length - 1 ; s > -1 ; s-- ){
            
            if( _MANAGER.sprites[ s ].click( e.offsetX , e.offsetY ) ){
                
                _controller.playSound( );
                
                console.log(_MANAGER.sprites[ s ].name() + ' clicked!');
                
                //quit from click loop
                break;
            }
        }
        
        return true;
    };
    /**
     * @returns {ScenePlayer}
     */
    this.init = function(){
        
        document.addEventListener('DOMContentLoaded',function(e){
            
            _MANAGER.container = document.getElementById(_MANAGER.id);
            
            _MANAGER.canvas = document.createElement('canvas');
            
            _controller.resize();
            
            _MANAGER.canvas.addEventListener( 'click' , _controller.parseClickEvent );

            _MANAGER.display = _MANAGER.canvas.getContext('2d');

            _MANAGER.container.appendChild(_MANAGER.canvas);

            _controller.load().render();
            
            window.setInterval( function(){
                
                _controller.update().render();
                
            }, 150 );
        });
        
        return this;
    };
    
    return this.init();
}
/**
 * @returns {SceneDataBase}
 */
function SceneDataBase( path ){

    var _DB = {
        'images':[],
        'scenes':[]
    };
    /**
     * @returns {Array}
     */
    this.db = function(){ return _DB; };
    
    return this;
}

function Scene(){

    var _SCENE = {
        'name':'',
        'sprites':[],
        'events':[]
    };
    
    this.addScene = function(){
        
    };

    return this;
}

function EventPage(){
    
    
}

function Event(){
    
    
}
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
        'imageWidth': typeof setup.width === 'number' ? setup.width : 0,
        'imageHeight': typeof setup.height === 'number' ? setup.height : 0,
        'scale': 1.0,
        'name': typeof setup.name === 'string' ? setup.name : 'New Sprite',
        'speed': typeof setup.speed === 'number' ? new Vector( setup.speed ) : Vector.One(),
        //sprite runtime properties
        'ticks': typeof setup.time === 'number' ? setup.time : 100,
        //frame collection (columns and rows)
        'frames': Array.isArray( setup.frames ) ? setup.frames : [0],
        //frame index
        'frame_id': 0,
        'position': Vector.Zero,
        'status': Sprite.Status.Inactive
    };
    /**
     * @param {Number} x 
     * @returns {Number}
     */
    this.X = function( x ){
    
        if( typeof x === 'number'){

            _sprite.position.X = x;
        }
        
        return _sprite.position.X;
    };
    /**
     * @param {Number} y 
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
     * @returns {Vector}
     */
    this.speed = ( speed ) => {
        
        if( typeof speed === 'number' ){
            _sprite.speed = speed;
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
    this.width = function(){ return Math.floor( _sprite.imageWidth / _sprite.cols ) * _sprite.scale; };
    /**
     * @returns {Number}
     */
    this.height = function(){ return Math.floor( _sprite.imageHeight / _sprite.rows ) * _sprite.scale; };
    /**
     * @returns {Number} 
     */
    this.tileWidth = () => parseInt( _sprite.imageWidth / _sprite.cols );
    /**
     * @returns {Number} 
     */
    this.tileHeight = () => parseInt( _sprite.imageHeight / _sprite.rows );
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
            _sprite.position.X += _sprite.speed.X;
        }
        
        if( typeof y === 'number' ){
            _sprite.position.Y += _sprite.speed.Y;
        }
        
        return this;
    };
    /**
     * @returns {Vector}
     */
    this.position = function( x , y ){
        
        return _sprite.position;
    };
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
        
        _sprite.position.X++;
        _sprite.position.Y++;

        return this;
    };
    /**
     * @type Sprite.currentFrame
     */
    this.currentFrame = {
        'test': () => Math.floor( _sprite.frames[ _sprite.frame_id ] / _sprite.cols ),
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
    'Hidden': 1,
    'Active': 2,
    'Removed':3
};
/**
 * @param {Object} params
 * @returns {SoundBank}
 */
function SoundBank( params ){
    
    var _bank = {
        'name': typeof params.name === 'string' ? params.name : 'New SoundBank',
        'sounds': Array.isArray(params.sounds) ? params.sounds : [/*empty*/],
        'mode': typeof params.mode === 'number' ? params.mode : SoundBank.Modes.RANDOM,
        'repeat': typeof params.repeat === 'number' ? params.repeat : 0 //0 = loop infinite
    };
    
    this.play = function(){
        switch( _bank.mode){
            case SoundBank.Modes.RANDOM:
                break;
            case SoundBank.Modes.SEQUENTIAL:
                break;
            case SoundBank.Modes.REVERSE:
                break;
        }
    };
    
    
    return this;
}
SoundBank.Modes = {
    SEQUENTIAL: 0,
    RANDOM: 1,
    REVERSE: 2
};
