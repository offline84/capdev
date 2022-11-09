using DATA from '../db/schema';
using CV_VEHICLE from '../db/schema'; 

service FleetService {
        entity Vehicles as projection on DATA.VEHICLE;

        @readonly
        entity ViewVehicles as projection on CV_VEHICLE
}