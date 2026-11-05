-- =============================================================================
-- Unified Farm Inventory & Operations Management System
-- Relational Database Schema DDL (ANSI SQL / PostgreSQL / MySQL 8.0+)
-- Conforming to BUCT Chapter 7 (Data Dictionaries & Database Design)
-- Author: Nijat Alisoy | Systems Analysis and Design
-- =============================================================================

CREATE DATABASE IF NOT EXISTS farm_inventory_ops;
USE farm_inventory_ops;

-- -------------------------------------------------------------
-- Table: system_roles (T01_ROLES)
-- Data Store: D1.1 | System RBAC role definitions, privileges, and authorization clearance levels.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_roles (
    role_id VARCHAR(36) NOT NULL,
    role_name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NULL DEFAULT NULL,
    permission_level INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_system_roles PRIMARY KEY (role_id)
);

-- -------------------------------------------------------------
-- Table: user_accounts (T02_USERS)
-- Data Store: D1 | Central authentication identities, user credentials, contact details, and role assignments (DFD Data Store D1).
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_accounts (
    user_id VARCHAR(36) NOT NULL,
    role_id VARCHAR(36) NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(30) NULL DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at DATETIME NULL DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_user_accounts PRIMARY KEY (user_id),
    CONSTRAINT fk_user_accounts_role_id FOREIGN KEY (role_id) REFERENCES system_roles(role_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- -------------------------------------------------------------
-- Table: plot_fields (T03_PLOTS)
-- Data Store: D3.1 | Geographical farm land parcels, soil profiles, acreage, and active agricultural crop occupancy.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS plot_fields (
    plot_id VARCHAR(36) NOT NULL,
    plot_name VARCHAR(100) NOT NULL,
    acreage DECIMAL(8,2) NOT NULL,
    soil_type VARCHAR(50) NULL DEFAULT NULL,
    gps_polygon TEXT NULL DEFAULT NULL,
    current_crop VARCHAR(50) NULL DEFAULT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_plot_fields PRIMARY KEY (plot_id)
);

-- -------------------------------------------------------------
-- Table: storage_locations (T04_LOCATIONS)
-- Data Store: D2.1 | Physical storage infrastructure including silos, warehouses, chemical bunkers, cold stores, and bin partitions.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS storage_locations (
    location_id VARCHAR(36) NOT NULL,
    facility_name VARCHAR(100) NOT NULL,
    zone_code VARCHAR(30) NOT NULL,
    storage_type VARCHAR(50) NOT NULL,
    max_capacity DECIMAL(12,2) NOT NULL,
    current_occupancy DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    is_temperature_ctrl BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_storage_locations PRIMARY KEY (location_id)
);

-- -------------------------------------------------------------
-- Table: equipment_assets (T05_EQUIPMENT)
-- Data Store: D5 | Agricultural machinery, tractors, combine harvesters, irrigation pumps, and fleet implements (DFD Data Store D5).
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS equipment_assets (
    asset_id VARCHAR(36) NOT NULL,
    asset_name VARCHAR(100) NOT NULL,
    serial_number VARCHAR(50) NOT NULL,
    maintenance_interval_hrs INT NOT NULL DEFAULT 250,
    hours_operated DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    last_service_date DATE NULL DEFAULT NULL,
    operational_status VARCHAR(30) NOT NULL DEFAULT 'OPERATIONAL',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_equipment_assets PRIMARY KEY (asset_id)
);

-- -------------------------------------------------------------
-- Table: suppliers (T06_SUPPLIERS)
-- Data Store: D7 | Commercial vendors, seed breeders, fertilizer manufacturers, and equipment part providers (DFD Data Store D7).
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id VARCHAR(36) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100) NULL DEFAULT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NULL DEFAULT NULL,
    payment_terms VARCHAR(50) NOT NULL DEFAULT 'NET_30',
    reliability_rating DECIMAL(3,2) NOT NULL DEFAULT 5.00,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_suppliers PRIMARY KEY (supplier_id)
);

