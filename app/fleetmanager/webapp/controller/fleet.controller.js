sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/Dialog",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
],

    function (Controller, Filter, FilterOperator, Dialog, Fragment, MessageToast, MessageBox, JSONModel) {
        "use strict";

        var TableController = Controller.extend("fleetmanager.controller.fleet", {

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
                if (!this.pDialog) {
                    var vehicleModel = {
                        MODEL: "",
                        BRAND: "",
                        COLOR: "",
                        TYPoModelE_OF_CAR: "",
                        VIN_NUMBER: "",
                        //FIRST_USE: ""
                    }
                    var oEntry = new JSONModel(vehicleModel);
                    this.getView().setModel(oEntry,"addVehicleModel");

                    this.pDialog = this.loadFragment({
                        name: "fleetmanager.fragment.newVehicleDialog"
                    });
                }
                this.pDialog.then(function (oDialog) {
                    oDialog.open();
                    this.getValidationOnScreen(this.getView);
                });
            },

            /**
             *  To add a vehicle, we call the model set in the the view and insert this in vehicleModel.
             *  With that vehicleModel we do an insert into the database. 
             */
            onSubmitPressed: function () {

                var oModel = this.getView().getModel("addVehicleModel");

                var vehicleModel = {
                    MODEL: oModel.oData.MODEL,
                    BRAND: oModel.oData.BRAND,
                    COLOR: oModel.oData.COLOR,
                    TYPE_OF_CAR: oModel.oData.TYPE_OF_CAR,
                    VIN_NUMBER: oModel.oData.VIN_NUMBER,
                    FIRST_USE: oModel.oData.FIRST_USE
                }

                var oBindingContext = this.getView().byId("fleetmanagerTable").getBinding("items");
                debugger;
                oBindingContext.create(vehicleModel);
                this.byId("newVehicleDialog").close();
            },

            getValidationOnScreen: function (oView) {
                debugger;
                var oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
                var oMessageManager = sap.ui.getCore().getMessageManager().registerObject(oView, true);

                oMessageManager.registerMessageProcessor(oMessageProcessor);

                oMessageManager.addMessages(
                    new sap.ui.core.message.Message({
                        message: "Vin-numbers need to be 17 characters long, last 4 are numbers",
                        type: sap.ui.core.MessageType.Error,
                        target: "vinNumberInput/value",
                        processor: oMessageProcessor
                     })
                );
            },

            onNewVehicleDialogCancelled: function () {
                this.byId("newVehicleDialog").close();
                MessageToast.show("No vehicle was added");
            },

            onDeleteSingleVehiclePressed: function (oEvent) {
                var oBindingContext = oEvent.getSource().getBindingContext();

                var oBindingContextObject = oEvent.getSource().getBindingContext().getObject();
                MessageBox.warning("Are you sure you want to delete vehicle " + oBindingContextObject.BRAND + " " + oBindingContextObject.MODEL +"?", {
                    actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.DELETE,
                    onClose: function (sAction) {
                        if (sAction === "DELETE") {
                            oBindingContext.delete();
                            if(!oBindingContext.hasPendingChanges()){
                                MessageToast.show("Vehicle was successfully deleted");
                            }
                        }
                    }
                });
            },

    
        });

        return TableController;
    });
