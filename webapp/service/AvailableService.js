sap.ui.define([], function () {
  "use strict";
  var db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
  return {
    createTable: function () {
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS available (doctor_id, date, time)",
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
    insert: function (doctor_id, date, time) {
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "INSERT INTO available (doctor_id, date, time) VALUES (?, ?, ?)",
            [doctor_id, date, time],
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
    getAvailable: function () {
      var available = [];
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "SELECT * FROM available",
            [],
            function (tx, result) {
              for (var i = 0; i < result.rows.length; i++) {
                available.push(result.rows.item(i));
              }
              resolve(available);
            },
            function (tx, error) {
              reject(error);
            }
          );
        });
      });
    },
    getAvailableByDoctor: function (doctor_id) {
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "SELECT * FROM available WHERE doctor_id = ?",
            [doctor_id],
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
    isDateAvailable: function (doctor_id, date) {
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "SELECT * FROM available WHERE doctor_id = ?",
            [doctor_id],
            function (tx, result) {
              if (result.rows.length == 0) {
                resolve(false);
              } else {
                var doctor = result.rows.item(0);
                var availableDates = doctor.date.split(",");
                if (availableDates.includes(date)) {
                  resolve(true);
                }
                resolve(false);
              }
            },
            function (tx, error) {
              reject(error);
            }
          );
        });
      });
    },
    updateAvailable: function (doctor_id, date, time) {
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "UPDATE available SET date = ?, time = ? WHERE doctor_id = ?",
            [date, time, doctor_id],
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
    deleteAvailableByDoctor: function (doctor_id) {
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "DELETE FROM available WHERE doctor_id = ?",
            [doctor_id],
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
    getAvailableDates: function (doctor_id) {
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "SELECT * FROM available WHERE doctor_id = ?",
            [doctor_id],
            function (tx, result) {
              if (result.rows.length == 0) {
                resolve([]);
              } else {
                var doctor = result.rows.item(0);
                var availableDates = doctor.date.split(",");
                resolve(availableDates);
              }
            },
            function (tx, error) {
              reject(error);
            }
          );
        });
      });
    },
    getAvailableTimes: function (doctor_id) {
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "SELECT time FROM available WHERE doctor_id = ?",
            [doctor_id],
            function (tx, result) {
                resolve(result.rows);
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
