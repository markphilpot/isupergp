var db;

var jQT = $.jQTouch({
  icon: 'kilo.png',
  statusBar: 'black'
});

$(document).ready(function(){
  $('#addSite form').submit(saveSite);
  var shortName = 'iSuperGP';
  var version = '0.1';
  var displayName = 'iSuperGP';
  var maxSize = 65536;
  db = openDatabase(shortName, version, displayName, maxSize);

  db.transaction(
    function(transaction) {
      transaction.executeSql(
        'CREATE TABLE IF NOT EXISTS sites '+
	'  (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, '+
	'   name TEXT NOT NULL);'
      );
    }
  );
});

fuction saveSite() {
  var site = $('#site').val();
  db.transaction(
    function(transaction){
      transaction.executeSql(
        'INSERT INTO sites (name) VALUES (?);',
	[site],
	function(){
	  refreshSites();
	  jQT.goBack();
	},
	errorHandler
      );
    }
  );
  return false;
}

function errorHandler(transaction, error) {
  alert('Sorry, slight mixup ('+error.message+' ['+error.code+']');
  return true;
}
