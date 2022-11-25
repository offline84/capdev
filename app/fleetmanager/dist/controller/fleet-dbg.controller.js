sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/Dialog",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "../utils/validator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat"
],

    function (Controller, Filter, FilterOperator, Dialog, Fragment, MessageToast, MessageBox, validator, JSONModel, DateFormat) {
        "use strict";

        var TableController = Controller.extend("fleetmanager.controller.fleet", {

            onInit() {
                var vehicleModel = {
                    VIN_NUMBER: "",
                    BRAND: "",
                    MODEL: "",
                    COLOR: "",
                    TYPE_OF_CAR_ID: 0,
                    FIRST_USE: null
                }
                var oModel = new JSONModel(vehicleModel);
                this.getView().setModel(oModel, "vehicleModel");

                var vehicleInputState = {
                    VIN_NUMBER_STATE_TEXT: "",
                    VIN_NUMBER_STATE: "None",
                    BRAND_STATE_TEXT: "",
                    BRAND_STATE: "None",
                    MODEL_STATE_TEXT: "",
                    MODEL_STATE: "None"
                }
                var oStateModel = new JSONModel(vehicleInputState);
                this.getView().setModel(oStateModel, "vehicleStateModel");

                var dateModel = {
                    maxDate: new Date()
                }

                var oDateModel = new JSONModel(dateModel);
                this.getView().setModel(oDateModel, "dateModel");

                var editableInput = {
                    VIN_NUMBER: false,
                    BRAND: false,
                    MODEL: false,
                    COLOR: false,
                    TYPE_OF_CAR: false,
                    FIRST_USE: false
                }
                var oEditModel = new JSONModel(editableInput);
                this.getView().setModel(oEditModel, "editableInput")

            },

            onSearch: function (oEvent) {
                var searchQuery = oEvent.getSource().getValue();

                if (searchQuery || searchQuery == "") {
                    var filter = new Filter({
                        filters: [
                            new Filter({ path: "MODEL", operator: FilterOperator.Contains, value1: searchQuery, caseSensitive: false }, FilterOperator.Contains, searchQuery),
                            new Filter({ path: "BRAND", operator: FilterOperator.Contains, value1: searchQuery, caseSensitive: false }, FilterOperator.Contains, searchQuery),
                            new Filter({ path: "COLOR", operator: FilterOperator.Contains, value1: searchQuery, caseSensitive: false }, FilterOperator.Contains, searchQuery),
                            new Filter({ path: "TYPE_OF_CAR/CARTYPE", operator: FilterOperator.Contains, value1: searchQuery, caseSensitive: false }, FilterOperator.Contains, searchQuery),
                            new Filter({ path: "VIN_NUMBER", operator: FilterOperator.Contains, value1: searchQuery, caseSensitive: false }, FilterOperator.Contains, searchQuery),
                        ]
                    });
                    var oList = this.byId("fleetmanagerTable");
                    var oBinding = oList.getBinding("items");
                    oBinding.filter(filter, "Application");
                }

            },

            onPressNewVehicleButton: function () {
                if (!this.oDialog) {
                    this.oDialog = this.loadFragment({
                        name: "fleetmanager.fragment.newVehicleDialog"
                    });
                }
                this.oDialog.then(function (dialog) {
                    dialog.open();
                });
            },

            /**
             *  To add a vehicle, we call the model set in the the view and insert this in vehicleModel.
             *  With that vehicleModel we do an insert into the database. 
             */
            onSubmitPressed: function () {

                var oModel = this.getView().getModel("vehicleModel");
                let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
                var date = null;
                if (oModel.getProperty("/FIRST_USE")) {
                    date = oDateFormat.format(oModel.getProperty("/FIRST_USE"));
                }
                let id = oModel.getProperty("/TYPE_OF_CAR");

                var addVehicleModel = {
                    MODEL: oModel.getProperty("/MODEL"),
                    BRAND: oModel.getProperty("/BRAND"),
                    COLOR: oModel.getProperty("/COLOR"),
                    TYPE_OF_CAR_ID: oModel.getProperty("/TYPE_OF_CAR"),
                    VIN_NUMBER: oModel.getProperty("/VIN_NUMBER"),
                    FIRST_USE: date
                }

                var oBindingContext = this.getView().byId("fleetmanagerTable").getBinding("items");

                if (addVehicleModel.VIN_NUMBER != "" && addVehicleModel.MODEL != "" && addVehicleModel.BRAND != "") {
                    try {
                        oBindingContext.create(addVehicleModel);
                    } catch (error) {
                        MessageBox.error("An error has occured during creation of the new Vehicle: /n", error);
                    }
                    this.byId("newVehicleDialog").close();

                    // reset values of vehiclemodel
                    for (const [key, value] of Object.entries(addVehicleModel)) {
                        if (key == "FIRST_USE") {
                            oModel.setProperty("/" + key, null);
                        }
                        else oModel.setProperty("/" + key, "");
                    }
                }
                else MessageBox.warning("New vehicle contains invalid fields!");
            },
            onChangeVinNumber: function (oEvent) {
                var sMessage = validator.validateVinNumber(oEvent.getParameter("value"));
                this.getView().getModel("vehicleStateModel").setProperty("/VIN_NUMBER_STATE", sMessage ? "Error" : "None");
                this.getView().getModel("vehicleStateModel").setProperty("/VIN_NUMBER_STATE_TEXT", sMessage ? sMessage : null);
            },

            /**
             * liveChange eventhandler for input vehicleModel.MODEL
             */
            onChangeModel: function (oEvent) {
                var sMessage = validator.validateModel(oEvent.getParameter("value"));
                this.getView().getModel("vehicleStateModel").setProperty("/MODEL_STATE", sMessage ? "Error" : "None");
                this.getView().getModel("vehicleStateModel").setProperty("/MODEL_STATE_TEXT", sMessage ? sMessage : null);
            },

            onChangeBrand: function (oEvent) {
                var sMessage = validator.validateModel(oEvent.getParameter("value"));
                this.getView().getModel("vehicleStateModel").setProperty("/BRAND_STATE", sMessage ? "Error" : "None");
                this.getView().getModel("vehicleStateModel").setProperty("/BRAND_STATE_TEXT", sMessage ? sMessage : null);
            },

            onNewVehicleDialogCancelled: function () {
                this.byId("newVehicleDialog").close();
                MessageToast.show("No vehicle was added");
            },

            onDeleteSingleVehiclePressed: function (oEvent) {
                var oBindingContext = oEvent.getSource().getBindingContext();
                var oBindingContextObject = oBindingContext.getObject();
                MessageBox.warning("Are you sure you want to delete vehicle " + oBindingContextObject.BRAND + " " + oBindingContextObject.MODEL + "?", {
                    actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.DELETE,
                    onClose: function (sAction) {
                        if (sAction === "DELETE") {
                            oBindingContext.delete();
                            if (!oBindingContext.hasPendingChanges()) {
                                MessageToast.show("Vehicle was successfully deleted");
                            }
                        }
                    }
                });
                this._ViewDetailsDialog.close();
            },

            onShowDetailsSingleVehiclePressed: function (oEvent) {
                if (!this._ViewDetailsDialog) {
                    this.viewDetailsDialog = "detailsVehicleDialog";
                    this._ViewDetailsDialog = new sap.ui.xmlfragment(this.viewDetailsDialog, "fleetmanager.fragment.detailsVehicleDialog", this);
                    this.getView().addDependent(this._ViewDetailsDialog);
                }

                var oCtx = oEvent.getSource().getBindingContext();
                let oObj = oCtx.getObject();
                
                //setting the date in correct format for datepicker, if date is null, do nothing (else = 1 jan. 1970 )
                let date = oObj.FIRST_USE;
                if (date) {
                    oObj.FIRST_USE = new Date(date);
                }

                //setting typeID if not null
                if (oObj.TYPE_OF_CAR) {
                    oObj.TYPE_OF_CAR_ID = oObj.TYPE_OF_CAR.ID;
                }
                else oObj.TYPE_OF_CAR_ID = 0;

                var oModel = new JSONModel(oObj);
                this._ViewDetailsDialog.setBindingContext(oCtx);
                this._ViewDetailsDialog.setModel(oModel, "detailsVehicleModel");

                // Define which field should be editable
                let editableMode = this.getView().getModel("editableInput");
                for (const [key, value] of Object.entries(oObj)) {
                    if (value == "" || value == null) {
                        editableMode.setProperty("/" + key, true);
                    }
                    else {
                        editableMode.setProperty("/" + key, false);
                    }
                }

                this._ViewDetailsDialog.open();
            },

            onDetailsVehicleDialogClosePressed: function () {
                this._ViewDetailsDialog.close();
            },

            onEditVehiclePressed: function (oEvent) {
                var oBindingContext = oEvent.getSource().getBindingContext();
                var oDetailsModel = this._ViewDetailsDialog.getModel("detailsVehicleModel");
                var oObj = oBindingContext.getObject();

                //converts the date of oDetailsModel to string;
                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
                if(typeof(oDetailsModel.getProperty("/FIRST_USE")) !== 'string'){
                    var date;
                    
                    if (oDetailsModel.getProperty("/FIRST_USE")) {
                        date = oDateFormat.format(oDetailsModel.getProperty("/FIRST_USE"));
                        oDetailsModel.setProperty("/FIRST_USE", date);
                    }
                }

                 //setting typeID if not null
                 if (oObj.TYPE_OF_CAR) {
                    oObj.TYPE_OF_CAR_ID = oObj.TYPE_OF_CAR.ID;
                }
                else oObj.TYPE_OF_CAR_ID = 0;

                let updateDictionary = [];
                for (const [key, value] of Object.entries(oObj)) {
                    if(key != "TYPE_OF_CAR"){
                        let propertyvalue = oDetailsModel.getProperty("/" + key);

                        if (propertyvalue != value) {
                            if(key == "FIRST_USE"){
                                date = oDateFormat.format(value);
                                if(propertyvalue != date){
                                    updateDictionary.push({path: key, data: propertyvalue});
                                }
                            }
                            else updateDictionary.push({path: key, data: propertyvalue});
                        }
                    }
                }
                
                updateDictionary.forEach(entry => {
                    try{
                        oBindingContext.setProperty(entry.path, entry.data);
                    }
                    catch(error){
                        MessageBox.error("Updating vehicle encountered an error: /n" + error);
                    }
                });

                if(oDetailsModel.getProperty("/FIRST_USE")){
                    oDetailsModel.setProperty("/FIRST_USE", new Date(oDetailsModel.getProperty("/FIRST_USE")));
                }

            }
        });

        return TableController;
    });
