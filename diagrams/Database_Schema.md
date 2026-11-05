# Database Schema & Data Dictionary Specification
## Farm Inventory & Operations Management System

> **Methodology Alignment**: Beijing University of Chemical Technology (BUCT) — *System Analysis and Design*, **Chapter 7: Analyzing Systems Using Data Dictionaries** (Slides 31–45: Data Stores, Record Sizing, Data Formats, Character Codes, Validation Criteria, Primary/Foreign Keys, and Relational Constraints).

---

### Executive Summary & System Data Architecture
The relational database schema models the complete persistence tier of the **Farm Inventory & Operations Management System**. It directly implements the central data stores identified across the **DFD Hierarchy** (`D1` User Accounts, `D2` Central Inventory Ledger, `D3` Field Operations Journal, `D4` General Financial Ledger, `D5` Machinery & Asset Registry, `D6` Offline Sync Cache, `D7` Supplier Directory) and the **Entity-Relationship Diagram (ERD)**.

#### Relational Architecture Summary Table
| Table Name | Data Store ID | Stereotype (ERD) | Primary Key | Foreign Key References | Estimated Records | Annual Growth |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`system_roles`** | `D1.1` | Fundamental / Associative | `role_id` | *None (Root)* | 10 | 5% per annum |
| **`user_accounts`** | `D1` | Fundamental / Associative | `user_id` | `role_id` &rarr; system_roles(role_id) | 120 | 20% per annum |
| **`plot_fields`** | `D3.1` | Fundamental / Associative | `plot_id` | *None (Root)* | 50 | 10% per annum |
| **`storage_locations`** | `D2.1` | Fundamental / Associative | `location_id` | *None (Root)* | 30 | 15% per annum |
| **`equipment_assets`** | `D5` | Fundamental / Associative | `asset_id` | *None (Root)* | 80 | 10% per annum |
| **`suppliers`** | `D7` | Fundamental / Associative | `supplier_id` | *None (Root)* | 40 | 15% per annum |
| **`inventory_items`** | `D2` | Fundamental / Associative | `item_id` | `location_id` &rarr; storage_locations(location_id) | 500 | 25% per annum |
| **`batch_lots`** | `D2.2` | Fundamental / Associative | `lot_id` | `item_id` &rarr; inventory_items(item_id) | 2,000 | 35% per annum |
| **`crop_care_cycles`** | `D3.2` | Fundamental / Associative | `cycle_id` | `plot_id` &rarr; plot_fields(plot_id) | 150 | 20% per annum |
| **`field_activity_logs`** | `D3` | Fundamental / Associative | `log_id` | `worker_id` &rarr; user_accounts(user_id)<br>`plot_id` &rarr; plot_fields(plot_id)<br>`item_id` &rarr; inventory_items(item_id)<br>`manager_id` &rarr; user_accounts(user_id) | 5,000 | 40% per annum |
| **`stock_transfers`** | `D2.3` | Fundamental / Associative | `transfer_id` | `item_id` &rarr; inventory_items(item_id)<br>`source_location_id` &rarr; storage_locations(location_id)<br>`dest_location_id` &rarr; storage_locations(location_id)<br>`initiated_by_user` &rarr; user_accounts(user_id) | 800 | 30% per annum |
| **`purchase_orders`** | `D7.1` | Fundamental / Associative | `po_id` | `supplier_id` &rarr; suppliers(supplier_id)<br>`manager_id` &rarr; user_accounts(user_id) | 300 | 25% per annum |
| **`po_line_items`** | `D7.2` | Fundamental / Associative | `line_id` | `po_id` &rarr; purchase_orders(po_id)<br>`item_id` &rarr; inventory_items(item_id) | 1,200 | 30% per annum |
| **`cost_centers`** | `D4.1` | Fundamental / Associative | `cost_center_id` | *None (Root)* | 15 | 10% per annum |
| **`financial_journal_entries`** | `D4` | Fundamental / Associative | `entry_id` | `cost_center_id` &rarr; cost_centers(cost_center_id)<br>`source_activity_id` &rarr; field_activity_logs(log_id)<br>`source_po_id` &rarr; purchase_orders(po_id)<br>`source_sales_id` &rarr; sales_orders(sales_order_id) | 10,000 | 45% per annum |
| **`customers`** | `D4.2` | Fundamental / Associative | `customer_id` | *None (Root)* | 50 | 20% per annum |
| **`sales_orders`** | `D4.3` | Fundamental / Associative | `sales_order_id` | `customer_id` &rarr; customers(customer_id)<br>`item_id` &rarr; inventory_items(item_id) | 400 | 30% per annum |

---

### Comprehensive Data Store Forms & Attribute Dictionaries

#### Table 1: `SYSTEM_ROLES`

##### 1. Data Store Form Header (BUCT Ch. 7 Slides 38–40)
- **Data Store ID**: `D1.1`
- **Physical Table Name**: `system_roles`
- **Business Alias**: `T01_ROLES`
- **Short Description**: System RBAC role definitions, privileges, and authorization clearance levels.
- **File Storage Engine & Type**: Relational B-Tree Table (InnoDB / PostgreSQL)
- **Average Record Volume**: 10 records
- **Maximum Record Volume**: 50 records
- **Projected Growth Rate**: 5% per annum
- **Primary Key**: `role_id`
- **Foreign Keys**: *None*

##### 2. Field Attribute Dictionary Table (BUCT Ch. 7 Slides 31–36)

| Field Name | Data Type | Format Code | Nullable | Key Type | Default Value | Validation Criteria & Domain Rules | Business Description & Remarks |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **`role_id`** | `VARCHAR(36)` | `X(36)` | No | **PK** | `UUID_GEN()` | Valid UUID format | Unique primary surrogate identifier for the role |
| **`role_name`** | `VARCHAR(50)` | `X(50)` | No | - | *None* | Discrete: {'FARM_WORKER', 'FARM_MANAGER', 'FARM_OWNER', 'SYSTEM_ADMIN'} | Unique business key name of the role |
| **`description`** | `VARCHAR(255)` | `X(255)` | Yes | - | `NULL` | Alphanumeric length <= 255 | Descriptive explanation of the role permissions |
| **`permission_level`** | `INT` | `99` | No | - | `1` | Continuous: Range [1..100] | Integer hierarchy clearance level (e.g. 10=Worker, 50=Manager, 90=Owner) |
| **`is_active`** | `BOOLEAN` | `Bit (0/1)` | No | - | `TRUE` | Discrete: {TRUE, FALSE} | Soft deletion and role activation state |
| **`created_at`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | No | - | `CURRENT_TIMESTAMP` | Valid ISO-8601 timestamp | Record creation timestamp |

