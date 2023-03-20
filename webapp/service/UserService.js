sap.ui.define([], function () {
  "use strict";
  var db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
  return {
    createTable: function () {
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS users (idno, name, surname, password, dateOfBirth, role)",
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
    addUser: function (idno, name, surname, password, dateOfBirth, role) {
      idno = parseInt(idno);
      return new Promise(function (resolve, reject) {
        db.transaction(function (tx) {
          tx.executeSql(
            "INSERT INTO users (idno, name, surname, password, dateOfBirth, role) VALUES (?,?,?,?,?,?)",
            [idno, name, surname, password, dateOfBirth, role],
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
    userLogin: function (idno) {
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "SELECT * FROM users WHERE idno = ?",
            [idno],
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
    logUsers: function () {
      return new Promise((resolve, reject) => {
        db.transaction(function (tx) {
          tx.executeSql(
            "SELECT * FROM users",
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
  };
});
