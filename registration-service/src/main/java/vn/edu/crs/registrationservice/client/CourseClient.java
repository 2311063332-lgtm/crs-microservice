package vn.edu.crs.registrationservice.client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class CourseClient {
    private final RestTemplate restTemplate;

    @Value("${course-service.base-url}")
    private String courseServiceBaseUrl;

    @Value("${internal.api-key}")
    private String internalApiKey;

    private HttpEntity<Void> internalRequest() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Internal-API-Key", internalApiKey);
        return new HttpEntity<>(headers);
    }

    public void reserveSeat(Long courseId) {
        String url = courseServiceBaseUrl + "/api/internal/courses/" + courseId + "/reserve-seat";
        try {
            restTemplate.exchange(url, HttpMethod.PATCH, internalRequest(), Void.class);
        } catch (HttpClientErrorException.Conflict e) {
            throw new IllegalStateException("Mon hoc da het cho");
        } catch (HttpClientErrorException.NotFound e) {
            throw new IllegalStateException("Mon hoc khong ton tai");
        } catch (HttpServerErrorException | ResourceAccessException e) {
            throw new IllegalStateException("Khong the ket noi toi course-service, vui long thu lai sau");
        }
    }

    public void releaseSeat(Long courseId) {
        String url = courseServiceBaseUrl + "/api/internal/courses/" + courseId + "/release-seat";
        try {
            restTemplate.exchange(url, HttpMethod.PATCH, internalRequest(), Void.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new IllegalStateException("Mon hoc khong ton tai");
        } catch (HttpServerErrorException | ResourceAccessException e) {
            throw new IllegalStateException("Khong the ket noi toi course-service, vui long thu lai sau");
        }
    }
}
