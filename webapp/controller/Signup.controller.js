sap.ui.define(
  ["sap/ui/core/mvc/Controller", "project1/service/UserService"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, UserService) {
    "use strict";
    let db;
    var base = null;
    return Controller.extend("project1.controller.Signup", {
      onInit: function () {
        db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
        base = this;
        base.oModel = this.getOwnerComponent().getModel();
        UserService.createTable();
      },
      onLogin: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("login");
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
      onSubmitSignUp: function () {
        var idnoSignup = base.oModel.getProperty("/idno-signup");
        var nameSignup = base.oModel.getProperty("/name-signup");
        var surnameSignup = base.oModel.getProperty("/surname-signup");
        var passwordSignup = base.oModel.getProperty("/password-signup");
        var passwordSignup2 = base.oModel.getProperty("/password2-signup");
        var dateofbirthSignup = base.oModel.getProperty("/dob-signup");

        if (
          idnoSignup == "" ||
          nameSignup == "" ||
          surnameSignup == "" ||
          passwordSignup == "" ||
          passwordSignup2 == "" ||
          dateofbirthSignup == ""
        ) {
          sap.m.MessageToast.show("Please fill in all the fields");
        } else if (nameSignup.length < 3) {
          sap.m.MessageToast.show("Name must be at least 3 characters long");
        }
        // else if(passwordSignup.length < 8){
        //   alert("Password must be at least 8 characters long");
        // }
        else if (passwordSignup != passwordSignup2) {
          sap.m.MessageToast.show("Passwords do not match");
        }
        // else if (idnoSignup.length != 13) {
        //   alert("ID number must be 13 digits");
        // }
        else if (isNaN(idnoSignup)) {
          alert("ID number must be digits only");
        } else {
          idnoSignup = parseInt(idnoSignup);

          UserService.addUser(
            idnoSignup,
            nameSignup,
            surnameSignup,
            passwordSignup,
            dateofbirthSignup
          );

          base.oModel.setProperty("/idno-signup", "");
          base.oModel.setProperty("/name-signup", "");
          base.oModel.setProperty("/surname-signup", "");
          base.oModel.setProperty("/password-signup", "");
          base.oModel.setProperty("/password2-signup", "");
          base.oModel.setProperty("/dp1", "");

          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("login");
        }
      },
    });
  }
);