---

#### Table 2: `USER_ACCOUNTS`

##### 1. Data Store Form Header (BUCT Ch. 7 Slides 38–40)
- **Data Store ID**: `D1`
- **Physical Table Name**: `user_accounts`
- **Business Alias**: `T02_USERS`
- **Short Description**: Central authentication identities, user credentials, contact details, and role assignments (DFD Data Store D1).
- **File Storage Engine & Type**: Relational B-Tree Table (Indexed on email & username)
- **Average Record Volume**: 120 records
- **Maximum Record Volume**: 1,000 records
- **Projected Growth Rate**: 20% per annum
- **Primary Key**: `user_id`
- **Foreign Keys**: `role_id` (references `system_roles(role_id)`)

##### 2. Field Attribute Dictionary Table (BUCT Ch. 7 Slides 31–36)

| Field Name | Data Type | Format Code | Nullable | Key Type | Default Value | Validation Criteria & Domain Rules | Business Description & Remarks |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **`user_id`** | `VARCHAR(36)` | `X(36)` | No | **PK** | `UUID_GEN()` | Valid UUID format | Unique surrogate identifier for the user account |
| **`role_id`** | `VARCHAR(36)` | `X(36)` | No | *FK* | *None* | Must exist in system_roles(role_id) | Foreign key to the RBAC authorization role<br>*(References: `system_roles(role_id)`)* |
| **`username`** | `VARCHAR(50)` | `X(50)` | No | - | *None* | Regex: ^[a-zA-Z0-9_.]{3,50}$ | Unique system login handle |
| **`email`** | `VARCHAR(100)` | `X(100)` | No | - | *None* | Regex: RFC 5322 Email Specification | Unique corporate or personal email contact |
| **`password_hash`** | `VARCHAR(255)` | `X(255)` | No | - | *None* | Argon2id or bcrypt hash format | Secure cryptographic salted hash of password |
| **`full_name`** | `VARCHAR(100)` | `X(100)` | No | - | *None* | Length [2..100] | Full legal name of the employee or stakeholder |
| **`phone_number`** | `VARCHAR(30)` | `X(30)` | Yes | - | `NULL` | E.164 phone format | Mobile or emergency contact telephone |
| **`is_active`** | `BOOLEAN` | `Bit (0/1)` | No | - | `TRUE` | Discrete: {TRUE, FALSE} | Account status flag; FALSE revokes access |
| **`last_login_at`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | Yes | - | `NULL` | Valid ISO-8601 timestamp | Timestamp of most recent successful auth |
| **`created_at`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | No | - | `CURRENT_TIMESTAMP` | Valid ISO-8601 timestamp | Account provision date |

---

#### Table 3: `PLOT_FIELDS`

##### 1. Data Store Form Header (BUCT Ch. 7 Slides 38–40)
- **Data Store ID**: `D3.1`
- **Physical Table Name**: `plot_fields`
- **Business Alias**: `T03_PLOTS`
- **Short Description**: Geographical farm land parcels, soil profiles, acreage, and active agricultural crop occupancy.
- **File Storage Engine & Type**: Spatial & Relational Indexed Table (PostGIS / MySQL Spatial)
- **Average Record Volume**: 50 records
- **Maximum Record Volume**: 500 records
- **Projected Growth Rate**: 10% per annum
- **Primary Key**: `plot_id`
- **Foreign Keys**: *None*

##### 2. Field Attribute Dictionary Table (BUCT Ch. 7 Slides 31–36)

| Field Name | Data Type | Format Code | Nullable | Key Type | Default Value | Validation Criteria & Domain Rules | Business Description & Remarks |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **`plot_id`** | `VARCHAR(36)` | `X(36)` | No | **PK** | `UUID_GEN()` | Valid UUID format | Unique identifier for the geographic field |
| **`plot_name`** | `VARCHAR(100)` | `X(100)` | No | - | *None* | Unique text label, e.g. 'North Field Sector 4' | Human-readable farm zone or plot name |
| **`acreage`** | `DECIMAL(8,2)` | `999999.99` | No | - | *None* | Continuous: > 0.00 | Physical size of plot in acres or hectares |
| **`soil_type`** | `VARCHAR(50)` | `X(50)` | Yes | - | `NULL` | Discrete: {'LOAM', 'CLAY', 'SANDY_LOAM', 'SILT', 'PEAT', 'CHALK'} | Pedological classification of the soil |
| **`gps_polygon`** | `TEXT` | `X(Unlimited)` | Yes | - | `NULL` | GeoJSON or Well-Known Text (WKT) | Geospatial boundary coordinates of the plot |
| **`current_crop`** | `VARCHAR(50)` | `X(50)` | Yes | - | `NULL` | Alphanumeric length <= 50 | Active crop variety currently cultivated |
| **`status`** | `VARCHAR(30)` | `X(30)` | No | - | `'ACTIVE'` | Discrete: {'ACTIVE', 'FALLOW', 'PREPARATION', 'HARVESTED', 'QUARANTINE'} | Current agronomic operational status |
| **`created_at`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | No | - | `CURRENT_TIMESTAMP` | Valid ISO-8601 timestamp | Creation audit timestamp |

---

#### Table 4: `STORAGE_LOCATIONS`

##### 1. Data Store Form Header (BUCT Ch. 7 Slides 38–40)
- **Data Store ID**: `D2.1`
- **Physical Table Name**: `storage_locations`
- **Business Alias**: `T04_LOCATIONS`
- **Short Description**: Physical storage infrastructure including silos, warehouses, chemical bunkers, cold stores, and bin partitions.
- **File Storage Engine & Type**: Hierarchical Relational B-Tree Table
- **Average Record Volume**: 30 records
- **Maximum Record Volume**: 200 records
- **Projected Growth Rate**: 15% per annum
- **Primary Key**: `location_id`
- **Foreign Keys**: *None*

##### 2. Field Attribute Dictionary Table (BUCT Ch. 7 Slides 31–36)

