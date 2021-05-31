package database

import (
	"fmt"
	"log"
)

func (d *DB) Delete(query string, id int64) (int64, error) {
	res, err := d.db.Exec(query, id)
	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
		return 0, err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		log.Fatalf("Error while checking the affected rows. %v", err)
		return 0, err
	}

	fmt.Printf("Total rows/record affected %v", rowsAffected)
	return rowsAffected, nil
}
