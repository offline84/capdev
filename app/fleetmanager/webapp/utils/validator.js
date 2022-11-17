sap.ui.define([], function () {
    "use strict";
    return {
        /**
         * @variables regExVin => regular expression that searches if the string:
         *   -is 17 characters long 
         *   -doesn't contain I or Q 
         *   -contains 4 numbers at the very end of the string
         * @param {String} vin : the value of the input of a VIN number
         * @returns {String} a message that tells where the validation failed
         */
        validateVinNumber(vin) {
            const regExVin = new RegExp('[A-Ha-hJ-Nj-nPR-Zr-z0-9]{13}[0-9]{4}');
            var isVinNumber = regExVin.test(vin);
            
            if(vin.trim().length == 0){
                return "VIN number is a required field";
            }
            
            if(!isVinNumber){
                return "The VIN number is incorrect";
            }

        },

        validateModel(model){
            if(model.trim().length == 0){
                return "Model is a required field";
            }
        },

        validateBrand(brand){
            if(brand.trim().length == 0){
                return "Brand is a required field";
            }
        },

        validateDate(date){
            if(date > Date.now()){
                return "Date of first use can't be in the future"
            }
        }
    };
});

