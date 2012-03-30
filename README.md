Metrics
=======

Exposing key/value as a JSON.

Write value on a socket, with `nc` or other low tech tool. Read it with curl.

Try it
------

In a terminal

    node app.js

In an other terminnal

    nc "answer 42" | nc localhost 8124

In a browser

    http://localhost:1337

[Event source](http://dev.w3.org/html5/eventsource/) :

    http://localhost:1337/events

First event is a complete dump, following by a simple key/value for each modifications.

Todo
----

 * √ expose stack as JSON over HTTP
 * √ set value over a socket
 * √ expose values as Server Sent Event
 * _ homepage with some javascripts.
 * _ backup JSON file for crash proof
 * _ not only GAUGE, add COUNTER type
