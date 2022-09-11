# mern-excercise
latihan MERN Stack menggunakan docker proxy.

## Getting Started

setup local domain `/etc/hosts` tambahkan `$ 127.0.0.1 mern-excercise.local`

development
1. `$ docker-compose -f docker-compose.dev.yml build`
2. `$ docker-compose -f docker-compose.dev.yml up -d`

production
1. `$ docker-compose build`
2. `$ docker-compose up -d`

open browser menggunakan https dengan domain https://mern-excercise.local

### reference
- [MERN Stack](https://github.com/bradtraversy/devconnector_2.0)
- [local ssl](https://hackerrdave.com/https-local-docker-nginx/)
