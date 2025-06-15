mkdir work
mkdir erg
cd work
split -l 2500 wordlist


docker build -t dictd-server .

docker run --rm -d -v $PWD:/vokabeln  dictd-server
