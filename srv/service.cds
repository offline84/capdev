using DATA from '../db/schema';

service FleetService {
        entity Vehicles as projection on DATA.VEHICLE;

        @readonly 
        entity CarTypes as projection on DATA.TYPE_OF_CAR;
}