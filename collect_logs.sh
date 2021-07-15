#!/bin/bash

ts=`date +%Y%m%d_%H%M%S`

tarname="dia_logs_$ts.tar.gz"

# collect logs
tar -czvf $tarname /var/log/Fotech/ /var/log/syslog