| Field Name | Data Type | Format Code | Nullable | Key Type | Default Value | Validation Criteria & Domain Rules | Business Description & Remarks |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **`location_id`** | `VARCHAR(36)` | `X(36)` | No | **PK** | `UUID_GEN()` | Valid UUID format | Primary key for the storage location/zone |
| **`facility_name`** | `VARCHAR(100)` | `X(100)` | No | - | *None* | Length [2..100] | Parent facility name (e.g. 'Central Silo Complex A') |
| **`zone_code`** | `VARCHAR(30)` | `X(30)` | No | - | *None* | Unique alphanumeric code, e.g. 'SEC-B-04' | Partition or sub-zone location code |
| **`storage_type`** | `VARCHAR(50)` | `X(50)` | No | - | *None* | Discrete: {'GRAIN_SILO', 'CHEMICAL_BUNKER', 'COLD_STORAGE', 'EQUIPMENT_SHED', 'OPEN_YARD'} | Environmental storage classification |
| **`max_capacity`** | `DECIMAL(12,2)` | `9999999999.99` | No | - | *None* | Continuous: > 0.00 | Maximum permissible volumetric or weight capacity |
| **`current_occupancy`** | `DECIMAL(12,2)` | `9999999999.99` | No | - | `0.00` | Continuous: >= 0.00 AND <= max_capacity | Current physical volume occupied by goods |
| **`is_temperature_ctrl`** | `BOOLEAN` | `Bit (0/1)` | No | - | `FALSE` | Discrete: {TRUE, FALSE} | HVAC / Refrigeration control capabilities |
| **`created_at`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | No | - | `CURRENT_TIMESTAMP` | Valid ISO-8601 timestamp | Location registration timestamp |

---

#### Table 5: `EQUIPMENT_ASSETS`

##### 1. Data Store Form Header (BUCT Ch. 7 Slides 38–40)
- **Data Store ID**: `D5`
- **Physical Table Name**: `equipment_assets`
- **Business Alias**: `T05_EQUIPMENT`
- **Short Description**: Agricultural machinery, tractors, combine harvesters, irrigation pumps, and fleet implements (DFD Data Store D5).
- **File Storage Engine & Type**: Relational Asset Register Table
- **Average Record Volume**: 80 records
- **Maximum Record Volume**: 1,000 records
- **Projected Growth Rate**: 10% per annum
- **Primary Key**: `asset_id`
- **Foreign Keys**: *None*

##### 2. Field Attribute Dictionary Table (BUCT Ch. 7 Slides 31–36)

| Field Name | Data Type | Format Code | Nullable | Key Type | Default Value | Validation Criteria & Domain Rules | Business Description & Remarks |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **`asset_id`** | `VARCHAR(36)` | `X(36)` | No | **PK** | `UUID_GEN()` | Valid UUID format | Primary identifier for the farm equipment asset |
| **`asset_name`** | `VARCHAR(100)` | `X(100)` | No | - | *None* | Length [2..100] | Manufacturer make and model description |
| **`serial_number`** | `VARCHAR(50)` | `X(50)` | No | - | *None* | Unique alphanumeric VIN/Serial | Factory chassis/serial identifier |
| **`maintenance_interval_hrs`** | `INT` | `9999` | No | - | `250` | Continuous: > 0 | Operating service interval limit in running hours |
| **`hours_operated`** | `DECIMAL(8,2)` | `999999.99` | No | - | `0.00` | Continuous: >= 0.00 | Total cumulative engine runtime hours |
| **`last_service_date`** | `DATE` | `YYYY-MM-DD` | Yes | - | `NULL` | Valid calendar date <= CURRENT_DATE | Date of last comprehensive inspection |
| **`operational_status`** | `VARCHAR(30)` | `X(30)` | No | - | `'OPERATIONAL'` | Discrete: {'OPERATIONAL', 'MAINTENANCE_DUE', 'UNDER_REPAIR', 'DECOMMISSIONED'} | Real-time mechanical availability status |
| **`created_at`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | No | - | `CURRENT_TIMESTAMP` | Valid ISO-8601 timestamp | Asset intake timestamp |

---

#### Table 6: `SUPPLIERS`

##### 1. Data Store Form Header (BUCT Ch. 7 Slides 38–40)
- **Data Store ID**: `D7`
- **Physical Table Name**: `suppliers`
- **Business Alias**: `T06_SUPPLIERS`
- **Short Description**: Commercial vendors, seed breeders, fertilizer manufacturers, and equipment part providers (DFD Data Store D7).
- **File Storage Engine & Type**: Relational Vendor Directory Table
- **Average Record Volume**: 40 records
- **Maximum Record Volume**: 300 records
- **Projected Growth Rate**: 15% per annum
- **Primary Key**: `supplier_id`
- **Foreign Keys**: *None*

##### 2. Field Attribute Dictionary Table (BUCT Ch. 7 Slides 31–36)

| Field Name | Data Type | Format Code | Nullable | Key Type | Default Value | Validation Criteria & Domain Rules | Business Description & Remarks |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **`supplier_id`** | `VARCHAR(36)` | `X(36)` | No | **PK** | `UUID_GEN()` | Valid UUID format | Primary vendor surrogate key |
| **`company_name`** | `VARCHAR(100)` | `X(100)` | No | - | *None* | Length [2..100] | Registered commercial corporate legal name |
| **`contact_person`** | `VARCHAR(100)` | `X(100)` | Yes | - | `NULL` | Length [2..100] | Account manager or sales rep contact |
| **`email`** | `VARCHAR(100)` | `X(100)` | No | - | *None* | RFC 5322 Email format | Commercial correspondence email address |
| **`phone`** | `VARCHAR(30)` | `X(30)` | Yes | - | `NULL` | E.164 phone format | Business telephone number |
| **`payment_terms`** | `VARCHAR(50)` | `X(50)` | No | - | `'NET_30'` | Discrete: {'IMMEDIATE', 'NET_15', 'NET_30', 'NET_60', 'CONSIGNMENT'} | Contractual procurement payment terms |
| **`reliability_rating`** | `DECIMAL(3,2)` | `9.99` | No | - | `5.00` | Continuous: Range [1.00..5.00] | Performance evaluation score based on fulfillment velocity |
| **`created_at`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | No | - | `CURRENT_TIMESTAMP` | Valid ISO-8601 timestamp | Vendor onboarding timestamp |

---

#### Table 7: `INVENTORY_ITEMS`

##### 1. Data Store Form Header (BUCT Ch. 7 Slides 38–40)
- **Data Store ID**: `D2`
- **Physical Table Name**: `inventory_items`
- **Business Alias**: `T07_ITEMS`
- **Short Description**: Master item catalog for seeds, fertilizers, pesticides, livestock feeds, fuel, and spare parts (DFD Data Store D2).
- **File Storage Engine & Type**: Relational Catalog Table (Clustered B-Tree on item_id & sku_code)
- **Average Record Volume**: 500 records
- **Maximum Record Volume**: 10,000 records
- **Projected Growth Rate**: 25% per annum
- **Primary Key**: `item_id`
- **Foreign Keys**: `location_id` (references `storage_locations(location_id)`)

