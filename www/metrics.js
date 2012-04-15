$(function() {

    var table = $('table');

    var stocks = new EventSource('/events');
    stocks.onmessage = function(event) {
        var data = JSON.parse(event.data); // read the event as JSON
        for (var k in data) {
            var line = $('#' + k, table);
            if (line.length) { // the line exists
                line.text(data[k]);
            } else {
                table.append('<tr><td>' + k + '</td><td id="' + k + '">' +
                    data[k] + '</td></tr>');
            }
        }
    };

});
