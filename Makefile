stop:
	kill -9 $$(sudo netstat -tulnp | grep ':9000' | sed 's/.*LISTEN *\([0-9]*\).*/\1/')