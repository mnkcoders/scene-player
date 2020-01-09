/**
 * @param {Object} setup 
 * @returns {Scene}
 */
function Scene( setup ){

    var _SCENE = {
        /**
         * @type String
         */
        'name': '',
        /**
         * @type Image[]
         */
        'layers': [],
        /**
         * @type Sprite[]
         */
        'instances':[],
        /**
         * @type EventPage[]
         */
        'eventPages':[],
        /**
         * @type String|Color
         */
        'color': '#ffffff',
        /**
         * @type Integer[]
         */
        'variables': []
    };
    /**
     * @param {Object} data
     * @returns {Scene}
     */
    this.setup = function( data ){
        
        _SCENE.name = data.name || 'New Scene';
        
        if( Array.isArray( data.instances ) ){
            data.instances.forEach( function( entity ){
                _SCENE.instances.push( entity );
            });
        }
        
        if( Array.isArray( data.layers ) ){
            
        }
        
        return this;
    };
    /**
     * @returns {String}
     */
    this.name = () => _SCENE.name;
    /**
     * @param {Sprite} sprite
     * @returns {Scene}
     */
    this.addSprite = function( sprite ){
        
        _SCENE.sprites.push( sprite );

        return this;
    };
    /**
     * @param {Image} image
     * @returns {Scene}
     */
    this.addLayer = function( image ){
        
        _SCENE.layers.push( image );

        return this;
    };
    /**
     * @param {EventPage} page
     * @returns {Scene}
     */
    this.addEventPage = function( page ){
        
        _SCENE.eventPages.push( page );

        return this;
    };
    /**
     * @param {Number} ticks
     * @returns {Scene}
     */
    this.update = function( ticks ){

        for ( var s = _SCENE.sprites.length - 1; s >= 0; s--) {

            var sprite = _SCENE.sprites[ s ];
            
            switch( sprite.status( ) ){
                case Sprite.Status.Removed:
                    //remove sprite instance here
                    _SCENE.sprites.splice(s, 1);
                    break;
                case Sprite.Status.Active:
                    sprite.update( ticks );
                    break;
            }
        }

        return this;
    };
    /**
     * @param {MouseEvent} e
     * @returns {Scene}
     */
    this.click = function( e ){

        for( var s = _SCENE.sprites.length - 1 ; s > -1 ; s-- ){
            
            var sprite = _SCENE.sprites[ s ];
            
            if( sprite.click( e.offsetX , e.offsetY ) ){

                //Send to sprite event callbacks
                
                console.log(sprite.name() + ' clicked!');
                
                break;
            }
        }
        
        return this;
    };

    return this.setup( setup );
}



export {Scene};