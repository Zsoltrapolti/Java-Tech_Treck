package ro.krumpi.demo.config;

import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import ro.krumpi.demo.service.RateLimitingService;

import java.io.IOException;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RateLimitingService rateLimitingService;

    public RateLimitingFilter(RateLimitingService rateLimitingService) {
        this.rateLimitingService = rateLimitingService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        if ("POST".equalsIgnoreCase(method)) {
            String clientIp = getClientIP(request);
            Bucket bucket = null;

            if (path.equals("/api/auth/login")) {
                bucket = rateLimitingService.resolveBucket(clientIp + "_login", 5);
            } else if (path.equals("/api/auth/register")) {
                bucket = rateLimitingService.resolveBucket(clientIp + "_register", 2);
            } else if (path.equals("/api/account-requests")) {
                bucket = rateLimitingService.resolveBucket(clientIp + "_acc_req", 2);
            }

            if (bucket != null) {
                if (bucket.tryConsume(1)) {
                    filterChain.doFilter(request, response);
                } else {
                    response.setStatus(429);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"message\": \"Too many requests. Please try again later.\"}");
                }
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}