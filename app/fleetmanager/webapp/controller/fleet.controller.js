sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
],

    function (Controller, Filter, FilterOperator) {
        "use strict";

        var TableController = Controller.extend("sap.m.sample.TableAlternateRowColors.Table", {

            onSearch: function (oEvent){
                var searchQuery = oEvent.getSource().getValue();

                if (searchQuery) {
                    var filter = new Filter({
                        filters: [
                            new Filter ("MODEL", FilterOperator.Contains, searchQuery),
                            new Filter("BRAND", FilterOperator.Contains, searchQuery),
                            new Filter("COLOR", FilterOperator.Contains, searchQuery),
                            new Filter("TYPE_OF_CAR", FilterOperator.Contains, searchQuery)
                        ]
                    });
                    var oList = this.byId("fleetmanagerTable");
                    var oBinding = oList.getBinding("items");
                    oBinding.filter(filter, "Application");
                }
                
            }
    
        });

        return TableController;
    });
