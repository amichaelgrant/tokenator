Readme.md
==============================================
The Tokenator Machine is a token generator and verifier server that helps mitigate the problem 
http retransmits. Http retransmit may be a serious issue when developing financial systems that 
ride on http as their mode of transport, this has given room for the use of timed tokens for marking 
transactions and determinig whether a given transction at any given point in time is valid and deserves processing.

Dependencies/Pre-requisites
===========================
NodeJs framework - a non-blocking, asynchronous evented I/O based on googles v8 engine.
----------------
Get NodeJs from node.org and install for your platform ( follow the instructions for your platform).
If you are using linux follow the following instructions or let the instruction provided by node.org override this one:
1 - Download the source from node.org
2 - issue the command 'cd <downloaded-source-directory>'
3 - issue './configure' once in the source directory
4 - issue 'make'
5 - issue 'sudo make install'
You are done with nodejs.
				  

Redis Server - a blazing fast key value pair database;
------------
The process for installing Redis is pretty much the same as nodejs:
Issue this commands at the command prompt:

$ wget http://redis.googlecode.com/files/redis-2.4.17.tar.gz
$ tar xzf redis-2.4.17.tar.gz
$ cd redis-2.4.17
$ make

To start Redis server:
$ src/redis-server

ref: http://redis.io/download

Installation
==============
Clone the tokenator source from: https://github.com/amichaelgrant/tokenator.git like so:
if using linux and you have git installed:

1 - 'git clone https://github.com/amichaelgrant/tokenator.git'
2 - 'cd <cloned-source-directory>'
3 - 'forever start -a -p ./ -l forever.log -o log.log -e err.log tokenator.js'
	(ref: https://github.com/nodejitsu/forever.git)
4 - To stop the tokenator issue 'forever stop tokenator.js'
5 - check status and error logs by looking at log.log and err.log files respectively.


Usage
=======
To get a token:
http://tokenator/timedtoken/get_token?time_validity=ValidityTime&device_id=DeviceIdentification&device_time=TimeOnDevice
Responses:
returns a valid token on success and 'ERROR' on failure

To check a token:
http:///tokenator/timedtoken/check_token?token=Token&device_id=DeviceId&device_time=TimeOnDevice
Responses:
0 - TOKEN_VALID
1 - TOKEN_EXPIRED
2 - RETRANSMIT_OCCURED
3 - TOKEN_NON_EXISTENT
'ERROR' - BAD 

ToDo:
=====
Allow json and xml requests and responses.


Send me a mail if you run in to problems: a.hunter.hunts@gmail.com