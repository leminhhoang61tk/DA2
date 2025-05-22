package com.transportmanagement.service;

import java.util.List;

import com.transportmanagement.entity.Employee;

public interface EmployeeService {
    Employee createEmployee(Employee employee);
    Employee updateEmployee(Employee employee);
    void deleteEmployee(int id);
    Employee getEmployeeById(int id);
    List<Employee> getAllEmployees();
}

