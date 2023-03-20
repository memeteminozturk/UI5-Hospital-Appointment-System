sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/library",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/json/JSONModel",
    "project1/service/DoctorService",
    "project1/service/AvailableService",
  ],

  function (
    Controller,
    coreLibrary,
    DateFormat,
    JSONModel,
    DoctorService,
    AvailableService
  ) {
    "use strict";
    let db;
    var base;
    var CalendarType = coreLibrary.CalendarType;
    return Controller.extend("project1.controller.AdminPanel", {
      oFormatYyyymmdd: null,
      oModel: null,
      onInit: function () {
        db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
        this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        DoctorService.createTable();
        AvailableService.createTable();

        base = this;
        base.oModel = this.getOwnerComponent().getModel();

        this.oFormatYyyymmdd = DateFormat.getInstance({
          pattern: "dd.MM.yyyy",
          calendarType: CalendarType.Gregorian,
        });

        base.oModel.setProperty("/selectedDates", []);
      },
      onLogout: function () {
        localStorage.removeItem("name");
        this.oRouter.navTo("app");
      },
      onAddDoctor: function () {
        const doctorName = base.oModel.getProperty("/doctorName");
        const selectedDates = base.oModel.getProperty("/selectedDates");
        const sSelectedDates = selectedDates.map((date) => date.Date);
        const availableHours = this.getView()
          .byId("availableHours")
          .getSelectedKeys();
        const doctor_id = Math.floor(Math.random() * 1000000000);
        if (doctorName == "" || sSelectedDates == "" || availableHours == "") {
          sap.m.MessageToast.show("Please fill in all the fields");
        } else {
          AvailableService.insert(doctor_id, sSelectedDates, availableHours);
          DoctorService.insert(doctor_id, doctorName);
          base.oModel.setProperty("/doctorName", "");
          sap.m.MessageToast.show("Doctor added successfully");
          this.getView().byId("calendar").removeAllSelectedDates();
          this.getView().byId("availableHours").setSelectedKeys([]);
          setTimeout(() => {
            this.oRouter.navTo("adminpage");
          }, 750);
        }
      },
      handleCalendarSelect: function (oEvent) {
        var oCalendar = oEvent.getSource(),
          aSelectedDates = oCalendar.getSelectedDates(),
          oData = {
            selectedDates: [],
          },
          oDate,
          i;
        if (aSelectedDates.length > 0) {
          for (i = 0; i < aSelectedDates.length; i++) {
            oDate = aSelectedDates[i].getStartDate();
            oData.selectedDates.push({
              Date: this.oFormatYyyymmdd.format(oDate),
            });
          }
          base.oModel.setProperty("/selectedDates", oData.selectedDates);
        } else {
          this._clearModel();
        }
      },

      handleRemoveSelection: function () {
        this.byId("calendar").removeAllSelectedDates();
        this._clearModel();
      },

      _clearModel: function () {
        var oData = { selectedDates: [] };
        base.oModel.setProperty("/selectedDates", oData.selectedDates);
      },
    });
  }
);
