sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/unified/CalendarLegendItem",
    "sap/ui/unified/DateTypeRange",
    "sap/ui/unified/library",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/CalendarType",
    "project1/service/AppointmentService",
    "project1/service/DoctorService",
    "project1/service/AvailableService",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   *  */
  function (
    Controller,
    JSONModel,
    CalendarLegendItem,
    DateTypeRange,
    unifiedLibrary,
    DateFormat,
    CalendarType,
    AppointmentService,
    DoctorService,
    AvailableService
  ) {
    "use strict";
    let db;
    var base;

    var CalendarDayType = unifiedLibrary.CalendarDayType;
    return Controller.extend("project1.controller.Appointment", {
      onInit: function () {
        base = this;
        base.oModel = this.getOwnerComponent().getModel();
        db = openDatabase("mydb", "1.0", "Test DB", 2 * 1024 * 1024);
        AppointmentService.createTable();
        DoctorService.getDoctors().then((data) => {
          var doctors = [];
          for (var i = 0; i < data.length; i++) {
            doctors.push(data[i]);
          }
          base.oModel.setProperty("/doctors", doctors);
        });

        this.oFormatYyyymmdd = DateFormat.getInstance({
          pattern: "dd.MM.yyyy",
          calendarType: CalendarType.Gregorian,
        });
        base.oModel.setProperty("/selectedDate", []);
      },
      onDoctorChange: function () {
        var selectTime = this.getView().byId("time");
        selectTime.setSelectedKey(null);
        var doctorId = base.oModel.getProperty("/selectedDoctor");
        doctorId = parseInt(doctorId);
        AvailableService.getAvailableDates(doctorId).then((response) => {
          var oCalendar = this.getView().byId("calendar");
          var oLegend = this.getView().byId("legend");
          oCalendar.removeAllSpecialDates();
          oLegend.removeAllItems();
          var availableDates = [];
          for (var i = 0; i < response.length; i++) {
            var date = response[i];
            availableDates.push(date);
          }
          availableDates = availableDates.flat();
          availableDates = availableDates.map((item) => {
            var parts = item.split(".");
            var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
            return mydate;
          });
          for (var i = 0; i < availableDates.length; i++) {
            var oDate = new Date(availableDates[i]);
            var oDateRange = new DateTypeRange({
              startDate: oDate,
              type: CalendarDayType.Type01,
              color: "#957DAD",
            });
            oCalendar.addSpecialDate(oDateRange);
          }
          oLegend.addItem(
            new CalendarLegendItem({
              text: "Available",
              type: CalendarDayType.Type01,
              color: "#957DAD",
            })
          );
        });

        var availableTimes = [];
        AvailableService.getAvailableByDoctor(doctorId).then((response) => {
          var doctor = response[0];
          var availableTime = doctor.time.split(",");
          for (var i = 0; i < availableTime.length; i++) {
            var time = parseInt(availableTime[i]) + 8;
            var id = availableTime[i];
            availableTimes.push({
              id: id,
              time: time + ":00",
            });
          }
          var min;
          for (let i = 0; i < availableTimes.length; i++) {
            min = i;
            for (let j = i + 1; j < availableTimes.length; j++) {
              if (availableTimes[j].id < availableTimes[min].id) {
                min = j;
              }
            }
            var temp = availableTimes[i];
            availableTimes[i] = availableTimes[min];
            availableTimes[min] = temp;
          }

          base.oModel.setProperty("/availableTimes", availableTimes);
        });
      },
      onSubmitAppointment: function () {
        var time = this.getView().byId("time").getSelectedKey();
        var calendar = this.getView().byId("calendar");
        var date = calendar.getSelectedDates()[0].getStartDate();
        date = this.oFormatYyyymmdd.format(date);
        var reason = base.oModel.getProperty("/reason");
        var selectedDoctor = this.getView().byId("doctor").getSelectedKey();
        selectedDoctor = parseInt(selectedDoctor);
        var doctor = this.getView().byId("doctor").getSelectedItem().getText();
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        var appointmentId = Math.floor(Math.random() * 1000000000);
        if (doctor == "" || date == "" || time == "" || reason == "") {
          sap.m.MessageToast.show("Please fill in all the fields");
        } else if (localStorage.getItem("idno") == null) {
          sap.m.MessageToast.show("Please login to make an appointment");
        } else {
          AvailableService.isDateAvailable(selectedDoctor, date).then(
            (response) => {
              if (response == false) {
                sap.m.MessageToast.show("Doctor is not available on this date");
              } else {
                AppointmentService.isAppointmentAvailable(
                  doctor,
                  date,
                  time
                ).then((response) => {
                  if (response == false) {
                    sap.m.MessageToast.show(
                      "Doctor is not available at this time"
                    );
                  } else {
                    AppointmentService.addAppointment(
                      appointmentId,
                      localStorage.getItem("idno"),
                      doctor,
                      date,
                      time,
                      reason
                    );
                    AppointmentService.getAppointmentsByIdNumber(
                      localStorage.getItem("idno")
                    ).then((response) => {
                      var appointments = [];
                      for (var i = 0; i < response.length; i++) {
                        appointments.push(response[i]);
                      }
                      base.oModel.setProperty("/appointments", appointments);
                    });

                    base.oModel.setProperty("/selectedDoctor", null);
                    base.oModel.setProperty("/reason", null);
                    base.oModel.setProperty("/selectedDate", null);
                    base.oModel.setProperty("/availableTimes", null);
                    sap.m.MessageToast.show("Appointment added successfully");
                    setTimeout(function () {
                      sap.m.MessageToast.show("Redirecting to My Appointments");
                    }, 1000);
                    setTimeout(function () {
                      oRouter.navTo("myappointments");
                    }, 2000);
                  }
                });
              }
            }
          );
        }
      },
      handleCalendarSelect: function (oEvent) {
        var selectTime = this.getView().byId("time");
        selectTime.setSelectedKey(null);

        var oCalendar = oEvent.getSource();
        this._updateText(oCalendar);

        var selectedDoctor = base.oModel.getProperty("/selectedDoctor");
        selectedDoctor = parseInt(selectedDoctor);
        var availableTimes = [];
        AvailableService.getAvailableTimes(selectedDoctor).then((response) => {
          if (response.length == 0) {
            sap.m.MessageToast.show("Doctor is not available on this date");
          } else {
            var doctor = response.item(0);
            availableTimes = doctor.time.split(",");
            availableTimes = availableTimes.map((item) => {
              var time = parseInt(item) + 8;
              var id = item;
              return {
                id: id,
                time: time + ":00",
              };
            });
            availableTimes.sort(function (a, b) {
              return a.id - b.id;
            });
            var selectedDate = base.oModel.getProperty("/selectedDate");
            var selectedDoctorName = this.getView()
              .byId("doctor")
              .getSelectedItem()
              .getText();
            var takenTimes = [];
            AppointmentService.getAppointmentsTimeByDoctorAndDate(
              selectedDoctorName,
              selectedDate
            ).then((response) => {
              if (response.length == 0) {
                base.oModel.setProperty("/availableTimes", availableTimes);
              } else {
                var newAvailableTimes = availableTimes;
                for (var i = 0; i < response.length; i++) {
                  takenTimes.push(response[i].time);
                }
                for (let i = 0; i < takenTimes.length; i++) {
                  for (let j = 0; j < newAvailableTimes.length; j++) {
                    if (takenTimes[i] == newAvailableTimes[j].id) {
                      newAvailableTimes.splice(j, 1);
                    }
                  }
                }

                newAvailableTimes.sort(function (a, b) {
                  return a.id - b.id;
                });
                base.oModel.setProperty("/availableTimes", newAvailableTimes);
              }
            });
          }
        });
      },
      _updateText: function (oCalendar) {
        var oText = this.byId("selectedDate"),
          aSelectedDates = oCalendar.getSelectedDates(),
          oDate = aSelectedDates[0].getStartDate();

        oText.setText(this.oFormatYyyymmdd.format(oDate));
        base.oModel.setProperty("/selectedDate", this.oFormatYyyymmdd.format(oDate));
      },
    });
  }
);
