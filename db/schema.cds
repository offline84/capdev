context DATA {

    entity VEHICLE {
        key ID      : Integer;
        MODEL       : String(100);
        BRAND       : String(100);
        COLOR       : String(100);
        TYPE_OF_CAR : String(100);
        VIN_NUMBER  : String(100);
        FIRST_USE   : Date;
    }
}
@cds.persistence.exists 
@cds.persistence.calcview 
Entity ![CV_VEHICLE] {
key     ![ID]: Integer  @title: 'ID: ID' ; 
        ![BRAND]: String(100)  @title: 'BRAND: BRAND' ; 
        ![MODEL]: String(100)  @title: 'MODEL: MODEL' ; 
        ![COLOR]: String(100)  @title: 'COLOR: COLOR' ; 
        ![TYPE_OF_CAR]: String(100)  @title: 'TYPE_OF_CAR: TYPE_OF_CAR' ; 
}