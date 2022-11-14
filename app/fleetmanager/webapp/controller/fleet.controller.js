sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
],

    function (Controller, Filter, FilterOperator, Fragment, MessageToast) {
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
                    console.log("check");
                    var oBindingContext = oEvent.getSource().getBindingContext();
                oBindingContext.delete();
                    
                }
        });

        return TableController;
    });
