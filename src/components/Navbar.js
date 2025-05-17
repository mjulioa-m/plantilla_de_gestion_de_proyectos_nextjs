'use client';

import React, { useState } from 'react';
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink } from 'reactstrap';
import { FaHome, FaTasks, FaPlusCircle } from 'react-icons/fa';
const AppNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar expand="md">
      <NavbarBrand href="/">Collabify</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="me-auto" navbar>
          <NavItem>
            <NavLink href="/inicio"><FaHome className="me-2" />Inicio</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/calendar2"><FaTasks className="me-2" />Calendario</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/crear-proyecto"><FaPlusCircle className="me-2" />Crear Proyecto</NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default AppNavbar;
