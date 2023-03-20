sap.ui.define(
  ["sap/ui/core/mvc/Controller"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   *  */
  function (Controller) {
    "use strict";
    var base;
    return Controller.extend("project1.controller.Toolbar", {
      onInit: function () {
        base = this;
        base.oModel = this.getOwnerComponent().getModel();
        base.oModel.setProperty("/loggedUser", localStorage.getItem("name"));
        var loginLink = this.getView().byId("login-link");
        var signupLink = this.getView().byId("signup-link");
        var logoutLink = this.getView().byId("logout-link");
        var loggedUser = this.getView().byId("logged-user");
        if (localStorage.getItem("name") != null) {
          loginLink.setVisible(false);
          signupLink.setVisible(false);
          logoutLink.setVisible(true);
          loggedUser.setVisible(true);
          base.oModel.setProperty("/loggedUser", localStorage.getItem("name"));
        } else {
          logoutLink.setVisible(false);
          loggedUser.setVisible(false);
          loginLink.setVisible(true);
          signupLink.setVisible(true);
          base.oModel.setProperty("/loggedUser", "");
        }
        setInterval(() => {
          if (localStorage.getItem("name")) {
            if (localStorage.getItem("name") != null) {
              loginLink.setVisible(false);
              signupLink.setVisible(false);
              logoutLink.setVisible(true);
              loggedUser.setVisible(true);
              base.oModel.setProperty("/loggedUser", localStorage.getItem("name"));
            } else {
              logoutLink.setVisible(false);
              loggedUser.setVisible(false);
              loginLink.setVisible(true);
              signupLink.setVisible(true);
              base.oModel.setProperty("/loggedUser", "");
            }
          }
        }, 1000);
      },
      onLogin: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("login");
      },
      onSignUp: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("signup");
      },
      onLogout: function () {
        localStorage.removeItem("name");
        localStorage.removeItem("idno");

        var loginLink = this.getView().byId("login-link");
        var signupLink = this.getView().byId("signup-link");
        var logoutLink = this.getView().byId("logout-link");
        var loggedUser = this.getView().byId("logged-user");
        if (localStorage.getItem("name") != null) {
          loginLink.setVisible(false);
          signupLink.setVisible(false);
          logoutLink.setVisible(true);
          loggedUser.setVisible(true);
        } else {
          loginLink.setVisible(true);
          signupLink.setVisible(true);
          logoutLink.setVisible(false);
          loggedUser.setVisible(false);
        }
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("login");
      },
      onHome: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("app");
      },
    });
  }
);
