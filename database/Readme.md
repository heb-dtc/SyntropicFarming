# SyntropicFarming database

This is the database for the Syntropic farming project.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

The database is using PostgreSQL.
For now, the data is linked to the docker container. If the container is destroyed so is the data.

### Installing

To run the database, build and run the available Docker container.

```
docker build -t syntropic-db -f Dockerfile.dev .
```

```
docker run -d --name syntropic-db-container -p 5555:5432 syntropic-db
```

### Extract data to csv

To be able to insert data into a spreadsheet, an export to CSV was necessary.
The species_material association table data was extracted using the following command.

```
$ docker exec -i syntropic-db-container psql syntropic_farming --username syntropic --csv -c "select species_materials.uid as \"ID\", species.name as \"Commun Name\", materials.name as \"Material\", species.min_hardiness as \"Min Hardiness\", species.max_hardiness as \"Max Hardiness\", link from species_materials inner join species on species_materials.species_id=species.uid inner join materials on species_materials.material_id=materials.uid;" > data.csv
```

For the CSV we need the hardiness to be expressed in one column with the format `minHardiness:maxHardiness`.
Using awk, the initial csv data can be processed to meet that requirement.
```
$ awk 'BEGIN { FS=","; OFS=",\t" }; FNR == 1 { print $1,$2,$3,$5}; FNR  > 1 { print $1,$2,$3":"$4,$5}' data.csv > data_hardiness.csv
```

Finally, we add some extra column useful for the spreadsheet but not existing in the database.
Always using awk to process the file.
```
$ awk 'BEGIN { FS=","; OFS=",\t" }; FNR == 1 { print $1,$2,"Scientific Name",$3,$4,$5,$6,"IMG status","production scale","market availability","library status","contact email" }      ; FNR  > 1 { print $1,$2,"\t",$3,$4,$5,$6,"\t","\t","\t","published","\t"}' data.csv > data_final.csv
```

## Deployment

//todo

## Built With

* [PostgreSQL](postgresql.org) - Relational database management system 
