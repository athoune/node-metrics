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

Todo
----

 * √ expose stack as JSON over HTTP
 * √ set value over a socket
 * _ expose values as Server Sent Event
 * _ backup JSON file for crash proof
 * _ not only GAUGE, add COUNTER type