##### 2. Field Attribute Dictionary Table (BUCT Ch. 7 Slides 31–36)

| Field Name | Data Type | Format Code | Nullable | Key Type | Default Value | Validation Criteria & Domain Rules | Business Description & Remarks |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **`item_id`** | `VARCHAR(36)` | `X(36)` | No | **PK** | `UUID_GEN()` | Valid UUID format | Unique master inventory item identifier |
| **`location_id`** | `VARCHAR(36)` | `X(36)` | No | *FK* | *None* | Must exist in storage_locations(location_id) | Default primary storage warehouse/zone<br>*(References: `storage_locations(location_id)`)* |
| **`sku_code`** | `VARCHAR(50)` | `X(50)` | No | - | *None* | Unique alphanumeric code, e.g. 'CHEM-NPK-20-20' | Stock Keeping Unit enterprise barcode |
| **`item_name`** | `VARCHAR(100)` | `X(100)` | No | - | *None* | Length [2..100] | Descriptive title of consumable or good |
| **`category`** | `VARCHAR(50)` | `X(50)` | No | - | *None* | Discrete: {'CROP_SEED', 'FERTILIZER', 'PESTICIDE', 'FEED', 'FUEL', 'SPARE_PART'} | Master taxonomy classification |
| **`unit_of_measure`** | `VARCHAR(20)` | `X(20)` | No | - | *None* | Discrete: {'KG', 'TONNE', 'LITRE', 'BAG_50KG', 'CANISTER', 'UNIT'} | Standard unit of quantity quantification |
| **`current_quantity`** | `DECIMAL(12,2)` | `9999999999.99` | No | - | `0.00` | Continuous: >= 0.00 | Real-time physically available on-hand balance |
| **`unit_cost`** | `DECIMAL(10,2)` | `99999999.99` | No | - | `0.00` | Continuous: >= 0.00 | Weighted average unit acquisition cost (WAC) |
| **`reorder_point`** | `DECIMAL(10,2)` | `99999999.99` | No | - | `10.00` | Continuous: >= 0.00 | Dynamic safety replenishment threshold trigger |
| **`safety_stock`** | `DECIMAL(10,2)` | `99999999.99` | No | - | `5.00` | Continuous: >= 0.00 | Buffer stock level to absorb lead-time spikes |
| **`created_at`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | No | - | `CURRENT_TIMESTAMP` | Valid ISO-8601 timestamp | Master item catalog registration timestamp |

---

#### Table 8: `BATCH_LOTS`

##### 1. Data Store Form Header (BUCT Ch. 7 Slides 38–40)
- **Data Store ID**: `D2.2`
- **Physical Table Name**: `batch_lots`
- **Business Alias**: `T08_LOTS`
- **Short Description**: Discrete production batches, chemical formulation lot numbers, expiration dates, and QR traceability hashes.
- **File Storage Engine & Type**: Relational Lot Traceability Table
- **Average Record Volume**: 2,000 records
- **Maximum Record Volume**: 50,000 records
- **Projected Growth Rate**: 35% per annum
- **Primary Key**: `lot_id`
- **Foreign Keys**: `item_id` (references `inventory_items(item_id)`)

##### 2. Field Attribute Dictionary Table (BUCT Ch. 7 Slides 31–36)

| Field Name | Data Type | Format Code | Nullable | Key Type | Default Value | Validation Criteria & Domain Rules | Business Description & Remarks |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **`lot_id`** | `VARCHAR(36)` | `X(36)` | No | **PK** | `UUID_GEN()` | Valid UUID format | Unique identifier for physical lot/batch |
| **`item_id`** | `VARCHAR(36)` | `X(36)` | No | *FK* | *None* | Must exist in inventory_items(item_id) | Associated parent catalog item<br>*(References: `inventory_items(item_id)`)* |
| **`lot_number`** | `VARCHAR(50)` | `X(50)` | No | - | *None* | Alphanumeric, e.g. 'LOT-2026-B91' | Manufacturer or harvest batch stamp number |
| **`initial_quantity`** | `DECIMAL(12,2)` | `9999999999.99` | No | - | *None* | Continuous: > 0.00 | Quantity originally received into lot |
| **`remaining_quantity`** | `DECIMAL(12,2)` | `9999999999.99` | No | - | *None* | Continuous: >= 0.00 AND <= initial_quantity | Remaining undepleted balance in this lot |
| **`manufacture_date`** | `DATE` | `YYYY-MM-DD` | Yes | - | `NULL` | Valid date <= CURRENT_DATE | Date manufactured, blended, or packaged |
| **`expiration_date`** | `DATE` | `YYYY-MM-DD` | Yes | - | `NULL` | Valid date >= manufacture_date | Expiration date after which chemical spoils |
| **`qr_code_hash`** | `VARCHAR(64)` | `X(64)` | No | - | *None* | SHA-256 cryptographic string | Cryptographic hash printed on barcode / QR label |
| **`created_at`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | No | - | `CURRENT_TIMESTAMP` | Valid ISO-8601 timestamp | Lot intake timestamp |

---

#### Table 9: `CROP_CARE_CYCLES`

##### 1. Data Store Form Header (BUCT Ch. 7 Slides 38–40)
- **Data Store ID**: `D3.2`
- **Physical Table Name**: `crop_care_cycles`
- **Business Alias**: `T09_CYCLES`
- **Short Description**: Agronomic care protocols, fertilizer application schedules, chemical dosages, and phenological targets.
- **File Storage Engine & Type**: Relational Protocol Registry Table
- **Average Record Volume**: 150 records
- **Maximum Record Volume**: 2,000 records
- **Projected Growth Rate**: 20% per annum
- **Primary Key**: `cycle_id`
- **Foreign Keys**: `plot_id` (references `plot_fields(plot_id)`)

##### 2. Field Attribute Dictionary Table (BUCT Ch. 7 Slides 31–36)

