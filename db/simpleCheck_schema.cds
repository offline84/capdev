using {managed, cuid} from '@sap/cds/common';
context TEST {
    entity SIMPLE_LOG: cuid, managed {
        actionLog : String(50);
    }
}