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

