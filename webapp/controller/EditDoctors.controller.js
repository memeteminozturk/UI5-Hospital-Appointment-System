sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/library",
    "project1/service/DoctorService",
    "project1/service/AvailableService",
  ],
  function (
    Controller,
    JSONModel,
    DateFormat,
    coreLibrary,
    DoctorService,
    AvailableService
  ) {
    "use strict";

    var CalendarType = coreLibrary.CalendarType;
    var base;
    var db;
    async function deleteDoctor(selectedDoctorId) {
      await DoctorService.deleteDoctor(selectedDoctorId);
      await AvailableService.deleteAvailableByDoctor(selectedDoctorId);
    }
    return Controller.extend(
      "sap.ui.unified.sample.CalendarMultipleDaySelection.CalendarMultipleDaySelection",
      {
        oFormatYyyymmdd: null,
        oModel: null,

        onInit: function () {
          db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
          base = this;
          base.oModel = this.getOwnerComponent().getModel();
          this.oFormatYyyymmdd = DateFormat.getInstance({
            pattern: "dd.MM.yyyy",
            calendarType: CalendarType.Gregorian,
          });
          base.oModel.setProperty("/selectedDates", []);

          DoctorService.getDoctors().then((data) => {
            var doctors = [];
            for (var i = 0; i < data.length; i++) {
              doctors.push(data[i]);
            }
            base.oModel.setProperty("/doctors", doctors);
          });
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
        onListItemPress: function (oEvent) {
          this.byId("calendar").removeAllSelectedDates();
          this._clearModel();
          var selectedDoctor = oEvent
            .getSource()
            .getBindingContext()
            .getObject();
            base.oModel.setProperty("/selectedDoctor", selectedDoctor);
          var selectedDoctorId = selectedDoctor.id;
          AvailableService.getAvailableByDoctor(selectedDoctorId).then(
            (data) => {
              var selectedDoctorAvailable = [];
              for (var i = 0; i < data.length; i++) {
                selectedDoctorAvailable.push(data[i]);
              }
              base.oModel.setProperty(
                "/selectedDoctorAvailable",
                selectedDoctorAvailable
              );
              var calendar = this.byId("calendar");
              var selectedDates = [];
              selectedDoctorAvailable.forEach((item) => {
                item.date.split(",").forEach((date) => {
                  var parts = date.split(".");
                  var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
                  calendar.addSelectedDate(
                    new sap.ui.unified.DateTypeRange({
                      startDate: mydate,
                      type: sap.ui.unified.CalendarDayType.Type01,
                    })
                  );
                });
              });
              var oData = {
                selectedDates: [],
              };
              var oDate, i;
              var selectedDates = calendar.getSelectedDates();

              if (selectedDates.length > 0) {
                for (i = 0; i < selectedDates.length; i++) {
                  oDate = selectedDates[i].getStartDate();
                  oData.selectedDates.push({
                    Date: this.oFormatYyyymmdd.format(oDate),
                  });
                }
                base.oModel.setProperty("/selectedDates", oData.selectedDates);
              } else {
                this._clearModel();
              }
              var selectedTimes = [];
              selectedDoctorAvailable.forEach((item) => {
                item.time.split(",").forEach((time) => {
                  selectedTimes.push(time);
                });
              });
              var combobox = this.byId("availableHours");
              combobox.setSelectedKeys(selectedTimes);
            }
          );
        },
        onDelete: function (oEvent) {
          var selectedDoctorId = base.oModel.getProperty("/selectedDoctor/id");

          deleteDoctor(selectedDoctorId);
          sap.m.MessageToast.show("Doctor deleted");
          setTimeout(() => {
            this.onRefresh();
          }, 1000);
          DoctorService.getDoctors().then((data) => {
            var doctors = [];
            for (var i = 0; i < data.length; i++) {
              doctors.push(data[i]);
            }
            base.oModel.setProperty("/doctors", doctors);
          });
          this.byId("calendar").removeAllSelectedDates();
          this._clearModel();
        },
        onSave: function (oEvent) {
          var nameInput = this.byId("name-input").getValue();
          var selectedDoctorId = base.oModel.getProperty("/selectedDoctor/id");
          var selectedDoctorAvailable = base.oModel.getProperty(
            "/selectedDoctorAvailable"
          );
          var selectedDates = base.oModel.getProperty("/selectedDates");
          selectedDates = selectedDates.map((date) => date.Date);
          var selectedTimes = this.getView()
            .byId("availableHours")
            .getSelectedKeys();
          DoctorService.updateDoctor(selectedDoctorId, nameInput);
          AvailableService.updateAvailable(
            selectedDoctorId,
            selectedDates,
            selectedTimes
          );
          DoctorService.getDoctors().then((data) => {
            var doctors = [];
            for (var i = 0; i < data.length; i++) {
              doctors.push(data[i]);
            }
            base.oModel.setProperty("/doctors", doctors);
          }
          ); 

          sap.m.MessageToast.show("Doctor updated");
        },
      }
    );
  }
);
