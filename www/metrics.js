$(function() {

    var table = $('table');

    var stocks = new EventSource('/events');
    function escape(e) {
        return e.replace(/[#.]/g, '_');
    }
    stocks.onmessage = function(event) {
        var data = JSON.parse(event.data); // read the event as JSON
        for (var k in data) {
            var line = $('#' + escape(k), table);
            if (line.length) { // the line exists
                line.text(Math.round(data[k]) + ' %');
            } else {
                table.append('<tr><td>' + k + '</td><td id="' + escape(k) + '">' +
                    Math.round(data[k]) + '% </td></tr>');
            }
        }
    };

});
