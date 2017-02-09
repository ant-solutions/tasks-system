# tasks-system

### How to run:

```docker-compose up -d```

### View the logs

```docker-compose logs -f server```

The logs example:

```
server_1  |
server_1  |
server_1  |   timing test
server_1  |         info: Mongoose default connection open to mongodb://mongo/test1
server_1  |     ✔  should be equal
server_1  |
server_1  |   TasksModel test
server_1  |     ✔  createdAt should be Date type
server_1  |     ✔  createdAt should be Date type
server_1  |     ✔  __v should equal 0
server_1  |     ✔  urgency should equal immediate
server_1  |     ✔  status should equal pending
server_1  |     ✔  completedAt should equal undefined
server_1  |     ✔  completedAt should be Date type
server_1  |     ✔  createdAt should be Date type
server_1  |     ✔  createdAt should be Date type
server_1  |     ✔  urgency should equal immediate
server_1  |     ✔  status should equal completed
server_1  |     ✔  completedAt should be Date type
server_1  |     ✔  createdAt should be Date type
server_1  |     ✔  createdAt should be Date type
server_1  |     ✔  urgency should equal immediate
server_1  |     ✔  status should equal canceled
server_1  |
server_1  | passed: 17  failed: 0  of 17 tests  (1.5s)
server_1  |
server_1  | All of 17 tests passed!
server_1  |
server_1  | npm info lifecycle tasks-system@0.0.1~posttest:tape: tasks-system@0.0.1
server_1  | npm info ok
```

### Note

If you run on Mac and can not start Mongo service, try delete `data` folder before run `docker-compose up -d`
