context DATA {

    entity VEHICLE {
        key ID      : Integer;
        MODEL       : String(100) not null;
        BRAND       : String(100) not null;
        COLOR       : String(100);
        TYPE_OF_CAR : Association to TYPE_OF_CAR;
        VIN_NUMBER  : String(100) not null;
        FIRST_USE   : Date;
    }

    entity TYPE_OF_CAR {
        key ID      : Integer;
        CARTYPE     : String(100) not null;
        DOOR_COUNT  : Integer;
    }
}