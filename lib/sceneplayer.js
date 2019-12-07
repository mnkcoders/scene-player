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
         * @type SoundBank[]
         */
        'soundBank':[],
        /**
         * @type Number
         */
        'framerate': 10,
        /**
         * @type Number
         */
        'status': ScenePlayer.Status.Loading,
        /**
         * @type Number
         */
        'gameLoop':0,
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

        if (_MANAGER.instances.length) {
            for (var s = _MANAGER.instances.length - 1; s >= 0; s--) {

                var sprite = _MANAGER.instances[ s ];

                if (sprite.status() !== Sprite.Status.Removed) {
                    if (sprite.area().left() < _controller.displayArea().left() || sprite.area().right() > _controller.displayArea().right()) {
                        sprite.speed().invertX();
                    }

                    if (sprite.area().top() < _controller.displayArea().top() || sprite.area().bottom() > _controller.displayArea().bottom()) {
                        sprite.speed().invertY();
                    }

                    //logics here
                    sprite.update(elapsed);
                } else {
                    //remove sprite instance here
                    _MANAGER.instances.splice(s, 1);
                }
            }
        } else {
            _MANAGER.status = ScenePlayer.Status.Completed;
            _controller.playSound(0);
            window.alert('GAME COMPLETED!!!');
        }
        
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

        //TAg as playing
        //_MANAGER.status = ScenePlayer.Status.Playing;
        _MANAGER.status++;
        
        _MANAGER.gameLoop = window.setInterval( function(){

            switch( true ){
                case _MANAGER.status > ScenePlayer.Status.Playing:
                    //other statuses
                    window.clearInterval( _MANAGER.gameLoop );
                    _MANAGER.gameLoop = 0;
                    break;
                case _MANAGER.status === ScenePlayer.Status.Playing:
                    //Main game loop
                    _controller.update().render();
                    break;
            }

        }, parseInt (1000 / _MANAGER.framerate) );

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
        
        return this.displayArea().intersect( element );
        
        return false;
    };
    /**
     * @returns {Area}
     */
    this.displayArea = () => {
        return new Area(0,0,_MANAGER.canvas.width , _MANAGER.canvas.height );
    };
    /**
     * @param {Event} e
     * @returns {Boolean}
     */
    this.parseClickEvent = function( e ){
        
        for( var s = _MANAGER.instances.length - 1 ; s > -1 ; s-- ){
            
            var sprite = _MANAGER.instances[ s ];
            
            if( sprite.click( e.offsetX , e.offsetY ) ){
                
                _controller.playSoundBank( 0 );
                
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
            
            _MANAGER.container = document.getElementById(_MANAGER.id);
            
            _MANAGER.canvas = document.createElement('canvas');
            
            _controller.resize();
            
            _MANAGER.canvas.addEventListener( 'click' , _controller.parseClickEvent );

            _MANAGER.display = _MANAGER.canvas.getContext('2d');

            _MANAGER.container.appendChild(_MANAGER.canvas);

            _controller.load().render();

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