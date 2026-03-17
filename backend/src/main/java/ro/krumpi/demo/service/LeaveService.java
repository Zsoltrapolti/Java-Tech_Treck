package ro.krumpi.demo.service;

import org.springframework.stereotype.Service;
import ro.krumpi.demo.dto.employee.LeaveRequestDTO;
import ro.krumpi.demo.model.employee.Employee;
import ro.krumpi.demo.model.employee.LeaveRequest;
import ro.krumpi.demo.model.employee.LeaveStatus;
import ro.krumpi.demo.repository.EmployeeRepository;
import ro.krumpi.demo.repository.LeaveRequestRepository;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveService {

    private final LeaveRequestRepository leaveRepository;
    private final EmployeeRepository employeeRepository;

    public LeaveService(LeaveRequestRepository leaveRepository, EmployeeRepository employeeRepository) {
        this.leaveRepository = leaveRepository;
        this.employeeRepository = employeeRepository;
    }

    public LeaveRequest submitLeaveRequest(LeaveRequestDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Angajatul nu a fost găsit!"));

        int requestedDays = (int) ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate()) + 1;

        if (requestedDays <= 0) {
            throw new RuntimeException("Data de sfârșit trebuie să fie după data de început!");
        }

        int remainingDays = employee.getTotalLeaveDays() - employee.getUsedLeaveDays();

        if (requestedDays > remainingDays) {
            throw new RuntimeException("Nu ai suficiente zile! Zile rămase: " + remainingDays);
        }

        LeaveRequest request = LeaveRequest.builder()
                .employee(employee)
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .requestedDays(requestedDays)
                .status(LeaveStatus.PENDING)
                .build();

        return leaveRepository.save(request);
    }

    public void cancelLeaveRequest(Long requestId) {
        LeaveRequest request = leaveRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Cererea nu a fost găsită!"));

        if (request.getStartDate().isBefore(LocalDate.now()) || request.getStartDate().isEqual(LocalDate.now())) {
            throw new RuntimeException("Nu poți anula o cerere care a început deja sau începe azi!");
        }

        if (request.getStatus() == LeaveStatus.APPROVED) {
            Employee employee = request.getEmployee();

            employee.setUsedLeaveDays(employee.getUsedLeaveDays() - request.getRequestedDays());
            employeeRepository.save(employee);
        }

        request.setStatus(LeaveStatus.CANCELLED);
        leaveRepository.save(request);
    }

    public void approveLeaveRequest(Long requestId) {
        LeaveRequest request = leaveRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found!"));

        if (request.getStatus() == LeaveStatus.APPROVED) {
            throw new RuntimeException("This request is already approved!");
        }

        Employee employee = request.getEmployee();

        int remainingDays = employee.getTotalLeaveDays() - employee.getUsedLeaveDays();
        if (request.getRequestedDays() > remainingDays) {
            throw new RuntimeException("Not enough leave days! Remaining: " + remainingDays);
        }

        request.setStatus(LeaveStatus.APPROVED);
        employee.setUsedLeaveDays(employee.getUsedLeaveDays() + request.getRequestedDays());

        employeeRepository.save(employee);
        leaveRepository.save(request);
    }

    public Employee updateTotalDays(Long employeeId, Integer newTotal) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Angajatul nu a fost găsit!"));
        employee.setTotalLeaveDays(newTotal);
        return employeeRepository.save(employee);
    }

    public List<LeaveRequest> getEmployeeRequests(Long employeeId) {
        return leaveRepository.findByEmployeeId(employeeId);
    }

    public List<LeaveRequest> getAllRequests() {
        return leaveRepository.findAll();
    }
}