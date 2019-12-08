/**
 * @param {type} id
 * @returns {ScenePlayer}
 */
function ScenePlayer( id ){
    /**
     * @type type
     */
    var _MANAGER = {

        'instance': this,
        /**
         * @type String
         */
        'id': typeof id === 'string' ? id : 'sceneplayer',
        /**
         * @type ScenePlayer.Renderer
         */
        'Renderer': null,
        /**
         * @type Image[]
         */
        'images': [],
        /**
         * @type Sprite[]
         */
        'sprites': [ /*sprite definition*/ ],
        /**
         * @type Sprite[]
         */
        'entities': [],
        /**
         * @type Audio[]
         */
        'media':[],
        /**
         * @type SoundBank[]
         */
        'soundBank':[],
        /**
         * @type Number
         */
        'status': ScenePlayer.Status.Loading,
        /**
         * @type Number
         */
        'gameLoop':0,
        /**
         * @type SceneDataBase
         */
        'DB': new SceneDataBase()
    };
   
    /***************************************************************************
     * ScenePlayer Renderer
     * 
     * @param {Element} container 
     * @returns {ScenePlayer.Renderer}
     **************************************************************************/
    function Renderer( container ){
        
        var _renderer = {
            /**
             * @type Canvas
             */
            'canvas': null,
            /**
             * @type CanvasRenderingContext2D
             */
            'display': null,
            /**
             * @type String|Color
             */
            //'color': '#ffffff'
            'color': '#78c8ff',
            /**
             * @type Number Frames per second
             */
            'FPS': 5,
            /**
             * @type Number Render loop timeout
             */
            'renderLoop': 0
        };
        /**
         * @param {Number} fps
         * @returns {Number}
         */
        this.FPS = ( fps ) => {
            
            if( typeof fps === 'number' ){

                _renderer.FPS = fps;

            }
            
            return _renderer.FPS;
        };
        /**
         * @returns {Element}
         */
        this.window = () => _renderer.canvas;
        /**
         * @returns {Area}
         */
        this.boundingBox = () => new Area( 0 , 0 , this.width() , this.height() );
        /**
         * @returns {ScenePlayer.Renderer} 
         */
        this.resize = ( w , h ) =>{
            _renderer.canvas.width = w;
            _renderer.canvas.height = h;
            console.log( 'Viewport set to ' + _renderer.canvas.width + 'x' + _renderer.canvas.height );
            return this;
        };
        /**
         * @returns {Number}
         */
        this.frameRate = () => parseInt( 1000 / _renderer.FPS );
        /**
         * @param {Function} closure
         * @returns {ScenePlayer.Renderer}
         */
        this.renderStart = ( closure ) => {
            
            if( typeof closure === 'function' ){

                _renderer.renderLoop = window.setInterval( closure ,this.frameRate());
                console.log('Render started at ' + this.frameRate() + ' FPS');
            }

            return this;
        };
        /**
         * @returns {ScenePlayer.Renderer}
         */
        this.renderStop = () => {
            if( _renderer.renderLoop ){
                window.clearInterval( _renderer.renderLoop );
                _renderer.renderLoop = 0;
            }
            return this;
        };
        /**
         * @param {Area} source 
         * @param {Area} destination 
         * @returns {ScenePlayer.Renderer}
         */
        this.draw = ( image, source , destination ) => {

            //effects here?
            
            _renderer.display.drawImage(
                    //bitmap de origen
                    image,
                    //SX,SY - get image source from position (x,y)
                    source.left(), source.top(),
                    //SW,SH - get image source rectangle (width,height)
                    source.width, source.height,
                    //DX,DY - set image clip destination position (x,y)
                    destination.left(),destination.top(),
                    //DW,DH - set image clip destination size (width, height)
                    destination.width, destination.height );
                    
            //end effects here?
            
            return this;
        };
        /**
         * @param {String|Color} color 
         * @returns {ScenePlayer.Renderer} 
         */
        this.clear = ( color ) =>{
            //window.requestAnimationFrame( this.render );
            // Clear the canvas
            if( _renderer.display !== null ){
                _renderer.display.clearRect(0,0,this.width(),this.height());
                _renderer.display.beginPath();
                _renderer.display.rect(0, 0, this.width(), this.height());
                //_renderer.display.fillStyle = 'rgba(120,200,255,1)';
                _renderer.display.fillStyle = color || _renderer.color;
                //console.log(_renderer.display.fillStyle);
                _renderer.display.fill();
            }

            return this;
        };
        /**
         * @returns {Number} 
         */
        this.width = () => _renderer.canvas.width;
        /**
         * @returns {Number} 
         */
        this.height = () => _renderer.canvas.height;
        /**
         * @returns {ScenePlayer.Renderer} 
         */
        this.setup = ( container ) =>{
            
            if( _renderer.display === null ){

                _renderer.canvas = document.createElement('canvas');
                
                _renderer.display = _renderer.canvas.getContext('2d');
                
                container.appendChild(_renderer.canvas);
                
                return this.resize( container.offsetWidth,container.offsetHeight);
            }
            
            return this;
        };
        
        return container instanceof Element ? this.setup( container ) : null;
    };
    
    /***************************************************************************
     * 
     * ScenePlayer Methods
     * 
     **************************************************************************/
    /**
     * @returns {SceneDataBase}
     */
    this.DB = () => _MANAGER.DB;
    
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
     * @param {String} name
     * @param {Array} list
     * @param {Number} mode
     * @param {Number} repeat
     * @returns {ScenePlayer}
     */
    this.addSoundBank = function( name , list , type , repeat ){
        
        _MANAGER.soundBank.push( new SoundBank( {'name':name,'sounds':list,'mode':type,'repeat':repeat} ) );
        
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
    this.createSprite = function( setup ){
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
        });
        //console.log(sprite.validate());
        if( sprite.validate() ){
            //console.log(sprite.validate());
            _MANAGER.sprites.push(sprite);
        }
        
        return this;
    };
    /**
     * @param {Number|String} sprite_id
     * @param {Number} x
     * @param {Number} y
     * @param {Number} scale
     * @param {Number|Vector} speed
     * @returns {ScenePlayer}
     */
    this.addSprite = function( sprite_id , position , scale , speed ){
        
       if( typeof sprite_id == 'number' ){
           if( sprite_id >= 0 && _MANAGER.sprites.length > sprite_id ){
               _MANAGER.entities.push( _MANAGER.sprites[ sprite_id ].instance(scale,position,speed) );
           }
       }
       else if( typeof sprite_id === 'string' ){
           _MANAGER.sprites.forEach( function(sprite){
               if( sprite.name() === sprite_id ){
                   _MANAGER.entities.push( _MANAGER.sprites[ sprite_id ].instance(scale,position,speed) );
               }
           });
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
     * @returns {Sprite[]}
     */
    this.entities = function(){ return _MANAGER.entities; };
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
     * @param {String|Number} id
     * @returns {ScenePlayer}
     */
    this.playSoundBank = ( id ) => {
        
        if( typeof id === 'number' ){
            if( _MANAGER.soundBank.length > id && id >= 0 ){
                return this.playSound( _MANAGER.soundBank[ id ].next() );
            }
        }
        else if( typeof id === 'string' ){
            for( var s in _MANAGER.soundBank ){
                if( _MANAGER.soundBank.hasOwnProperty( s ) ){
                    return this.playSound( _MANAGER.soundBank[ s ].next() );
                }
            }
        }
        
        return this;
    };
    /**
     * @returns {ScenePlayer}
     */
    this.update = function (elapsed) {

        if (_MANAGER.entities.length) {
            for (var s = _MANAGER.entities.length - 1; s >= 0; s--) {

                var sprite = _MANAGER.entities[ s ];

                if (sprite.status() !== Sprite.Status.Removed) {
                    if (sprite.area().left() < _MANAGER.instance.displayArea().left() || sprite.area().right() > _MANAGER.instance.displayArea().right()) {
                        sprite.speed().invertX();
                    }

                    if (sprite.area().top() < _MANAGER.instance.displayArea().top() || sprite.area().bottom() > _MANAGER.instance.displayArea().bottom()) {
                        sprite.speed().invertY();
                    }

                    //logics here
                    sprite.update(elapsed);
                } else {
                    //remove sprite instance here
                    _MANAGER.entities.splice(s, 1);
                }
            }
        } else {
            _MANAGER.status = ScenePlayer.Status.Completed;
            _MANAGER.instance.playSound(0);
            window.alert('GAME COMPLETED!!!');
        }
        
        return this;
    };
    /**
     * @returns {ScenePlayer}
     */
    this.render = function(){

        _MANAGER.Renderer.clear();
        
        _MANAGER.entities.forEach( function(sprite){
            if( _MANAGER.images[ sprite.image() ] instanceof Image ){
                //display
                _MANAGER.Renderer.draw(
                    //source image
                    _MANAGER.images[ sprite.image() ],
                    //source image
                    sprite.currentFrame.drawable(),
                    //destination area
                    sprite.area());
            }
        });
        
        return this;
    };
    /**
     * @returns {ScenePlayer}
     */
    this.load = function(){

        _MANAGER.sprites.forEach(function (spr) {
            //import all sprites
        });

        //TAg as playing
        //_MANAGER.status = ScenePlayer.Status.Playing;
        _MANAGER.status++;
        
        //_MANAGER.Renderer.renderStart( _MANAGER.instance.render );
        
        _MANAGER.gameLoop = window.setInterval( function(){

            switch( true ){
                case _MANAGER.status > ScenePlayer.Status.Playing:
                    //other statuses
                    window.clearInterval( _MANAGER.gameLoop );
                    _MANAGER.gameLoop = 0;
                    _MANAGER.Renderer.renderStop();
                    _MANAGER.Renderer.clear('#ffffff');
                    break;
                case _MANAGER.status === ScenePlayer.Status.Playing:
                    //Main game loop
                    _MANAGER.instance.update().render();
                    break;
            }

        }, _MANAGER.Renderer.frameRate() );

        return this;
    };
    this.unload = () =>{
        if( _MANAGER.gameLoop ){
            window.clearInterval( _MANAGER.gameLoop );
            _MANAGER.gameLoop = 0;
        }
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
        
        return _MANAGER.display.window().intersect( element );
        
        //return this.displayArea().intersect( element );
        
        return false;
    };
    /**
     * @returns {Area}
     */
    this.displayArea = () => _MANAGER.Renderer.boundingBox();
    /**
     * @returns {ScenePlayer.Renderer}
     */
    this.Renderer = () => _MANAGER.display;
    /**
     * @param {Event} e
     * @returns {Boolean}
     */
    this.parseClickEvent = function( e ){
        
        for( var s = _MANAGER.entities.length - 1 ; s > -1 ; s-- ){
            
            var sprite = _MANAGER.entities[ s ];
            
            if( sprite.click( e.offsetX , e.offsetY ) ){
                
                _MANAGER.instance.playSoundBank( 0 );
                
                console.log(sprite.name() + ' clicked!');
                
                sprite.status( Sprite.Status.Removed );
                
                //console.log( sprite.status());  
                
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
            
            _MANAGER.Renderer = new Renderer( _MANAGER.instance.getContainer() );
                
            //_renderer.canvas.addEventListener( 'click' , _MANAGER.instance.parseClickEvent );

            _MANAGER.Renderer.window().addEventListener( 'click' , _MANAGER.instance.parseClickEvent );
            

            _MANAGER.instance.load();

        });
        
        return this;
    };
    
    return this.init();
}

/**
 * 
 * @param {Number} from
 * @param {Number} to
 * @returns {Number}
 */
ScenePlayer.Random = ( min , max ) => {
   
    switch( true ){
        case typeof max === 'number' && typeof min === 'number':
            return Math.floor(Math.random() * (max - min + 1)) + min;
        case typeof min === 'number':
            return Math.floor(Math.random() * min );
    }
    
    return Math.floor(Math.random() * 100);
}; 
/**
 * @type type ScenePlayer.Status
 */
ScenePlayer.Status = {
    'Loading': 0,
    'Playing': 1,
    'GameOver': 2,
    'Completed': 3
};