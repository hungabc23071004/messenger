package Messenger.demo.constant;

import org.springframework.beans.factory.annotation.Value;

public class MinIOPrefixUrl {
    @Value("${minio.public-bucket}")
    private static String publicBucket;

    public static final String MINIO_URL = "http://localhost:9000/"+publicBucket+"/";

    private MinIOPrefixUrl() {
    }

}
