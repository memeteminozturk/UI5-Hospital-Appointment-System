sap.ui.define(
  ["sap/ui/core/mvc/Controller",
    "project1/service/UserService"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, UserService) {
    "use strict";
    let db;
    var base ;
    return Controller.extend("project1.controller.Login", {
      onInit: function () {
        db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
        this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        base = this;
        base.oModel = this.getOwnerComponent().getModel();
        base.oModel.setProperty("/deneme", "deneme");
  
      },
      onSignUp: function () {
        this.oRouter.navTo("signup");
      },
      onNavBack: function () {
        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("appointment", {}, true);
        }
      },
      onSubmitLogin: function () {
        var idnoLogin = base.oModel.getProperty("/idno-login");
        var passwordLogin = base.oModel.getProperty("/password-login");
        if (idnoLogin =="000"){
          idnoLogin= idnoLogin.toString();
        } else {
          idnoLogin = parseInt(idnoLogin);
        }
        if (idnoLogin == "" || passwordLogin == "") {
          sap.m.MessageToast.show("Please fill in all fields");
        } else {
          var that = this;
          UserService.userLogin(idnoLogin).then(function (result) {
            if (result.rows.length > 0) {
              var user = result.rows.item(0);
              if (user.password == passwordLogin) {
                if (user.role == "0") {
                  sap.m.MessageToast.show("Login successful");
                  base.oModel.setProperty("/idno-login", "");
                  base.oModel.setProperty("/password-login", "");
                  localStorage.setItem(
                    "name",
                    user.name + " " + user.surname
                  );
                  localStorage.setItem("idno", user.idno);
                  localStorage.setItem("role", user.role);
                  base.oModel.setProperty("/loggedUser", user.name);
                  that.oRouter.navTo("adminpage");
                } else {
                  sap.m.MessageToast.show("Login successful");
                  that.oRouter.navTo("app");
                  base.oModel.setProperty("/idno-login", "");
                  base.oModel.setProperty("/password-login", "");
                  
                  localStorage.setItem(
                    "name",
                    user.name + " " + user.surname
                  );
                  localStorage.setItem("idno", user.idno);
                  localStorage.setItem("role", user.role);
                  base.oModel.setProperty("/loggedUser", user.name);
                }
              } else {
                sap.m.MessageToast.show("Incorrect password");
              }
            } else {
              sap.m.MessageToast.show("User not found");
            }
          });
        }
      },
      onResetAppointments: function () {
        db.transaction(function (tx) {
          tx.executeSql("DROP TABLE IF EXISTS appointments");
        });
        db.transaction(function (tx) {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS appointments (id, user_id, doctor, date, time, reason)",
            [],
            function (tx, result) {
              console.log("Table created successfully");
            }
          );
        });
      },
    });
  }
);
