using DATA from '../db/schema';

service FleetService {
        entity Vehicle as projection on DATA.VEHICLE;
}