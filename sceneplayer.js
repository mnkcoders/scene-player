
/**
 * 
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
        'media':[]
    };
    /**
     * @type SceneLoader
     */
    var _loader = new SceneLoader();
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

        var sprite = new Sprite({
            'image_id': typeof setup.image_id === 'number' ? setup.image_id : false,
            'name': typeof setup.name === 'string' ? setup.name : 'New Sprite',
            'src': typeof setup.src === 'string' ? setup.src : '',
            'rows': typeof setup.rows === 'number' ? setup.rows : 0,
            'cols': typeof setup.cols === 'number' ? setup.cols : 0,
            'width': typeof setup.width === 'number' ? setup.width : 0,
            'height': typeof setup.height === 'number' ? setup.height : 0,
            'time': typeof setup.time === 'number' ? setup.time : 100
        });
        
        if( sprite.validate() ){
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
     * @param {Number} media_id
     * @returns {ScenePlayer}
     */
    this.playSound = media_id => {

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
    this.testSprite = function( sprite_id , x , y ){
        
        
        
       return this; 
    };
    /**
     * @param {Number} media_id
     * @returns {ScenePlayer}
     */
    this.testSound = function( media_id ){

        document.addEventListener('DOMContentLoaded',function(e){
            
            var btn = document.createElement('button');
            
            btn.innerHTML = 'Play Sound';
            
            btn.addEventListener('click',function(e){

                e.preventDefault();

                _controller.playSound( typeof media_id === 'number' ?
                        media_id :
                        Math.floor(Math.random() * _controller.sounds().length));
                
                return true;
            });
            document.body.appendChild(btn);

        });

        return this;
    };
    
    
    this.update = function(){
        
        
        return this;
    };
    
    this.render = function(){
            // Clear the canvas
            _MANAGER.display.clearRect(0,0,_MANAGER.display.width,_MANAGER.display.height);
        _MANAGER.sprites.forEach( function(sprite){
            
            if( sprite.validate() ){
                //display
                _MANAGER.display.drawImage(
                    //bitmap de origen
		    _MANAGER.images[ sprite.imageId() ],
                    //SX - columna desde la imagen de origen
                    sprite.currentFrame.tileX(),
		    //sprite.frameId() * sprite.width() / sprite.frameCount(),
                    //SY - fila desde la imagen de origen
                    sprite.currentFrame.tileY(),
		    //sprite.width() / sprite.frameCount(),
                    //SW,SH - dimension desde el area del bitmap de origen a recortar
                    sprite.width(), sprite.height(),
                    //DX,DY - posición de destino sobre el display
		    sprite.position().X, sprite.position().Y,
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
     * @returns {ScenePlayer}
     */
    this.init = function(){
        
        document.addEventListener('DOMContentLoaded',function(e){
            
            _MANAGER.container = document.getElementById(_MANAGER.id);
            
            _MANAGER.canvas = document.createElement('canvas');

            _controller.resize();

            _MANAGER.display = _MANAGER.canvas.getContext('2d');

            _MANAGER.container.appendChild(_MANAGER.canvas);


            //console.log(_MANAGER.sprites);
            _controller.load();
        });
        
        return this;
    };
    
    return this.init();
}
/**
 * @returns {SceneLoader}
 */
function SceneLoader(){
    /**
     * @type Array
     */
    var _collection = [
        //{'luna-char': {'src':'LunaChar48x96.png','cols':3,'rows':4}}
    ];
    /**
     * @param {String} path
     * @param {String} src
     * @param {Number} cols
     * @param {Number} rows
     * @returns {SceneLoader}
     */
    this.add = function( path, src, cols, rows, width, height){
        _collection.push({
            'name':path,
            'src':src,
            'cols':cols,
            'rows':rows,
            'width':width,
            'height':height
        });
        return this;
    };
    /**
     * @returns {Array}
     */
    this.dictionary = function(){ return _collection; };
    
    return this;
}

function Scene(){
    
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
    
    this.Y = typeof y === 'number' ? y : 0;
}
/**
 * 
 * @returns {Vector}
 */
Vector.Zero = (function(){ return new Vector(0,0); })();
Object.freeze(Vector.Zero);
/**
 * 
 * @param {type} setup
 * @returns {Sprite}
 */
function Sprite( setup ){
    
    var _sprite = {
        'image': typeof setup.image_id === 'number' ? setup.image_id : false,
        'src': typeof setup.src === 'string' ? setup.src : '',
        'rows': typeof setup.rows === 'number' ? setup.rows : 1,
        'cols': typeof setup.cols === 'number' ? setup.cols : 1,
        'width': typeof setup.width === 'number' ? setup.width : 0,
        'height': typeof setup.height === 'number' ? setup.height : 0,
        'name': typeof setup.name === 'string' ? setup.name : 'New Sprite',
        //sprite runtime properties
        'ticks': typeof setup.time === 'number' ? setup.time : 100,
        //frame collection (columns and rows)
        'frames': [],
        //frame index
        'frame_id': 0,
        'position': Vector.Zero,
    };
    /**
     * @returns {Boolean}
     */
    this.validate = function(){
        
        return _sprite.src.length && _sprite.name.length && _sprite.image !== false;
    };
    /**
     * @returns {Number}
     */
    this.width = function(){
        return _sprite.width;
    };
    /**
     * @returns {Number}
     */
    this.height = function(){
        return _sprite.height;
    };
    /**
     * @returns {Number}
     */
    this.cols = function(){ return _sprite.cols; };
    /**
     * @returns {Number}
     */
    this.rows = function(){ return _sprite.rows; };
    /**
     * @returns {Number}
     */
    this.index = function(){
        return 0;
    };
    /**
     * @returns {Number}
     */
    this.imageId = function(){ return _sprite.image; };
    /**
     * @returns {Number}
     */
    this.ticks = function(){ return _sprite.ticks; };
    /**
     * @returns {Number}
     */
    this.frameCount = function(){ return _sprite.frames.length; };
    /**
     * @returns {Vector}
     */
    this.position = function(){ return _sprite.position; };
    
    this.currentFrame = {
        'id': function(){ return _sprite.frame_id; },
        'tileX': function(){ return _sprite.frame_id * _sprite.width / _sprite.frames.length; },	    
        'tileY': function(){ return _sprite.width / _sprite.frames.length; }
    };
    
    return this;
}
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
