#/!/bin/bash

SYNTROPIC_DIR=$1
ROOT_BKP_DIR=$2
DATE=$(date +"%d-%m-%y")

BKP_DIR=$ROOT_BKP_DIR/$DATE
echo "$DATE - backing up SyntropicMaterial content: from $SYNTROPIC_DIR to $BKP_DIR"

echo "create bkp directory"
mkdir $BKP_DIR

echo "Backup uploads"
cp -R $SYNTROPIC_DIR/backend_go/uploads $BKP_DIR

echo "Backup DB"
docker exec -i syntropic-db-container pg_dump syntropic_farming --username syntropic > $BKP_DIR/syntropic_farming.sql

echo "Create archive"
tar -cvzf $BKP_DIR.tar.gz $BKP_DIR

echo "Cleanup"
rm -rf $BKP_DIR
