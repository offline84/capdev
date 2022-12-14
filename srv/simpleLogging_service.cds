using TEST from '../db/simpleCheck_schema';

service simpleLoggingService {
    entity LOG as projection on TEST.SIMPLE_LOG;
}