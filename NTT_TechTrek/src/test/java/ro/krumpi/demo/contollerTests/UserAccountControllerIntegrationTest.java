package ro.krumpi.demo.contollerTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import ro.krumpi.demo.config.TestSecurityConfig;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.repository.UserAccountRepository;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:userauthdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",

        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",

        "spring.jpa.hibernate.ddl-auto=create-drop",

        "spring.flyway.enabled=false",

        "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration"
})
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
class UserAccountControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Test
    void testCreateUserEndpoint() throws Exception {
        String userJson = """
        {
            "username": "krumpi_user",
            "password": "JavaTechTrek",
            "role": "USER"
        }
        """;

        System.out.println(userJson);
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("krumpi_user"));
    }

    @Test
    void testDeleteUserEndpoint() throws Exception {
        UserAccount user = userAccountRepository.save(new UserAccount(null, "deleteMe", "pass", "USER"));

        mockMvc.perform(delete("/api/auth/user/{id}", user.getId()))
                .andExpect(status().isNoContent());

        assert(!userAccountRepository.existsById(user.getId()));

}
}