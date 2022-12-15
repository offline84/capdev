using TEST from '../db/simpleCheck_schema';

@(requires: 'system-user')
service simpleLoggingService {
    entity LOG as projection on TEST.SIMPLE_LOG;

    function postLog @(restrict : [{
                grant : 'READ',
                to    : 'jobscheduler'
        }])() returns String;
}