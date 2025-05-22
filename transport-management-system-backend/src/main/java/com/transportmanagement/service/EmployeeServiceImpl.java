package com.transportmanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.transportmanagement.dao.EmployeeDao;
import com.transportmanagement.entity.Employee;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeDao employeeDao;

    @Override
    public Employee createEmployee(Employee employee) {
        return employeeDao.save(employee);
    }

    @Override
    public Employee updateEmployee(Employee employee) {
        return employeeDao.save(employee);
    }

    @Override
    public void deleteEmployee(int id) {
        employeeDao.deleteById(id);
    }

    @Override
    public Employee getEmployeeById(int id) {
        return employeeDao.findById(id).orElse(null);
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeDao.findAll();
    }
}

