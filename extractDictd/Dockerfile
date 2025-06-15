FROM debian:stable-slim

# Install dictd and some example dictionaries
RUN apt-get update && \
    apt-get install -y dictd dict-gcide dict-wn && \
    apt-get install -y dict-freedict-eng-deu && \
    mkdir /vokabeln && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Expose the DICT protocol port
EXPOSE 2628

# Start dictd in the foreground
#CMD ["dictd", "-f"]
CMD ["/vokabeln/translate.sh"]
