sap.ui.define([], function () {
  "use strict";
  var db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
  return {
    createTable: function () {
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS appointments (id, user_id, doctor, date, time, reason)",
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
    getAppointmentsByIdNumber: function (user_id) {
      user_id = parseInt(user_id);
      var appointments = [];
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "SELECT * FROM appointments WHERE user_id = ?",
            [user_id],
            function (tx, result) {
              for (var i = 0; i < result.rows.length; i++) {
                var time = parseInt(result.rows.item(i).time) + 8;
                time = time.toString();
                time = time + ":00";
                if (time.length == 4) {
                  time = "0" + time;
                }
                let temp = {
                  id: result.rows.item(i).id,
                  date: result.rows.item(i).date,
                  time: time,
                  doctor: result.rows.item(i).doctor,
                  reason: result.rows.item(i).reason,
                };
                appointments.push(temp);
              }
              resolve(appointments);
            },
            function (tx, error) {
              reject(error);
            }
          );
        });
      });
    },
    getAppointmentsTimeByDoctorAndDate: function (doctor, date) {
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "SELECT time FROM appointments WHERE doctor = ? AND date = ?",
            [doctor, date],
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
    deleteAppointmentById: function (id) {
      id = parseInt(id);
      return new Promise(function (resolve, reject) {
        db.transaction(function (tx) {
          tx.executeSql(
            "DELETE FROM appointments WHERE id = ?",
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
    },
    addAppointment: function (id, user_id, doctor, date, time, reason) {
      id = parseInt(id);
      user_id = parseInt(user_id);
      time = parseInt(time);
      return new Promise(function (resolve, reject) {
        db.transaction(function (tx) {
          tx.executeSql(
            "INSERT INTO appointments (id, user_id, doctor, date, time, reason) VALUES (?,?,?,?,?,?)",
            [id, user_id, doctor, date, time, reason],
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
    isAppointmentAvailable: function (doctor, date, time) {
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "SELECT * FROM appointments WHERE doctor = ? AND date = ? AND time = ?",
            [doctor, date, time],
            function (tx, result) {
              if (result.rows.length == 0) {
                resolve(true);
              } else {
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
  };
});
