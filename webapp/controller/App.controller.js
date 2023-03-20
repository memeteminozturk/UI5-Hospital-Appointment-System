sap.ui.define(
  ["sap/ui/core/mvc/Controller"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller) {
    "use strict";
    var base;
    return Controller.extend("project1.controller.App", {
      onInit: function () {
        base = this;
        base.oModel = this.getOwnerComponent().getModel();
      },
      onAppointment: function () {
        if (localStorage.getItem("idno") != null) {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("appointment");
        } else {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("login");
        }
      },
      onMyAppointments: function () {
        if (localStorage.getItem("idno") != null) {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("myappointments");
        } else {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("login");
        }
      },
    });
  }
);