-- -------------------------------------------------------------
-- Table: inventory_items (T07_ITEMS)
-- Data Store: D2 | Master item catalog for seeds, fertilizers, pesticides, livestock feeds, fuel, and spare parts (DFD Data Store D2).
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inventory_items (
    item_id VARCHAR(36) NOT NULL,
    location_id VARCHAR(36) NOT NULL,
    sku_code VARCHAR(50) NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit_of_measure VARCHAR(20) NOT NULL,
    current_quantity DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    unit_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    reorder_point DECIMAL(10,2) NOT NULL DEFAULT 10.00,
    safety_stock DECIMAL(10,2) NOT NULL DEFAULT 5.00,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_inventory_items PRIMARY KEY (item_id),
    CONSTRAINT fk_inventory_items_location_id FOREIGN KEY (location_id) REFERENCES storage_locations(location_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- -------------------------------------------------------------
-- Table: batch_lots (T08_LOTS)
-- Data Store: D2.2 | Discrete production batches, chemical formulation lot numbers, expiration dates, and QR traceability hashes.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS batch_lots (
    lot_id VARCHAR(36) NOT NULL,
    item_id VARCHAR(36) NOT NULL,
    lot_number VARCHAR(50) NOT NULL,
    initial_quantity DECIMAL(12,2) NOT NULL,
    remaining_quantity DECIMAL(12,2) NOT NULL,
    manufacture_date DATE NULL DEFAULT NULL,
    expiration_date DATE NULL DEFAULT NULL,
    qr_code_hash VARCHAR(64) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_batch_lots PRIMARY KEY (lot_id),
    CONSTRAINT fk_batch_lots_item_id FOREIGN KEY (item_id) REFERENCES inventory_items(item_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- -------------------------------------------------------------
-- Table: crop_care_cycles (T09_CYCLES)
-- Data Store: D3.2 | Agronomic care protocols, fertilizer application schedules, chemical dosages, and phenological targets.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS crop_care_cycles (
    cycle_id VARCHAR(36) NOT NULL,
    plot_id VARCHAR(36) NOT NULL,
    protocol_name VARCHAR(100) NOT NULL,
    target_stage VARCHAR(50) NOT NULL,
    scheduled_date DATE NOT NULL,
    dosage_formula VARCHAR(100) NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_crop_care_cycles PRIMARY KEY (cycle_id),
    CONSTRAINT fk_crop_care_cycles_plot_id FOREIGN KEY (plot_id) REFERENCES plot_fields(plot_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- -------------------------------------------------------------
-- Table: field_activity_logs (T10_ACTIVITIES)
-- Data Store: D3 | Operational field logs submitted by workers, recording hours, materials consumed, review approvals, and depletion (DFD Data Store D3).
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS field_activity_logs (
    log_id VARCHAR(36) NOT NULL,
    worker_id VARCHAR(36) NOT NULL,
    plot_id VARCHAR(36) NOT NULL,
    item_id VARCHAR(36) NULL DEFAULT NULL,
    activity_type VARCHAR(50) NOT NULL,
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    hours_spent DECIMAL(6,2) NOT NULL,
    quantity_consumed DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    validation_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    manager_id VARCHAR(36) NULL DEFAULT NULL,
    approval_date DATETIME NULL DEFAULT NULL,
    notes TEXT NULL DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_field_activity_logs PRIMARY KEY (log_id),
    CONSTRAINT fk_field_activity_logs_worker_id FOREIGN KEY (worker_id) REFERENCES user_accounts(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_field_activity_logs_plot_id FOREIGN KEY (plot_id) REFERENCES plot_fields(plot_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_field_activity_logs_item_id FOREIGN KEY (item_id) REFERENCES inventory_items(item_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_field_activity_logs_manager_id FOREIGN KEY (manager_id) REFERENCES user_accounts(user_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- -------------------------------------------------------------
-- Table: stock_transfers (T11_TRANSFERS)
-- Data Store: D2.3 | Inter-location inventory movements, transfers between silos, chemical bunkers, or transit vehicles.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stock_transfers (
    transfer_id VARCHAR(36) NOT NULL,
    item_id VARCHAR(36) NOT NULL,
    source_location_id VARCHAR(36) NOT NULL,
    dest_location_id VARCHAR(36) NOT NULL,
    initiated_by_user VARCHAR(36) NOT NULL,
    transfer_quantity DECIMAL(12,2) NOT NULL,
    transfer_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    dispatched_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    received_at DATETIME NULL DEFAULT NULL,
    CONSTRAINT pk_stock_transfers PRIMARY KEY (transfer_id),
    CONSTRAINT fk_stock_transfers_item_id FOREIGN KEY (item_id) REFERENCES inventory_items(item_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_stock_transfers_source_location_id FOREIGN KEY (source_location_id) REFERENCES storage_locations(location_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_stock_transfers_dest_location_id FOREIGN KEY (dest_location_id) REFERENCES storage_locations(location_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_stock_transfers_initiated_by_user FOREIGN KEY (initiated_by_user) REFERENCES user_accounts(user_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- -------------------------------------------------------------
-- Table: purchase_orders (T12_PO_HEADER)
-- Data Store: D7.1 | Commercial procurement purchase orders dispatched to external vendors, tracking delivery, terms, and fulfillment status.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS purchase_orders (
    po_id VARCHAR(36) NOT NULL,
    supplier_id VARCHAR(36) NOT NULL,
    manager_id VARCHAR(36) NOT NULL,
    po_number VARCHAR(50) NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_delivery DATE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    po_status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    payment_terms VARCHAR(50) NOT NULL DEFAULT 'NET_30',
    dispatched_at DATETIME NULL DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_purchase_orders PRIMARY KEY (po_id),
    CONSTRAINT fk_purchase_orders_supplier_id FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_purchase_orders_manager_id FOREIGN KEY (manager_id) REFERENCES user_accounts(user_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- -------------------------------------------------------------
-- Table: po_line_items (T13_PO_LINES)
-- Data Store: D7.2 | Individual line item breakdowns of purchase orders, specifying ordered vs received quantities and contracted unit prices.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS po_line_items (
    line_id VARCHAR(36) NOT NULL,
    po_id VARCHAR(36) NOT NULL,
    item_id VARCHAR(36) NOT NULL,
    line_number INT NOT NULL DEFAULT 1,
    order_quantity DECIMAL(10,2) NOT NULL,
    received_quantity DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    CONSTRAINT pk_po_line_items PRIMARY KEY (line_id),
    CONSTRAINT fk_po_line_items_po_id FOREIGN KEY (po_id) REFERENCES purchase_orders(po_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_po_line_items_item_id FOREIGN KEY (item_id) REFERENCES inventory_items(item_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- -------------------------------------------------------------
-- Table: cost_centers (T14_COST_CENTERS)
-- Data Store: D4.1 | Organizational financial allocation centers for crop agronomy, livestock dairy, equipment fleet, and administrative overhead.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cost_centers (
    cost_center_id VARCHAR(36) NOT NULL,
    center_code VARCHAR(30) NOT NULL,
    center_name VARCHAR(100) NOT NULL,
    annual_budget DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    fiscal_year INT NOT NULL DEFAULT 2026,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_cost_centers PRIMARY KEY (cost_center_id)
);

-- -------------------------------------------------------------
-- Table: financial_journal_entries (T15_GL_JOURNAL)
-- Data Store: D4 | Double-entry general ledger journal entries recording material depletion costs, procurement liabilities, and sales revenues (DFD Data Store D4).
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS financial_journal_entries (
    entry_id VARCHAR(36) NOT NULL,
    cost_center_id VARCHAR(36) NOT NULL,
    source_activity_id VARCHAR(36) NULL DEFAULT NULL,
    source_po_id VARCHAR(36) NULL DEFAULT NULL,
    source_sales_id VARCHAR(36) NULL DEFAULT NULL,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    account_code VARCHAR(50) NOT NULL,
    debit_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    credit_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    audit_hash VARCHAR(64) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_financial_journal_entries PRIMARY KEY (entry_id),
    CONSTRAINT fk_financial_journal_entries_cost_center_id FOREIGN KEY (cost_center_id) REFERENCES cost_centers(cost_center_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_financial_journal_entries_source_activity_id FOREIGN KEY (source_activity_id) REFERENCES field_activity_logs(log_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_financial_journal_entries_source_po_id FOREIGN KEY (source_po_id) REFERENCES purchase_orders(po_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_financial_journal_entries_source_sales_id FOREIGN KEY (source_sales_id) REFERENCES sales_orders(sales_order_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- -------------------------------------------------------------
-- Table: customers (T16_CUSTOMERS)
-- Data Store: D4.2 | Commercial agricultural offtakers, grain wholesalers, wholesale supermarkets, and cooperative buyers.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
    customer_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NULL DEFAULT NULL,
    billing_address TEXT NULL DEFAULT NULL,
    customer_type VARCHAR(30) NOT NULL DEFAULT 'WHOLESALER',
    credit_limit DECIMAL(12,2) NOT NULL DEFAULT 50000.00,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_customers PRIMARY KEY (customer_id)
);

-- -------------------------------------------------------------
-- Table: sales_orders (T17_SALES_ORDERS)
-- Data Store: D4.3 | Commercial harvest bulk sales contracts, customer deliveries, dispatch invoices, and revenue settlements.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sales_orders (
    sales_order_id VARCHAR(36) NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    item_id VARCHAR(36) NOT NULL,
    order_number VARCHAR(50) NOT NULL,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    dispatch_date DATE NULL DEFAULT NULL,
    sales_quantity DECIMAL(12,2) NOT NULL,
    total_revenue DECIMAL(12,2) NOT NULL,
    settlement_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_sales_orders PRIMARY KEY (sales_order_id),
    CONSTRAINT fk_sales_orders_customer_id FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_sales_orders_item_id FOREIGN KEY (item_id) REFERENCES inventory_items(item_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- -------------------------------------------------------------
-- Performance Optimization Indexes (BUCT Ch. 7)
-- -------------------------------------------------------------
CREATE UNIQUE INDEX idx_users_username ON user_accounts(username);
CREATE UNIQUE INDEX idx_users_email ON user_accounts(email);
CREATE UNIQUE INDEX idx_items_sku ON inventory_items(sku_code);
CREATE UNIQUE INDEX idx_po_number ON purchase_orders(po_number);
CREATE UNIQUE INDEX idx_sales_order_number ON sales_orders(order_number);
CREATE INDEX idx_activity_worker_date ON field_activity_logs(worker_id, activity_date);
CREATE INDEX idx_activity_plot ON field_activity_logs(plot_id);
CREATE INDEX idx_lots_item_expiry ON batch_lots(item_id, expiration_date);
CREATE INDEX idx_transfers_status ON stock_transfers(transfer_status);
CREATE INDEX idx_journal_date_account ON financial_journal_entries(entry_date, account_code);