| Field Name | Data Type | Format Code | Nullable | Key Type | Default Value | Validation Criteria & Domain Rules | Business Description & Remarks |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **`cycle_id`** | `VARCHAR(36)` | `X(36)` | No | **PK** | `UUID_GEN()` | Valid UUID format | Primary key for agronomic care cycle |
| **`plot_id`** | `VARCHAR(36)` | `X(36)` | No | *FK* | *None* | Must exist in plot_fields(plot_id) | Plot where this treatment schedule applies<br>*(References: `plot_fields(plot_id)`)* |
| **`protocol_name`** | `VARCHAR(100)` | `X(100)` | No | - | *None* | Length [2..100] | Name of treatment (e.g. 'Pre-Emergence Herbicide Cycle') |
| **`target_stage`** | `VARCHAR(50)` | `X(50)` | No | - | *None* | Discrete: {'SEEDLING', 'TILLERING', 'FLOWERING', 'RIPENING', 'POST_HARVEST'} | Phenological crop growth stage target |
| **`scheduled_date`** | `DATE` | `YYYY-MM-DD` | No | - | *None* | Valid calendar date | Target execution date for chemical application |
| **`dosage_formula`** | `VARCHAR(100)` | `X(100)` | No | - | *None* | Alphanumeric formula, e.g. '2.5L / Hectare' | Standard agronomic application dilution formula |
| **`is_completed`** | `BOOLEAN` | `Bit (0/1)` | No | - | `FALSE` | Discrete: {TRUE, FALSE} | Execution completion state indicator |
| **`created_at`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | No | - | `CURRENT_TIMESTAMP` | Valid ISO-8601 timestamp | Protocol creation timestamp |

---

#### Table 10: `FIELD_ACTIVITY_LOGS`

##### 1. Data Store Form Header (BUCT Ch. 7 Slides 38–40)
- **Data Store ID**: `D3`
- **Physical Table Name**: `field_activity_logs`
- **Business Alias**: `T10_ACTIVITIES`
- **Short Description**: Operational field logs submitted by workers, recording hours, materials consumed, review approvals, and depletion (DFD Data Store D3).
- **File Storage Engine & Type**: Transaction Journal Table (High volume, indexed on worker & plot)
- **Average Record Volume**: 5,000 records
- **Maximum Record Volume**: 100,000 records
- **Projected Growth Rate**: 40% per annum
- **Primary Key**: `log_id`
- **Foreign Keys**: `worker_id` (references `user_accounts(user_id)`), `plot_id` (references `plot_fields(plot_id)`), `item_id` (references `inventory_items(item_id)`), `manager_id` (references `user_accounts(user_id)`)

##### 2. Field Attribute Dictionary Table (BUCT Ch. 7 Slides 31–36)

| Field Name | Data Type | Format Code | Nullable | Key Type | Default Value | Validation Criteria & Domain Rules | Business Description & Remarks |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **`log_id`** | `VARCHAR(36)` | `X(36)` | No | **PK** | `UUID_GEN()` | Valid UUID format | Unique operational activity record key |
| **`worker_id`** | `VARCHAR(36)` | `X(36)` | No | *FK* | *None* | Must exist in user_accounts(user_id) | Farm Worker who conducted and logged field work<br>*(References: `user_accounts(user_id)`)* |
| **`plot_id`** | `VARCHAR(36)` | `X(36)` | No | *FK* | *None* | Must exist in plot_fields(plot_id) | Plot where operational activity took place<br>*(References: `plot_fields(plot_id)`)* |
| **`item_id`** | `VARCHAR(36)` | `X(36)` | Yes | *FK* | `NULL` | Must exist in inventory_items(item_id) if not null | Consumable input utilized (seeds, fertilizer, fuel)<br>*(References: `inventory_items(item_id)`)* |
| **`activity_type`** | `VARCHAR(50)` | `X(50)` | No | - | *None* | Discrete: {'PLANTING', 'FERTILIZING', 'SPRAYING', 'IRRIGATION', 'HARVESTING', 'TILLING'} | Operational nature of field work conducted |
| **`activity_date`** | `DATE` | `YYYY-MM-DD` | No | - | `CURRENT_DATE` | Valid calendar date <= CURRENT_DATE | Date on which field operation occurred |
| **`hours_spent`** | `DECIMAL(6,2)` | `9999.99` | No | - | *None* | Continuous: > 0.00 AND <= 24.00 | Total labor hours expended by worker |
| **`quantity_consumed`** | `DECIMAL(10,2)` | `99999999.99` | No | - | `0.00` | Continuous: >= 0.00 | Quantity of inventory item consumed in work |
| **`validation_status`** | `VARCHAR(30)` | `X(30)` | No | - | `'PENDING'` | Discrete: {'DRAFT', 'OFFLINE_QUEUED', 'PENDING', 'APPROVED', 'REJECTED', 'DEPLETED'} | Current administrative validation state |
| **`manager_id`** | `VARCHAR(36)` | `X(36)` | Yes | *FK* | `NULL` | Must exist in user_accounts(user_id) if not null | Manager account who authorized or rejected log<br>*(References: `user_accounts(user_id)`)* |
| **`approval_date`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | Yes | - | `NULL` | Valid timestamp >= activity_date | Timestamp when manager approved the submission |
| **`notes`** | `TEXT` | `X(Unlimited)` | Yes | - | `NULL` | Freeform notes | Worker notes or manager review justification |
| **`created_at`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | No | - | `CURRENT_TIMESTAMP` | Valid ISO-8601 timestamp | Record creation timestamp |

---

#### Table 11: `STOCK_TRANSFERS`

##### 1. Data Store Form Header (BUCT Ch. 7 Slides 38–40)
- **Data Store ID**: `D2.3`
- **Physical Table Name**: `stock_transfers`
- **Business Alias**: `T11_TRANSFERS`
- **Short Description**: Inter-location inventory movements, transfers between silos, chemical bunkers, or transit vehicles.
- **File Storage Engine & Type**: Relational Transfer Audit Table
- **Average Record Volume**: 800 records
- **Maximum Record Volume**: 15,000 records
- **Projected Growth Rate**: 30% per annum
- **Primary Key**: `transfer_id`
- **Foreign Keys**: `item_id` (references `inventory_items(item_id)`), `source_location_id` (references `storage_locations(location_id)`), `dest_location_id` (references `storage_locations(location_id)`), `initiated_by_user` (references `user_accounts(user_id)`)

##### 2. Field Attribute Dictionary Table (BUCT Ch. 7 Slides 31–36)

