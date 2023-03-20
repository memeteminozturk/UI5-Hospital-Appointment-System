sap.ui.define(
  ["sap/ui/core/mvc/Controller", "../service/AppointmentService"],

  function (Controller, AppointmentService) {
    "use strict";
    var base;
    let db;
    return Controller.extend("project1.controller.MyAppointments", {
      onInit: function () {
        db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
        base = this;
        base.oModel = this.getOwnerComponent().getModel();
        AppointmentService.getAppointmentsByIdNumber(localStorage.getItem("idno")).then((data) => {
          var appointments = [];
          for (var i = 0; i < data.length; i++) {
            appointments.push(data[i]);
          }
          console.log(appointments);
          base.oModel.setProperty("/appointments", appointments);
        });
      },
      onListItemPress: function (oEvent) {
        const getSelectedAppointment = oEvent
          .getSource()
          .getBindingContext()
          .getObject();
        const id = getSelectedAppointment.id;
        sessionStorage.setItem("appointmentId", id);
      },
      onDeletePress: function (oEvent) {
        const id = parseInt(sessionStorage.getItem("appointmentId"));
        var that = this;
        AppointmentService.deleteAppointmentById(id).then((data) => {
          if (data.rowsAffected == 1) {
            sap.m.MessageToast.show("Appointment deleted successfully");
            that.onInit();
          } else {
            sap.m.MessageToast.show("Appointment not deleted");
          }
        });
      },
    });
  }
);
