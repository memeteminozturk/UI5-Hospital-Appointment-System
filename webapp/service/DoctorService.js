sap.ui.define([], function () {
  var db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
  return {
    createTable: function () {
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS doctors (id, name)",
            [],
            function (tx, result) {
              resolve(result);
            },
            function (tx, error) {
              reject(error);
            }
          );
        });
      });
    },
    insert: function (id, name) {
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "INSERT INTO doctors (id, name) VALUES (?, ?)",
            [
              id,
              name
            ],
            function (tx, result) {
              resolve(result);
            },
            function (tx, error) {
              reject(error);
            }
          );
        });
      });
    },
    getDoctors: function () {
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "SELECT * FROM doctors",
            [],
            function (tx, result) {
              resolve(result.rows);
            },
            function (tx, error) {
              reject(error);
            }
          );
        });
      });
    },
    updateDoctor: function (id, newName) {
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "UPDATE doctors SET name = ? WHERE id = ?",
            [newName, id],
            function (tx, result) {
              resolve(result);
            },
            function (tx, error) {
              reject(error);
            }
          );
        });
      });
    },
    deleteDoctor: function (id) {
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "DELETE FROM doctors WHERE id = ?",
            [id],
            function (tx, result) {
              resolve(result);
            },
            function (tx, error) {
              reject(error);
            }
          );
        });
      });
    }
  };
});