| Field Name | Data Type | Format Code | Nullable | Key Type | Default Value | Validation Criteria & Domain Rules | Business Description & Remarks |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **`transfer_id`** | `VARCHAR(36)` | `X(36)` | No | **PK** | `UUID_GEN()` | Valid UUID format | Unique surrogate key for transfer dispatch |
| **`item_id`** | `VARCHAR(36)` | `X(36)` | No | *FK* | *None* | Must exist in inventory_items(item_id) | Inventory item being transferred<br>*(References: `inventory_items(item_id)`)* |
| **`source_location_id`** | `VARCHAR(36)` | `X(36)` | No | *FK* | *None* | Must exist in storage_locations(location_id) | Origin storage zone/facility<br>*(References: `storage_locations(location_id)`)* |
| **`dest_location_id`** | `VARCHAR(36)` | `X(36)` | No | *FK* | *None* | Must exist in storage_locations(location_id) | Target destination storage zone/facility<br>*(References: `storage_locations(location_id)`)* |
| **`initiated_by_user`** | `VARCHAR(36)` | `X(36)` | No | *FK* | *None* | Must exist in user_accounts(user_id) | Worker/Manager who dispatched transfer<br>*(References: `user_accounts(user_id)`)* |
| **`transfer_quantity`** | `DECIMAL(12,2)` | `9999999999.99` | No | - | *None* | Continuous: > 0.00 | Physical quantity moved across locations |
| **`transfer_status`** | `VARCHAR(30)` | `X(30)` | No | - | `'PENDING'` | Discrete: {'PENDING', 'IN_TRANSIT', 'COMPLETED', 'DISCREPANCY_REJECTED'} | Custody transfer progression state |
| **`dispatched_at`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | No | - | `CURRENT_TIMESTAMP` | Valid ISO-8601 timestamp | Timestamp when cargo left origin location |
| **`received_at`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | Yes | - | `NULL` | Valid timestamp >= dispatched_at | Timestamp when cargo was signed into destination |

---

#### Table 12: `PURCHASE_ORDERS`

##### 1. Data Store Form Header (BUCT Ch. 7 Slides 38–40)
- **Data Store ID**: `D7.1`
- **Physical Table Name**: `purchase_orders`
- **Business Alias**: `T12_PO_HEADER`
- **Short Description**: Commercial procurement purchase orders dispatched to external vendors, tracking delivery, terms, and fulfillment status.
- **File Storage Engine & Type**: Relational Header Order Table (Indexed on po_number & supplier_id)
- **Average Record Volume**: 300 records
- **Maximum Record Volume**: 5,000 records
- **Projected Growth Rate**: 25% per annum
- **Primary Key**: `po_id`
- **Foreign Keys**: `supplier_id` (references `suppliers(supplier_id)`), `manager_id` (references `user_accounts(user_id)`)

##### 2. Field Attribute Dictionary Table (BUCT Ch. 7 Slides 31–36)

| Field Name | Data Type | Format Code | Nullable | Key Type | Default Value | Validation Criteria & Domain Rules | Business Description & Remarks |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **`po_id`** | `VARCHAR(36)` | `X(36)` | No | **PK** | `UUID_GEN()` | Valid UUID format | Primary surrogate identifier for PO |
| **`supplier_id`** | `VARCHAR(36)` | `X(36)` | No | *FK* | *None* | Must exist in suppliers(supplier_id) | Target supplier fulfilling the requisition<br>*(References: `suppliers(supplier_id)`)* |
| **`manager_id`** | `VARCHAR(36)` | `X(36)` | No | *FK* | *None* | Must exist in user_accounts(user_id) | Manager authorizing the purchase expenditure<br>*(References: `user_accounts(user_id)`)* |
| **`po_number`** | `VARCHAR(50)` | `X(50)` | No | - | *None* | Unique alphanumeric code, e.g. 'PO-2026-084' | External invoice and order reference number |
| **`issue_date`** | `DATE` | `YYYY-MM-DD` | No | - | `CURRENT_DATE` | Valid calendar date | Date PO was formally transmitted to vendor |
| **`expected_delivery`** | `DATE` | `YYYY-MM-DD` | No | - | *None* | Valid calendar date >= issue_date | Agreed contractual delivery arrival date |
| **`total_amount`** | `DECIMAL(12,2)` | `9999999999.99` | No | - | `0.00` | Continuous: >= 0.00 | Sum total financial commitment of line items |
| **`po_status`** | `VARCHAR(30)` | `X(30)` | No | - | `'DRAFT'` | Discrete: {'DRAFT', 'ISSUED', 'DISPATCHED', 'IN_TRANSIT', 'INSPECTION', 'FULFILLED', 'DISPUTED', 'CANCELLED'} | Current procurement lifecycle phase |
| **`payment_terms`** | `VARCHAR(50)` | `X(50)` | No | - | `'NET_30'` | Discrete: {'IMMEDIATE', 'NET_15', 'NET_30', 'NET_60'} | Contract settlement terms for the order |
| **`dispatched_at`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | Yes | - | `NULL` | Valid ISO-8601 timestamp | Timestamp when vendor acknowledged order |
| **`created_at`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | No | - | `CURRENT_TIMESTAMP` | Valid ISO-8601 timestamp | Requisition draft creation timestamp |

---

#### Table 13: `PO_LINE_ITEMS`

##### 1. Data Store Form Header (BUCT Ch. 7 Slides 38–40)
- **Data Store ID**: `D7.2`
- **Physical Table Name**: `po_line_items`
- **Business Alias**: `T13_PO_LINES`
- **Short Description**: Individual line item breakdowns of purchase orders, specifying ordered vs received quantities and contracted unit prices.
- **File Storage Engine & Type**: Relational Detail Line Table (Foreign Key to purchase_orders)
- **Average Record Volume**: 1,200 records
- **Maximum Record Volume**: 25,000 records
- **Projected Growth Rate**: 30% per annum
- **Primary Key**: `line_id`
- **Foreign Keys**: `po_id` (references `purchase_orders(po_id)`), `item_id` (references `inventory_items(item_id)`)

##### 2. Field Attribute Dictionary Table (BUCT Ch. 7 Slides 31–36)

