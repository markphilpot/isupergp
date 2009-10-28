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

function refreshSites(){
  db.transaction(
    transaction.executeSql(
      'SELECT * FROM sites ORDER BY name;',
      function(transaction, result){
	for(var i=0; i < result.rows.length; i++){
	  var row = results.rows.item(i);
	  var newSiteRow = $('#siteTemplate').clone();
	  newSiteRow.removeAttr('id');
	  newEntryRow.removeAttr('style');
	  newEntryRow.data('siteID', row.id);
	  newEntryRow.appendTo('#home ul');
	  newEntryRow.find('.label').text(row.name);
	}
      },
      errorHandler
    );
  );
}

function errorHandler(transaction, error) {
  alert('Sorry, slight mixup ('+error.message+' ['+error.code+']');
  return true;
}
