package ro.krumpi.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import ro.krumpi.demo.model.auth.Role;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.repository.UserAccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import ro.krumpi.demo.model.auth.Role;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.repository.UserAccountRepository;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final RateLimitingFilter rateLimitingFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, RateLimitingFilter rateLimitingFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.rateLimitingFilter = rateLimitingFilter;
    }

    @SuppressWarnings("java:S4502")
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/register").permitAll()
                                .requestMatchers("/api/account-requests/**").permitAll()
                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/employees").authenticated()

                                .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasAnyAuthority("EMPLOYEE", "ADMIN", "ROLE_EMPLOYEE", "ROLE_ADMIN")


                                .requestMatchers(HttpMethod.POST, "/api/products/my-selection").authenticated()
                                .requestMatchers(HttpMethod.GET, "/api/products/my").authenticated()
                                .requestMatchers(HttpMethod.POST, "/api/invoices/checkout").authenticated()


                                .requestMatchers(HttpMethod.GET, "/api/products", "/api/products/**").authenticated()

                                .requestMatchers(HttpMethod.POST, "/api/products/**").hasAnyAuthority("EMPLOYEE", "ADMIN", "ROLE_EMPLOYEE", "ROLE_ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/api/products/**").hasAnyAuthority("EMPLOYEE", "ADMIN", "ROLE_EMPLOYEE", "ROLE_ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasAnyAuthority("EMPLOYEE", "ADMIN", "ROLE_EMPLOYEE", "ROLE_ADMIN")

                                .requestMatchers(HttpMethod.POST, "/api/orders").hasAnyAuthority("USER", "EMPLOYEE", "ADMIN", "ROLE_USER", "ROLE_EMPLOYEE", "ROLE_ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/orders/**").hasAnyAuthority("USER", "EMPLOYEE", "ADMIN", "ROLE_USER", "ROLE_EMPLOYEE", "ROLE_ADMIN")

                                .requestMatchers(HttpMethod.GET, "/api/invoices").hasAnyAuthority("USER", "EMPLOYEE", "ADMIN", "ROLE_USER", "ROLE_EMPLOYEE", "ROLE_ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/invoices/**").hasAnyAuthority("USER", "EMPLOYEE", "ADMIN", "ROLE_USER", "ROLE_EMPLOYEE", "ROLE_ADMIN")
                                .requestMatchers("/api/cart/**", "/api/invoices/**").hasAnyAuthority("USER", "EMPLOYEE", "ADMIN", "ROLE_USER", "ROLE_EMPLOYEE", "ROLE_ADMIN")

                                .requestMatchers("/api/admin/**", "/api/employees/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN")

                                .anyRequest().authenticated()
                        )

                .addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();

        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

}
