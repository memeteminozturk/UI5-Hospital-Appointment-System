sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";
  var base;
  return Controller.extend("project1.controller.AdminPage", {
    onInit: function () {
      base = this;
      base.oModel = this.getOwnerComponent().getModel();
      if (localStorage.getItem("role") != "0") {
        this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this.oRouter.navTo("app");
      }
    },
    onAdminPanel: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("adminpanel");
    },
    onEditDoctors: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("editdoctors");
    },
  });   
});
