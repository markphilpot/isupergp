var db;

var jQT = $.jQTouch( {
    icon : 'kilo.png',
    statusBar : 'black-translucent'
});

$(document).ready(
    function() {
        $('#addSite form').submit(saveSite);
        $('#settings form').submit(saveSettings);
        $('#settings').bind('pageAnimationStart', loadSettings);
        
        var shortName = 'iSuperGP';
        var version = '0.1';
        var displayName = 'iSuperGP';
        var maxSize = 65536;
        db = openDatabase(shortName, version, displayName, maxSize);

        db.transaction(function(transaction) {
            transaction.executeSql('CREATE TABLE IF NOT EXISTS sites (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);');
        });
        refreshSites();
    });

function saveSite() {
    var site = $('#site').val();
    db.transaction(function(transaction) {
        transaction.executeSql('INSERT INTO sites (name) VALUES (?);',
                [ site ], function() {
                    refreshSites();
                    jQT.goBack();
                }, errorHandler);
    });
    return false;
}

function refreshSites() {
    $('#mySites ul li:gt(0)').remove();
    db.transaction(function(transaction) {
        transaction.executeSql('SELECT * FROM sites ORDER BY name;', null,
                function(transaction, result) {
                    for ( var i = 0; i < result.rows.length; i++) {
                        var row = result.rows.item(i);
                        var newSiteRow = $('#siteTemplate').clone();
                        newSiteRow.removeAttr('id');
                        newSiteRow.removeAttr('style');
                        newSiteRow.data('siteID', row.id);
                        newSiteRow.appendTo('#mySites ul');
                        newSiteRow.find('.label').text(row.name);
                        newSiteRow.find('.delete').click(function() {
                            var clickedSite = $(this).parent();
                            var clickedSiteID = clickedSite.data('siteID');
                            deleteSiteByID(clickedSiteID);
                            clickedSite.slideUp();
                        });
                    }
                }, errorHandler);
    });
}

function deleteSiteByID(id) {
    db.transaction(function(transaction) {
        transaction.executeSql('DELETE FROM sites WHERE id = ?;', [ id ], null,
                errorHandler);
    });
}

function errorHandler(transaction, error) {
    alert('Sorry, slight mixup (' + error.message + ' [' + error.code + ']');
    return true;
}

function loadSettings(){
    // Check for init
    if(!localStorage.passwordLength)
        localStorage.passwordLength = 16;
    if(!localStorage.disableSubdomainRemoval)
        localStorage.disableSubdomainRemoval = false;
    
    $('#passwordLength').val(localStorage.passwordLength);
    $('#disableSubdomainRemoval').val(localStorage.disableSubdomainRemoval)
}

function saveSettings(){
    localStorage.passwordLength = $('#passwordLength').val();
    localStorage.disableSubdomainRemoval = $('#disableSubdomainRemoval').val();
    jQT.boBack();
    return false;
}
