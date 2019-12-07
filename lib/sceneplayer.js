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
        'instances': [],
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
               _MANAGER.instances.push( _MANAGER.sprites[ sprite_id ].instance(scale,position,speed) );
           }
       }
       else if( typeof sprite_id === 'string' ){
           _MANAGER.sprites.forEach( function(sprite){
               if( sprite.name() === sprite_id ){
                   _MANAGER.instances.push( _MANAGER.sprites[ sprite_id ].instance(scale,position,speed) );
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
    this.instances = function(){ return _MANAGER.instances; };
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
     * @returns {ScenePlayer}
     */
    this.update = function( elapsed ){
        
        _MANAGER.instances.forEach( function( sprite ){

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

        _MANAGER.instances.forEach( function(sprite){

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



