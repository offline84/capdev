sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/Dialog",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "../utils/validator",
    "sap/ui/model/json/JSONModel"
],

    function (Controller, Filter, FilterOperator, Dialog, Fragment, MessageToast, MessageBox, validator, JSONModel) {
        "use strict";

        var TableController = Controller.extend("fleetmanager.controller.fleet", {

            onInit(){
                var vehicleModel = {
                    MODEL: "",
                    BRAND: "",
                    COLOR: "",
                    TYPE_OF_CAR: "",
                    VIN_NUMBER: "",
                    FIRST_USE: null
                }
                var oModel = new JSONModel(vehicleModel);
                this.getView().setModel(oModel, "vehicleModel");

                var vehicleInputState = {
                    MODEL_STATE_TEXT: "",
                    MODEL_STATE: "None",
                    BRAND_STATE_TEXT: "",
                    BRAND_STATE: "None",
                    TYPE_OF_CAR_STATE_TEXT: "",
                    TYPE_OF_CAR_STATE: "None",
                    VIN_NUMBER_STATE_TEXT: "",
                    VIN_NUMBER_STATE: "None",
                    //FIRST_USE_STATE_TEXT: "",
                    //FIRST_USE_STATE: "None",
                }
                var oStateModel = new JSONModel(vehicleInputState);
                this.getView().setModel(oStateModel, "vehicleStateModel");

            },

            onSearch: function (oEvent) {
                var searchQuery = oEvent.getSource().getValue();

                if (searchQuery || searchQuery == "") {
                    var filter = new Filter({
                        filters: [
                            new Filter({ path: "MODEL", operator: FilterOperator.Contains, value1: searchQuery, caseSensitive: false }, FilterOperator.Contains, searchQuery),
                            new Filter({ path: "BRAND", operator: FilterOperator.Contains, value1: searchQuery, caseSensitive: false }, FilterOperator.Contains, searchQuery),
                            new Filter({ path: "COLOR", operator: FilterOperator.Contains, value1: searchQuery, caseSensitive: false }, FilterOperator.Contains, searchQuery),
                            new Filter({ path: "TYPE_OF_CAR", operator: FilterOperator.Contains, value1: searchQuery, caseSensitive: false }, FilterOperator.Contains, searchQuery),
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

                var addVehicleModel = {
                    MODEL: oModel.oData.MODEL,
                    BRAND: oModel.oData.BRAND,
                    COLOR: oModel.oData.COLOR,
                    TYPE_OF_CAR: oModel.oData.TYPE_OF_CAR,
                    VIN_NUMBER: oModel.oData.VIN_NUMBER,
                    FIRST_USE: oModel.oData.FIRST_USE
                }
                debugger;
                var oBindingContext = this.getView().byId("fleetmanagerTable").getBinding("items");

                if (addVehicleModel.VIN_NUMBER != "" && addVehicleModel.MODEL != "" && addVehicleModel.BRAND != "") {
                    try {
                        oBindingContext.create(addVehicleModel);
                    } catch (error) {
                        MessageBox.error("An error has occured during creation of the new Vehicle: /n", error);
                    }
                    this.byId("newVehicleDialog").close();
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

            onShowDetailsSingleVehiclePressed: function(oEvent){
                if(!this._ViewDetailsDialog){
                    this.viewDetailsDialog = "detailsVehicleDialog";
                    this._ViewDetailsDialog= new sap.ui.xmlfragment(this.viewDetailsDialog, "fleetmanager.fragment.detailsVehicleDialog", this);
                    this.getView().addDependent(this._ViewDetailsDialog);
                }
              
                var oCtx = oEvent.getSource().getBindingContext();
                var oModel = new JSONModel(oCtx.getObject());
                this._ViewDetailsDialog.setBindingContext(oCtx);
                this._ViewDetailsDialog.setModel(oModel,"detailsVehicleModel");

                this._ViewDetailsDialog.open();
            }

        });

        return TableController;
    });