| Field Name | Data Type | Format Code | Nullable | Key Type | Default Value | Validation Criteria & Domain Rules | Business Description & Remarks |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **`line_id`** | `VARCHAR(36)` | `X(36)` | No | **PK** | `UUID_GEN()` | Valid UUID format | Primary surrogate key for the order line |
| **`po_id`** | `VARCHAR(36)` | `X(36)` | No | *FK* | *None* | Must exist in purchase_orders(po_id) | Associated parent purchase order<br>*(References: `purchase_orders(po_id)`)* |
| **`item_id`** | `VARCHAR(36)` | `X(36)` | No | *FK* | *None* | Must exist in inventory_items(item_id) | Catalog item being procured<br>*(References: `inventory_items(item_id)`)* |
| **`line_number`** | `INT` | `999` | No | - | `1` | Continuous: > 0 | Sequential line number (1, 2, 3...) |
| **`order_quantity`** | `DECIMAL(10,2)` | `99999999.99` | No | - | *None* | Continuous: > 0.00 | Quantity ordered from vendor |
| **`received_quantity`** | `DECIMAL(10,2)` | `99999999.99` | No | - | `0.00` | Continuous: >= 0.00 AND <= order_quantity * 1.10 | Quantity inspected and accepted at receiving dock |
| **`unit_price`** | `DECIMAL(10,2)` | `99999999.99` | No | - | *None* | Continuous: >= 0.00 | Contracted unit price in transactional currency |
| **`subtotal`** | `DECIMAL(12,2)` | `9999999999.99` | No | - | *None* | Formula: order_quantity * unit_price | Computed line amount before tax |

---

#### Table 14: `COST_CENTERS`

##### 1. Data Store Form Header (BUCT Ch. 7 Slides 38–40)
- **Data Store ID**: `D4.1`
- **Physical Table Name**: `cost_centers`
- **Business Alias**: `T14_COST_CENTERS`
- **Short Description**: Organizational financial allocation centers for crop agronomy, livestock dairy, equipment fleet, and administrative overhead.
- **File Storage Engine & Type**: Relational Financial Master Table
- **Average Record Volume**: 15 records
- **Maximum Record Volume**: 100 records
- **Projected Growth Rate**: 10% per annum
- **Primary Key**: `cost_center_id`
- **Foreign Keys**: *None*

##### 2. Field Attribute Dictionary Table (BUCT Ch. 7 Slides 31–36)

| Field Name | Data Type | Format Code | Nullable | Key Type | Default Value | Validation Criteria & Domain Rules | Business Description & Remarks |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **`cost_center_id`** | `VARCHAR(36)` | `X(36)` | No | **PK** | `UUID_GEN()` | Valid UUID format | Primary identifier for cost center |
| **`center_code`** | `VARCHAR(30)` | `X(30)` | No | - | *None* | Unique alphanumeric code, e.g. 'CC-AGRONOMY-01' | Financial ledger account cost center code |
| **`center_name`** | `VARCHAR(100)` | `X(100)` | No | - | *None* | Length [2..100] | Organizational division or farm sector name |
| **`annual_budget`** | `DECIMAL(14,2)` | `999999999999.99` | No | - | `0.00` | Continuous: >= 0.00 | Annual allocated operating expense budget |
| **`fiscal_year`** | `INT` | `9999` | No | - | `2026` | Range [2020..2050] | Target financial calendar accounting year |
| **`created_at`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | No | - | `CURRENT_TIMESTAMP` | Valid ISO-8601 timestamp | Cost center provisioning timestamp |

---

#### Table 15: `FINANCIAL_JOURNAL_ENTRIES`

##### 1. Data Store Form Header (BUCT Ch. 7 Slides 38–40)
- **Data Store ID**: `D4`
- **Physical Table Name**: `financial_journal_entries`
- **Business Alias**: `T15_GL_JOURNAL`
- **Short Description**: Double-entry general ledger journal entries recording material depletion costs, procurement liabilities, and sales revenues (DFD Data Store D4).
- **File Storage Engine & Type**: Immutable Financial Ledger Table (Append-only, SHA-256 hash verified)
- **Average Record Volume**: 10,000 records
- **Maximum Record Volume**: 250,000 records
- **Projected Growth Rate**: 45% per annum
- **Primary Key**: `entry_id`
- **Foreign Keys**: `cost_center_id` (references `cost_centers(cost_center_id)`), `source_activity_id` (references `field_activity_logs(log_id)`), `source_po_id` (references `purchase_orders(po_id)`), `source_sales_id` (references `sales_orders(sales_order_id)`)

##### 2. Field Attribute Dictionary Table (BUCT Ch. 7 Slides 31–36)

| Field Name | Data Type | Format Code | Nullable | Key Type | Default Value | Validation Criteria & Domain Rules | Business Description & Remarks |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **`entry_id`** | `VARCHAR(36)` | `X(36)` | No | **PK** | `UUID_GEN()` | Valid UUID format | Unique primary surrogate key for ledger transaction |
| **`cost_center_id`** | `VARCHAR(36)` | `X(36)` | No | *FK* | *None* | Must exist in cost_centers(cost_center_id) | Associated cost center absorbing expense/revenue<br>*(References: `cost_centers(cost_center_id)`)* |
| **`source_activity_id`** | `VARCHAR(36)` | `X(36)` | Yes | *FK* | `NULL` | Must exist in field_activity_logs(log_id) if not null | Upstream field activity triggering depletion posting<br>*(References: `field_activity_logs(log_id)`)* |
| **`source_po_id`** | `VARCHAR(36)` | `X(36)` | Yes | *FK* | `NULL` | Must exist in purchase_orders(po_id) if not null | Upstream purchase order triggering payable liability<br>*(References: `purchase_orders(po_id)`)* |
| **`source_sales_id`** | `VARCHAR(36)` | `X(36)` | Yes | *FK* | `NULL` | Must exist in sales_orders(sales_order_id) if not null | Upstream sales order triggering receivable revenue<br>*(References: `sales_orders(sales_order_id)`)* |
| **`entry_date`** | `DATE` | `YYYY-MM-DD` | No | - | `CURRENT_DATE` | Valid calendar date | Accounting posting effective transaction date |
| **`account_code`** | `VARCHAR(50)` | `X(50)` | No | - | *None* | Discrete: {'5100-RAW-MATERIALS', '1200-INVENTORY-ASSET', '2000-ACCOUNTS-PAYABLE', '4000-CROP-SALES', '6100-EQUIPMENT-REPAIRS'} | Standard Chart of Accounts (COA) number |
| **`debit_amount`** | `DECIMAL(12,2)` | `9999999999.99` | No | - | `0.00` | Continuous: >= 0.00 | Debit amount posted in transactional currency |
| **`credit_amount`** | `DECIMAL(12,2)` | `9999999999.99` | No | - | `0.00` | Continuous: >= 0.00 | Credit amount posted in transactional currency |
| **`audit_hash`** | `VARCHAR(64)` | `X(64)` | No | - | *None* | SHA-256 cryptographic hex digest | Tamper-evident blockchain/merkle hash of entry |
| **`created_at`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | No | - | `CURRENT_TIMESTAMP` | Valid ISO-8601 timestamp | System commit timestamp |

