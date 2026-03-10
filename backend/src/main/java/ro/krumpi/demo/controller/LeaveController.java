package ro.krumpi.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.krumpi.demo.dto.employee.LeaveRequestDTO;
import ro.krumpi.demo.model.employee.Employee;
import ro.krumpi.demo.model.employee.LeaveRequest;
import ro.krumpi.demo.service.LeaveService;

import java.util.List;

@RestController
@RequestMapping("/api/leave")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping("/request")
    public ResponseEntity<LeaveRequest> submitRequest(@RequestBody LeaveRequestDTO dto) {
        return ResponseEntity.ok(leaveService.submitLeaveRequest(dto));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveRequest>> getMyRequests(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getEmployeeRequests(employeeId));
    }

    // --- METODA NOUĂ PENTRU MANAGER ---
    @GetMapping("/all")
    public ResponseEntity<List<LeaveRequest>> getAllRequests() {
        return ResponseEntity.ok(leaveService.getAllRequests());
    }

    @PutMapping("/{requestId}/cancel")
    public ResponseEntity<String> cancelRequest(@PathVariable Long requestId) {
        leaveService.cancelLeaveRequest(requestId);
        return ResponseEntity.ok("Cererea a fost anulată cu succes.");
    }

    @PutMapping("/{requestId}/approve")
    public ResponseEntity<String> approveRequest(@PathVariable Long requestId) {
        leaveService.approveLeaveRequest(requestId);
        return ResponseEntity.ok("Cererea a fost aprobată.");
    }

    @PutMapping("/employee/{employeeId}/total-days")
    public ResponseEntity<Employee> updateTotalDays(@PathVariable Long employeeId, @RequestParam Integer newTotal) {
        return ResponseEntity.ok(leaveService.updateTotalDays(employeeId, newTotal));
    }
}