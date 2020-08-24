# SyntropicFarming 

This is the repository for the Synctropic Farming project.

## Applications

### Backend
* see [backend_go/README.md](backend_go/Readme.md) for details on how to build and run the backend.
### Frontend
* see [frontend/README.md](client/Readme.md) for details on how to build and run the frontend.
### Database
* see [database/README.md](database/Readme.md) for details on how to build and run the database.

## Deploy

### docker-compose

Start the api and the db using docker-compose.
```bash
docker-compose up -d api
```
Because the api needs the db service to run, starting the api will automatically start the db.


### Backup and Restore
There are two things to do when doing a backup of the data:
- export the database data
- copy the upload directory of the backend

#### Backup the db
```bash
docker exec syntropic-db-container pg_dump <db_name> --username <user> | gzip -9 > backup.sql.gz
```

#### Restore the db with backup file
```bash
gunzip < database/backup.sql.gz | docker exec -i db_container psql <db_name> --username <user>
```