---

#### Table 16: `CUSTOMERS`

##### 1. Data Store Form Header (BUCT Ch. 7 Slides 38–40)
- **Data Store ID**: `D4.2`
- **Physical Table Name**: `customers`
- **Business Alias**: `T16_CUSTOMERS`
- **Short Description**: Commercial agricultural offtakers, grain wholesalers, wholesale supermarkets, and cooperative buyers.
- **File Storage Engine & Type**: Relational Customer Directory Table
- **Average Record Volume**: 50 records
- **Maximum Record Volume**: 500 records
- **Projected Growth Rate**: 20% per annum
- **Primary Key**: `customer_id`
- **Foreign Keys**: *None*

##### 2. Field Attribute Dictionary Table (BUCT Ch. 7 Slides 31–36)

| Field Name | Data Type | Format Code | Nullable | Key Type | Default Value | Validation Criteria & Domain Rules | Business Description & Remarks |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **`customer_id`** | `VARCHAR(36)` | `X(36)` | No | **PK** | `UUID_GEN()` | Valid UUID format | Primary surrogate identifier for customer |
| **`customer_name`** | `VARCHAR(100)` | `X(100)` | No | - | *None* | Length [2..100] | Commercial trading business name |
| **`contact_email`** | `VARCHAR(100)` | `X(100)` | No | - | *None* | RFC 5322 Email format | Primary accounting/billing email contact |
| **`phone`** | `VARCHAR(30)` | `X(30)` | Yes | - | `NULL` | E.164 phone format | Business contact telephone |
| **`billing_address`** | `TEXT` | `X(Unlimited)` | Yes | - | `NULL` | Freeform postal text | Registered corporate invoice billing address |
| **`customer_type`** | `VARCHAR(30)` | `X(30)` | No | - | `'WHOLESALER'` | Discrete: {'WHOLESALER', 'RETAILER', 'COOPERATIVE', 'FOOD_PROCESSOR', 'DIRECT_CONSUMER'} | Market segment classification |
| **`credit_limit`** | `DECIMAL(12,2)` | `9999999999.99` | No | - | `50000.00` | Continuous: >= 0.00 | Approved revolving accounts receivable credit limit |
| **`created_at`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | No | - | `CURRENT_TIMESTAMP` | Valid ISO-8601 timestamp | Customer account creation timestamp |

---

#### Table 17: `SALES_ORDERS`

##### 1. Data Store Form Header (BUCT Ch. 7 Slides 38–40)
- **Data Store ID**: `D4.3`
- **Physical Table Name**: `sales_orders`
- **Business Alias**: `T17_SALES_ORDERS`
- **Short Description**: Commercial harvest bulk sales contracts, customer deliveries, dispatch invoices, and revenue settlements.
- **File Storage Engine & Type**: Relational Sales Order Table
- **Average Record Volume**: 400 records
- **Maximum Record Volume**: 8,000 records
- **Projected Growth Rate**: 30% per annum
- **Primary Key**: `sales_order_id`
- **Foreign Keys**: `customer_id` (references `customers(customer_id)`), `item_id` (references `inventory_items(item_id)`)

##### 2. Field Attribute Dictionary Table (BUCT Ch. 7 Slides 31–36)

| Field Name | Data Type | Format Code | Nullable | Key Type | Default Value | Validation Criteria & Domain Rules | Business Description & Remarks |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **`sales_order_id`** | `VARCHAR(36)` | `X(36)` | No | **PK** | `UUID_GEN()` | Valid UUID format | Primary identifier for customer sales order |
| **`customer_id`** | `VARCHAR(36)` | `X(36)` | No | *FK* | *None* | Must exist in customers(customer_id) | Offtaker purchasing the agricultural produce<br>*(References: `customers(customer_id)`)* |
| **`item_id`** | `VARCHAR(36)` | `X(36)` | No | *FK* | *None* | Must exist in inventory_items(item_id) | Harvested commodity product sold<br>*(References: `inventory_items(item_id)`)* |
| **`order_number`** | `VARCHAR(50)` | `X(50)` | No | - | *None* | Unique alphanumeric code, e.g. 'SO-2026-441' | Sales invoice / dispatch docket reference number |
| **`order_date`** | `DATE` | `YYYY-MM-DD` | No | - | `CURRENT_DATE` | Valid calendar date | Contract agreed date |
| **`dispatch_date`** | `DATE` | `YYYY-MM-DD` | Yes | - | `NULL` | Valid calendar date >= order_date | Physical produce dispatch date |
| **`sales_quantity`** | `DECIMAL(12,2)` | `9999999999.99` | No | - | *None* | Continuous: > 0.00 | Weight/volume of harvested goods delivered |
| **`total_revenue`** | `DECIMAL(12,2)` | `9999999999.99` | No | - | *None* | Continuous: >= 0.00 | Gross contractual sales revenue before discounts |
| **`settlement_status`** | `VARCHAR(30)` | `X(30)` | No | - | `'PENDING'` | Discrete: {'PENDING', 'INVOICED', 'PARTIALLY_PAID', 'SETTLED', 'DEFAULTED'} | Accounts receivable payment settlement state |
| **`created_at`** | `DATETIME` | `YYYY-MM-DD HH:MM:SS` | No | - | `CURRENT_TIMESTAMP` | Valid ISO-8601 timestamp | Order creation timestamp |

---

### Referential Integrity & Business Validation Rules

1. **Inventory Consistency**: Real-time quantity on hand (`current_quantity`) in `inventory_items` must strictly equal the sum of active `remaining_quantity` across all associated `batch_lots`.
2. **Double-Entry Balance Constraint**: For any transaction batch posted in `financial_journal_entries`, `SUM(debit_amount)` must equal `SUM(credit_amount)`.
3. **Three-Way Procurement Matching**: A `purchase_order` line item cannot transition to `FULFILLED` status unless `received_quantity` verified at inward inspection matches the vendor invoice within a $\pm 1\%$ tolerance threshold.
4. **Worker-Plot Activity Integrity**: A worker cannot submit a `field_activity_log` for a `plot_id` if that plot's status is set to `QUARANTINE` without explicit administrative bypass override.
5. **Tamper-Evident Hashing**: The `audit_hash` column on `financial_journal_entries` is computed via `SHA256(entry_id || cost_center_id || debit_amount || credit_amount || entry_date || previous_hash)` providing continuous cryptographic audit assurance.

---
*Compiled automatically from the Farm Inventory & Operations Management System Database Specification.*