module.exports = function Character( charInfo, opts ) {

  // [firstName, familyName, className, level, ap, dp]
  if( !Array.isArray( charInfo ) ) {
    if( typeof charInfo === "object" ){
      var charInfoArray = Object.keys( charInfo ).map( function( k ){ return charInfo[ k ] });
      if( opts == 'nedb' ) {
        charInfoArray.splice( 0, 1 );
      }
    } 
  } else {
    var charInfoArray = charInfo;
  }
    
  this.firstName  = charInfoArray[0];
  this.familyName = charInfoArray[1];
  this.class      = charInfoArray[2]; // Check for valid class
  this.level      = parseInt( charInfoArray[3] );
  this.ap         = parseInt( charInfoArray[4] );
  this.dp         = parseInt( charInfoArray[5] );

  this.adp = function() {
    return this.ap + this.dp;
  }

}