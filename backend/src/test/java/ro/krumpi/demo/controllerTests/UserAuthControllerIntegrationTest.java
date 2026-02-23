//package ro.krumpi.demo.contollerTests;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.MediaType;
//import org.springframework.test.context.ActiveProfiles;
//import org.springframework.test.web.servlet.MockMvc;
//
//import static org.hamcrest.Matchers.is;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@SpringBootTest(properties = {
//        "spring.datasource.url=jdbc:h2:mem:authdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL",
//        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
//        "spring.jpa.hibernate.ddl-auto=create-drop",
//        "spring.flyway.enabled=false"
//})
//@AutoConfigureMockMvc(addFilters = false)
//@ActiveProfiles("test")
//class UserAuthControllerIntegrationTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @Test
//    void registerUser_shouldReturnSuccessMessage() throws Exception {
//        String userJson = """
//        {
//            "username": "andreea_new",
//            "password": "plainPassword",
//            "role": "USER"
//        }
//        """;
//
//        mockMvc.perform(post("/api/auth/register")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(userJson))
//                .andExpect(status().isOk())
//
//                .andExpect(jsonPath("$.message", is("User created")));
//    }
//
//    @Test
//    void registerUser_shouldReturnConflict_whenUsernameAlreadyExists() throws Exception {
//        String userJson = """
//        {
//            "username": "duplicate_user",
//            "password": "password123",
//            "role": "USER"
//        }
//        """;
//
//        mockMvc.perform(post("/api/auth/register")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(userJson));
//
//        mockMvc.perform(post("/api/auth/register")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(userJson))
//                .andExpect(status().isConflict())
//                .andExpect(jsonPath("$.message", is("Username already exists")));
//    }
//
//    @Test
//    void registerUser_shouldReturnBadRequest_whenRoleIsInvalid() throws Exception {
//        String userJson = """
//        {
//            "username": "bad_role_user",
//            "password": "password123",
//            "role": "SUPER_ADMIN"
//        }
//        """;
//
//        mockMvc.perform(post("/api/auth/register")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(userJson))
//                .andExpect(status().isBadRequest())
//                .andExpect(jsonPath("$.message", is("Invalid role")));
//    }
//}