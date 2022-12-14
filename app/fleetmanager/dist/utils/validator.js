sap.ui.define([],function(){"use strict";return{validateVinNumber(e){const r=new RegExp("[A-Ha-hJ-Nj-nPR-Zr-z0-9]{13}[0-9]{4}");var i=r.test(e);if(e.trim().length==0){return"VIN number is a required field"}if(!i){return"The VIN number is incorrect"}},validateModel(e){if(e.trim().length==0){return"Model is a required field"}},validateBrand(e){if(e.trim().length==0){return"Brand is a required field"}},validateDate(e){if(e>Date.now()){return"Date of first use can't be in the future"}}}});