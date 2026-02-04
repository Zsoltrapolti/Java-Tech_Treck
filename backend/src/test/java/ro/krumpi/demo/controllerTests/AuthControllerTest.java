//package ro.krumpi.demo.controllerTests;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.test.web.servlet.MockMvc;
//import ro.krumpi.demo.config.JwtAuthenticationFilter;
//import ro.krumpi.demo.config.RateLimitingFilter;
//import ro.krumpi.demo.controller.AuthController;
//import ro.krumpi.demo.service.UserAccountService;
//
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@WebMvcTest(AuthController.class)
//@AutoConfigureMockMvc(addFilters = false)
//class AuthControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private UserAccountService userAccountService;
//
//    @MockBean
//    private AuthenticationManager authenticationManager;
//
//    @MockBean
//    private JwtAuthenticationFilter jwtAuthenticationFilter;
//
//    @MockBean
//    private RateLimitingFilter rateLimitingFilter;
//
//    @Test
//    void login_ShouldReturn200() throws Exception {
//        String loginJson = "{\"username\":\"admin\", \"password\":\"password\"}";
//
//        mockMvc.perform(post("/api/auth/login")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(loginJson))
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    void register_ShouldReturn200() throws Exception {
//        String registerJson = "{\"username\":\"newuser\", \"password\":\"password\", \"email\":\"test@test.com\"}";
//
//        mockMvc.perform(post("/api/auth/register")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(registerJson))
//                .andExpect(status().isOk());
//    }
//}