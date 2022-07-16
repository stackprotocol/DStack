FROM golang:1.14.2-buster
LABEL maintainer="dstack <dstack@gmail.com>"

ENV GOPROXY=https://goproxy.cn \
  GOPATH=/root/go \
  SRC_DIR=/root/go/src/github.com/stackos/dstack

RUN mkdir -p GOPATH SRC_DIR

COPY . $SRC_DIR

RUN cd $SRC_DIR \
  && mkdir -p .git/objects \
  && make build

FROM alpine:3.10
LABEL maintainer="dstack <dstack@gmail.com>"

ENV IPOS_ACCESS_KEY_FILE=access_key \
  IPOS_SECRET_KEY_FILE=secret_key

ENV GOPATH       /root/go
ENV SRC_DIR      $GOPATH/src/github.com/stackos/dstack
COPY --from=0 $SRC_DIR/build/dstack /usr/local/bin/dstack
COPY --from=0 $SRC_DIR/bin/docker_entrypoint /usr/local/bin/docker_entrypoint

RUN chmod 0755 /usr/local/bin/docker_entrypoint

EXPOSE 9000

ENV LOGGER_LOG_LEVEL ""

ENTRYPOINT ["/usr/local/bin/docker_entrypoint"]

CMD ["server"]
