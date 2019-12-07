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

