/**
 * @param {String} imageID 
 * @param {Int} tileWidth
 * @param {Int} tileHeight
 * @returns {TileDef}
 */
function TileSet( imageID , tileWidth , tileHeight ){
    
    var _tileSet = {
        'image': typeof imageID !== 'undefined' ? imageID : 0,
        'tileWidth': typeof tileWidth === 'number' ? tileWidth : 32,
        'tileHeight': typeof tileHeight === 'number' ? tileHeight : 32,
        'blueprint': {
            0:[/*empty*/],
            1:[/*up*/],
            2:[/*up-right*/],
            3:[/*right*/],
            4:[/*down-right*/],
            5:[/*down*/],
            6:[/*down-left*/],
            7:[/*left*/],
            8:[/*up-left*/],
            9:[/*solid*/]
        },
        'tiles': [
            //add all tile definitions here
        ]
    };
    /**
     * Place a tile (constriction mode) by random position within the selected type
     * @param {Int|String} type
     * @returns {Tile}
     */
    this.generate = ( type ) => {

        if( _tileSet.blueprint.hasOwnProperty( type ) ){
            
            var R = parseInt( Math.random() * _tileSet.blueprint[ type ].length );
            
            return _tileSet.tiles[ R ];
        }
        
        return Tile.Empty;
    };
    /**
     * @param {Tile} tile
     * @returns {TileSet}
     */
    this.addTile = ( tile ) => {

        if( tile instanceof Tile ){
            //add to tile collection (obtains a position or ID in the list)
            _tileSet.tiles.push( tile );
            //add to tile template rules, refered by the recent position ID in the list)
            _tileSet.blueprint[ tile.type() ].push( _tileSet.tiles.length - 1 );
        }

        return this;
    };
    /**
     * @param {Number} tileID
     * @returns {Tile}
     */
    this.get = ( tileID ) => tileID >= 0 && tileID < _tileSet.tiles.length ? _tileSet.tiles[ tileID ] : Tile.Empty;
    /**
     * @returns {Number}
     */
    this.tileWidth = () => _tileSet.tileWidth;
    /**
     * @returns {Number}
     */
    this.tileHeight = () => _tileSet.tileHeight;
    
    return this;
}
/**
 * @param {Number} drawID
 * @param {Integer} type
 * @param {String} material
 * @param {Boolean} solid
 * @returns {Tile}
 */
function Tile( drawID , type , material , solid ){
    
    var _tile = {
        'ID': -1,
        'imageID': typeof drawID === 'number' ? drawID : 0,
        'type': typeof type === 'number' ? type : Tile.Behavior.None,
        'material': typeof material === 'string' ? material : Tile.Material.None,
        'solid': typeof solid === 'boolean' ? solid : false,
    };
    /**
     * @returns {Boolean}
     */
    this.empty = () => _tile.ID < 0;
    /**
     * @returns {Boolean}
     */
    this.solid = () => _tile.solid;
    /**
     * @returns {String}
     */
    this.material = () => _tile.material;
    /**
     * @returns {String}
     */
    this.type = () => _tile.type;
    /**
     * @returns {Number}
     */
    this.image = () => _tile.imageID;
    
    this.ID = () => _tile.ID;
    /**
     * @param {Int} ID
     * @returns {Tile}
     */
    this.setID = ( ID ) =>{
        
        if( _tile.ID < 0 && typeof ID === 'number' ){

            _tile.ID = ID;
        }
        
        return this;
    };
    
    return this;
}
Tile.Empty = new Tile( );
/**
 * 
 * @type Tile.Material
 */
Tile.Material = {
    'None':'none',
    'Sand':'sand',
    'Earth':'earth',
    'Rock':'rock',
    'Metal':'metal'
};
/**
 * @type Tile.Behavior
 */
Tile.Behavior = {
    'None':0,
    'Up': 1 ,
    'UpRight': 2 ,
    'Right': 3 ,
    'DownRight': 4 ,
    'Down': 5 ,
    'DownLeft': 6 ,
    'Left': 7 ,
    'UpLeft': 8,
    'Solid':9,
};
/**
 * @returns {Layer}
 */
function Layer(){
    
    var _layer = {
        'width': 100,
        'height': 100,
        /**
         * @type TileSet
         */
        'tileSet': null,
        /**
         * @type Array
         */
        'tileMap':[
            //Tile Layout for map rendering
        ]
    };
    /**
     * @param {Array} tiles
     * @returns {Layer}
     */
    this.importTiles = ( tiles ) => {
        if( Array.isArray( tiles ) ){
            _layer.tileMap = tiles;
        }
        return this;
    };
    /**
     * Get tileID X position (col
     * @param {Number} tileId
     * @returns {Number}
     */
    this.getTileX = ( tileId ) => ( tileId % _layer.width ) * _layer.tileSet.tileWidth();
    /**
     * Get tileID Y position
     * @param {Number} tileId
     * @returns {Number}
     */
    this.getTileY = ( tileId ) => ( tileId / _layer.width ) * _layer.tileSet.tileHeight();
    /**
     * Get TileID by X,Y position on the map
     * @param {Number} X
     * @param {Number} Y
     * @returns {Number}
     */
    this.getTileId = ( X , Y ) => {
        
        var col = parseInt( X / _layer.tileSet.tileWidth() );
        
        var row = parseInt( Y / _layer.tileSet.tileHeight() );
        
        return col + ( row * _layer.width );
    };
    /**
     * @param {Int} X
     * @param {Int} Y
     * @returns {Tile}
     */
    this.getTile = ( X , Y ) => {
        
        var ID = this.getTileId( X , Y );
        
        return _layer.tileSet.get( ID );
    };
    /**
     * @param {Int} X
     * @param {Int} Y
     * @returns {String}
     */
    this.getTileType = ( X , Y ) => this.getTile( X , Y ).type();
    
    /**
     * @param {Int} tileID
     * @returns {Layer}
     */
    this.placeTile = ( tileID ) => {
        

        
        //var tile = _layer.tileSet.get( tileID );
        
        //var X = this.getTileX( tileID );
        
        //var Y = this.getTileY( tileID );
        
        
        
        
        return this;
    };
    
    return this;
}




