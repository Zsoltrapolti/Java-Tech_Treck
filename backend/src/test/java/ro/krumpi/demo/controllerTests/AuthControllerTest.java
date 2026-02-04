//package ro.krumpi.demo.contollerTests;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.context.annotation.Import;
//import org.springframework.http.MediaType;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.test.web.servlet.MockMvc;
//import ro.krumpi.demo.config.JwtService;
//import ro.krumpi.demo.config.TestSecurityConfig;
//import ro.krumpi.demo.controller.AuthController;
//import ro.krumpi.demo.dto.account.RegisterRequestDTO;
//import ro.krumpi.demo.model.auth.Role;
//import ro.krumpi.demo.model.auth.UserAccount;
//import ro.krumpi.demo.service.UserAccountService;
//
//// ✅ EZEKET AZ IMPORTOKAT HASZNÁLD:
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@WebMvcTest(AuthController.class)
//@AutoConfigureMockMvc(addFilters = false)
//@Import(TestSecurityConfig.class)
//class AuthControllerTest {
//
//    @Autowired private MockMvc mockMvc;
//    @MockBean private UserAccountService userService;
//    @MockBean private JwtService jwtService;
//    @MockBean private AuthenticationManager authenticationManager;
//    @Autowired private ObjectMapper objectMapper;
//
//    @Test
//    void register_SikeresRegisztracio() throws Exception {
//        RegisterRequestDTO dto = new RegisterRequestDTO("teszt_elek", "jelszo123");
//        UserAccount savedUser = UserAccount.builder()
//                .id(1L)
//                .username("teszt_elek")
//                .role(Role.USER)
//                .build();
//
//        // ✅ Mockito any() használata a ByteBuddy helyett
//        when(userService.register(any(RegisterRequestDTO.class))).thenReturn(savedUser);
//
//        // ✅ MockMvcRequestBuilders.post használata a MockServerHttpRequest helyett
//        mockMvc.perform(post("/api/auth/register")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(dto)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.username").value("teszt_elek"));
//    }
//}