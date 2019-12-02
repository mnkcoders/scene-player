
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
         * @type Audio[]
         */
        'media':[]
    };
    /**
     * @type SceneDirector
     */
    var _director = new SceneDirector();
    /**
     * @returns {SceneDirector}
     */
    this.director = function(){ return _director; };
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
    }
    /**
     * @param {Sprite} sprite
     * @returns {ScenePlayer}
     */
    this.addSprite = function( sprite ){

        if( sprite instanceof Sprite ){
        
            _MANAGER.sprites.push(sprite);
        }

        return this;
    };
    /**
     * @returns {Audio[]}
     */
    this.soundCollection = function(){ return _MANAGER.media; };
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
                        Math.floor(Math.random() * _controller.soundCollection().length));
                
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
        
        _MANAGER.sprites.forEach( function(sprite){
            
            _MANAGER.display.drawImage(
                    sprite.image()
                    );
                
            
        });
        
        return this;
    };
    
    /**
     * @returns {ScenePlayer}
     */
    this.load = function(){

        _MANAGER.sprites.forEach(function (spr) {
            //console.log(spr);
            _MANAGER.container.appendChild(spr.image());
        });
        
        _MANAGER.canvas = document.createElement('canvas');
        
        _MANAGER.canvas.width = _MANAGER.container.width;

        _MANAGER.canvas.height = _MANAGER.container.height;
        
        _MANAGER.canvas.image = new Image();
        
        _MANAGER.display = _MANAGER.canvas.getContext('2d');
        

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
            
            _director.dictionary().forEach( function(spr){
                _MANAGER.sprites.push( new Sprite( spr ) );
            });

            //console.log(_MANAGER.sprites);
            
            _controller.load();
        });
        
        return this;
    };
    
    return this.init();
}
/**
 * @returns {SceneDirector}
 */
function SceneDirector(){
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
     * @returns {SceneDirector}
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
 * @param {type} setup
 * @returns {Sprite}
 */
function Sprite( setup ){
    
    var _sprite = {
        'src': typeof setup.src === 'string' ? setup.src : '',
        'rows': typeof setup.rows === 'number' ? setup.rows : 0,
        'cols': typeof setup.cols === 'number' ? setup.cols : 0,
        'width': typeof setup.width === 'number' ? setup.width : 0,
        'height': typeof setup.height === 'number' ? setup.height : 0,
        'name': typeof setup.name === 'string' ? setup.name : 'New Sprite',
        'time': typeof setup.time === 'number' ? setup.time : 100,
        /**
         * @type Image
         */
        'image': null
    };
    /**
     * @returns {Image}
     */
    this.init = function(){
        
        _sprite.image = new Image( _sprite.width , _sprite.height );
        
        _sprite.image.src = 'sprites/' + _sprite.src;
        
        return this;
    };
    /**
     * @returns {Number}
     */
    this.width = function(){
        return 0;
    };
    /**
     * @returns {Number}
     */
    this.height = function(){
        return 0;
    };
    /**
     * @returns {Number}
     */
    this.index = function(){
        return 0;
    };
    /**
     * @returns {Image}
     */
    this.image = function(){
        return _sprite.image;
    };
    
    return this.init();
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
