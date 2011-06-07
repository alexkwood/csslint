

/**
 * Main CSSLint object.
 * @class CSSLint
 * @static
 * @extends parserlib.util.EventTarget
 */
var CSSLint = (function(){

    var rules   = [],
        api     = new parserlib.util.EventTarget();

    //-------------------------------------------------------------------------
    // Rule Management
    //-------------------------------------------------------------------------
        
    /**
     * Adds a new rule to the engine.
     * @param {Object} rule The rule to add.
     * @method addRule
     */
    api.addRule = function(rule){
        rules.push(rule);
    };
    
    /**
     * Clears all rule from the engine.
     * @method clearRules
     */
    api.clearRules = function(){
        rules = [];
    };

    //-------------------------------------------------------------------------
    // Verification
    //-------------------------------------------------------------------------
    
    /**
     * Starts the verification process for the given CSS text.
     * @param {String} text The CSS text to verify.
     * @return {Object} Results of the verification.
     * @method verify
     */
    api.verify = function(text){
    
        var i       = 0,
            len     = rules.length,
            reporter = new Reporter(),
            parser = new parserlib.css.Parser({ starHack: true, ieFilters: true, 
                                                underscoreHack: true, strict: false });
        while (i < len){
            rules[i++].init(parser, reporter);
        }
        
        //capture most horrible error type
        try {
            parser.parse(text);
        } catch (ex) {
            reporter.error("Fatal error, cannot continue: " + ex.message, ex.line, ex.col);
        }
    
        return {
            messages    : reporter.messages,
            stats       : reporter.stats
        };
    };


    //-------------------------------------------------------------------------
    // Publish the API
    //-------------------------------------------------------------------------
    
    return api;

})();