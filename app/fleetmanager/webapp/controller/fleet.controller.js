sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/Dialog",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
],

    function (Controller, Filter, FilterOperator, Dialog, Fragment, MessageToast,  JSONModel) {
        "use strict";

        var TableController = Controller.extend("fleetmanager.controller.fleet", {

            

            onSearch: function (oEvent){
                var searchQuery = oEvent.getSource().getValue();

                if (searchQuery || searchQuery == "") {
                    var filter = new Filter({
                        filters: [
                            new Filter ({path: "MODEL", operator: FilterOperator.Contains, value1: searchQuery, caseSensitive: false}, FilterOperator.Contains, searchQuery),
                            new Filter ({path: "BRAND", operator: FilterOperator.Contains, value1: searchQuery, caseSensitive: false}, FilterOperator.Contains, searchQuery),
                            new Filter ({path: "COLOR", operator: FilterOperator.Contains, value1: searchQuery, caseSensitive: false}, FilterOperator.Contains, searchQuery),
                            new Filter ({path: "TYPE_OF_CAR", operator: FilterOperator.Contains, value1: searchQuery, caseSensitive: false}, FilterOperator.Contains, searchQuery),
                        ]
                    });
                    var oList = this.byId("fleetmanagerTable");
                    var oBinding = oList.getBinding("items");
                    oBinding.filter(filter, "Application");
                }
                
            },

            onPressNewVehicleButton: function () {
                if(!this.pDialog){
                    this.pDialog = this.loadFragment({
                        name: "fleetmanager.fragment.newVehicleDialog"
                    });
                }
                this.pDialog.then(function(oDialog) {
                    oDialog.open();
                });
            },
                onSubmitPressed: function (){
                    
                    var oEntry = {
                        MODEL: this.byId("modelInput").getValue(),
                        BRAND: this.byId("brandInput").getValue(),
                        COLOR: this.byId("colorInput").getValue(),
                        TYPE_OF_CAR: this.byId("tocInput").getValue(),
                        VIN_NUMBER: this.byId("vinNumberInput").getValue(),
                        //FIRST_USE: this.byId("dateOfFirstUse").getValue()
                    }

                    var oBindingContext =this.getView().byId("fleetmanagerTable").getBinding("items");
                    oBindingContext.create(oEntry);
                },

                onNewVehicleDialogCancelled: function () {
                    this.byId("newVehicleDialog").close();
                    MessageToast.show("No vehicle was added");
                },

                onDeleteSingleVehiclePressed: function (oEvent) {
                    var oBindingContext = oEvent.getSource().getBindingContext();
                    var oBindingContextObject = oEvent.getSource().getBindingContext().getObject();
                    var oModelForDeletion = new JSONModel(oBindingContextObject);
                    this.getView().setModel(oModelForDeletion,"vehicle_model");
                    if (!this.pDeleteVehicleDialog) {
                        this.pDeleteVehicleDialog= this.loadFragment({name: "fleetmanager.fragment.deleteVehicleConfirmDialog"});
                    }
                    this.pDeleteVehicleDialog.then(function(oDialog) {
                        oDialog.open();
                    });
                },

                deleteVehicle: function (oEvent){
                    this.getView().getModel();
                    var oBindingContext = oEvent.getSource().getBindingContext();
                                    oBindingContext.delete();
                                    MessageToast.show("vehicle deleted!");
                                    this.oApproveDialog.close();
                }
        });

        return TableController;
    });
