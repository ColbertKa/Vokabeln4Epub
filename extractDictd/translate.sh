#!/bin/bash
#set -x

cd /vokabeln/
while true; do
    FILE="$( ls -A work/|head -1 )"
    echo $FILE

    test -f work/$FILE  && { mv work/$FILE /tmp/ } || { exit 0; }

    cat /tmp/$FILE|awk '{word=$1;cmd="dict -d fd-eng-deu "  word; print cmd;while ((cmd | getline line) > 0) { print line; }}' > /tmp/all.txt
    cat /tmp/all.txt|sed 's/^  //g'|sed 's/\[.*\]//g'|awk '/From English-German FreeDict/{getline;getline;printf $1";";getline;print $0;}'|sed 's/<[^>]*>//g' > erg/$FILE
    rm /tmp/$FILE
    sleep 10;
done
