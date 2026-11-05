/**
 * Farm Inventory & Operations Manager - Interactive Database Schema & Data Dictionary Viewer
 * Conforming to BUCT Chapter 7 (Slides 31-45)
 */

const DB_SCHEMA_DATA = [
  {
    "name": "system_roles",
    "alias": "T01_ROLES",
    "ds_id": "D1.1",
    "desc": "System RBAC role definitions, privileges, and authorization clearance levels.",
    "file_type": "Relational B-Tree Table (InnoDB / PostgreSQL)",
    "avg_records": "10",
    "max_records": "50",
    "growth_pct": "5% per annum",
    "columns": [
      [
        "role_id",
        "VARCHAR(36)",
        "X(36)",
        true,
        false,
        false,
        "UUID_GEN()",
        "Valid UUID format",
        "Unique primary surrogate identifier for the role",
        null
      ],
      [
        "role_name",
        "VARCHAR(50)",
        "X(50)",
        false,
        false,
        false,
        "None",
        "Discrete: {'FARM_WORKER', 'FARM_MANAGER', 'FARM_OWNER', 'SYSTEM_ADMIN'}",
        "Unique business key name of the role",
        null
      ],
      [
        "description",
        "VARCHAR(255)",
        "X(255)",
        false,
        false,
        true,
        "NULL",
        "Alphanumeric length <= 255",
        "Descriptive explanation of the role permissions",
        null
      ],
      [
        "permission_level",
        "INT",
        "99",
        false,
        false,
        false,
        "1",
        "Continuous: Range [1..100]",
        "Integer hierarchy clearance level (e.g. 10=Worker, 50=Manager, 90=Owner)",
        null
      ],
      [
        "is_active",
        "BOOLEAN",
        "Bit (0/1)",
        false,
        false,
        false,
        "TRUE",
        "Discrete: {TRUE, FALSE}",
        "Soft deletion and role activation state",
        null
      ],
      [
        "created_at",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        false,
        "CURRENT_TIMESTAMP",
        "Valid ISO-8601 timestamp",
        "Record creation timestamp",
        null
      ]
    ]
  },
  {
    "name": "user_accounts",
    "alias": "T02_USERS",
    "ds_id": "D1",
    "desc": "Central authentication identities, user credentials, contact details, and role assignments (DFD Data Store D1).",
    "file_type": "Relational B-Tree Table (Indexed on email & username)",
    "avg_records": "120",
    "max_records": "1,000",
    "growth_pct": "20% per annum",
    "columns": [
      [
        "user_id",
        "VARCHAR(36)",
        "X(36)",
        true,
        false,
        false,
        "UUID_GEN()",
        "Valid UUID format",
        "Unique surrogate identifier for the user account",
        null
      ],
      [
        "role_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        false,
        "None",
        "Must exist in system_roles(role_id)",
        "Foreign key to the RBAC authorization role",
        "system_roles(role_id)"
      ],
      [
        "username",
        "VARCHAR(50)",
        "X(50)",
        false,
        false,
        false,
        "None",
        "Regex: ^[a-zA-Z0-9_.]{3,50}$",
        "Unique system login handle",
        null
      ],
      [
        "email",
        "VARCHAR(100)",
        "X(100)",
        false,
        false,
        false,
        "None",
        "Regex: RFC 5322 Email Specification",
        "Unique corporate or personal email contact",
        null
      ],
      [
        "password_hash",
        "VARCHAR(255)",
        "X(255)",
        false,
        false,
        false,
        "None",
        "Argon2id or bcrypt hash format",
        "Secure cryptographic salted hash of password",
        null
      ],
      [
        "full_name",
        "VARCHAR(100)",
        "X(100)",
        false,
        false,
        false,
        "None",
        "Length [2..100]",
        "Full legal name of the employee or stakeholder",
        null
      ],
      [
        "phone_number",
        "VARCHAR(30)",
        "X(30)",
        false,
        false,
        true,
        "NULL",
        "E.164 phone format",
        "Mobile or emergency contact telephone",
        null
      ],
      [
        "is_active",
        "BOOLEAN",
        "Bit (0/1)",
        false,
        false,
        false,
        "TRUE",
        "Discrete: {TRUE, FALSE}",
        "Account status flag; FALSE revokes access",
        null
      ],
      [
        "last_login_at",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        true,
        "NULL",
        "Valid ISO-8601 timestamp",
        "Timestamp of most recent successful auth",
        null
      ],
      [
        "created_at",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        false,
        "CURRENT_TIMESTAMP",
        "Valid ISO-8601 timestamp",
        "Account provision date",
        null
      ]
    ]
  },
  {
    "name": "plot_fields",
    "alias": "T03_PLOTS",
    "ds_id": "D3.1",
    "desc": "Geographical farm land parcels, soil profiles, acreage, and active agricultural crop occupancy.",
    "file_type": "Spatial & Relational Indexed Table (PostGIS / MySQL Spatial)",
    "avg_records": "50",
    "max_records": "500",
    "growth_pct": "10% per annum",
    "columns": [
      [
        "plot_id",
        "VARCHAR(36)",
        "X(36)",
        true,
        false,
        false,
        "UUID_GEN()",
        "Valid UUID format",
        "Unique identifier for the geographic field",
        null
      ],
      [
        "plot_name",
        "VARCHAR(100)",
        "X(100)",
        false,
        false,
        false,
        "None",
        "Unique text label, e.g. 'North Field Sector 4'",
        "Human-readable farm zone or plot name",
        null
      ],
      [
        "acreage",
        "DECIMAL(8,2)",
        "999999.99",
        false,
        false,
        false,
        "None",
        "Continuous: > 0.00",
        "Physical size of plot in acres or hectares",
        null
      ],
      [
        "soil_type",
        "VARCHAR(50)",
        "X(50)",
        false,
        false,
        true,
        "NULL",
        "Discrete: {'LOAM', 'CLAY', 'SANDY_LOAM', 'SILT', 'PEAT', 'CHALK'}",
        "Pedological classification of the soil",
        null
      ],
      [
        "gps_polygon",
        "TEXT",
        "X(Unlimited)",
        false,
        false,
        true,
        "NULL",
        "GeoJSON or Well-Known Text (WKT)",
        "Geospatial boundary coordinates of the plot",
        null
      ],
      [
        "current_crop",
        "VARCHAR(50)",
        "X(50)",
        false,
        false,
        true,
        "NULL",
        "Alphanumeric length <= 50",
        "Active crop variety currently cultivated",
        null
      ],
      [
        "status",
        "VARCHAR(30)",
        "X(30)",
        false,
        false,
        false,
        "'ACTIVE'",
        "Discrete: {'ACTIVE', 'FALLOW', 'PREPARATION', 'HARVESTED', 'QUARANTINE'}",
        "Current agronomic operational status",
        null
      ],
      [
        "created_at",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        false,
        "CURRENT_TIMESTAMP",
        "Valid ISO-8601 timestamp",
        "Creation audit timestamp",
        null
      ]
    ]
  },
  {
    "name": "storage_locations",
    "alias": "T04_LOCATIONS",
    "ds_id": "D2.1",
    "desc": "Physical storage infrastructure including silos, warehouses, chemical bunkers, cold stores, and bin partitions.",
    "file_type": "Hierarchical Relational B-Tree Table",
    "avg_records": "30",
    "max_records": "200",
    "growth_pct": "15% per annum",
    "columns": [
      [
        "location_id",
        "VARCHAR(36)",
        "X(36)",
        true,
        false,
        false,
        "UUID_GEN()",
        "Valid UUID format",
        "Primary key for the storage location/zone",
        null
      ],
      [
        "facility_name",
        "VARCHAR(100)",
        "X(100)",
        false,
        false,
        false,
        "None",
        "Length [2..100]",
        "Parent facility name (e.g. 'Central Silo Complex A')",
        null
      ],
      [
        "zone_code",
        "VARCHAR(30)",
        "X(30)",
        false,
        false,
        false,
        "None",
        "Unique alphanumeric code, e.g. 'SEC-B-04'",
        "Partition or sub-zone location code",
        null
      ],
      [
        "storage_type",
        "VARCHAR(50)",
        "X(50)",
        false,
        false,
        false,
        "None",
        "Discrete: {'GRAIN_SILO', 'CHEMICAL_BUNKER', 'COLD_STORAGE', 'EQUIPMENT_SHED', 'OPEN_YARD'}",
        "Environmental storage classification",
        null
      ],
      [
        "max_capacity",
        "DECIMAL(12,2)",
        "9999999999.99",
        false,
        false,
        false,
        "None",
        "Continuous: > 0.00",
        "Maximum permissible volumetric or weight capacity",
        null
      ],
      [
        "current_occupancy",
        "DECIMAL(12,2)",
        "9999999999.99",
        false,
        false,
        false,
        "0.00",
        "Continuous: >= 0.00 AND <= max_capacity",
        "Current physical volume occupied by goods",
        null
      ],
      [
        "is_temperature_ctrl",
        "BOOLEAN",
        "Bit (0/1)",
        false,
        false,
        false,
        "FALSE",
        "Discrete: {TRUE, FALSE}",
        "HVAC / Refrigeration control capabilities",
        null
      ],
      [
        "created_at",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        false,
        "CURRENT_TIMESTAMP",
        "Valid ISO-8601 timestamp",
        "Location registration timestamp",
        null
      ]
    ]
  },
  {
    "name": "equipment_assets",
    "alias": "T05_EQUIPMENT",
    "ds_id": "D5",
    "desc": "Agricultural machinery, tractors, combine harvesters, irrigation pumps, and fleet implements (DFD Data Store D5).",
    "file_type": "Relational Asset Register Table",
    "avg_records": "80",
    "max_records": "1,000",
    "growth_pct": "10% per annum",
    "columns": [
      [
        "asset_id",
        "VARCHAR(36)",
        "X(36)",
        true,
        false,
        false,
        "UUID_GEN()",
        "Valid UUID format",
        "Primary identifier for the farm equipment asset",
        null
      ],
      [
        "asset_name",
        "VARCHAR(100)",
        "X(100)",
        false,
        false,
        false,
        "None",
        "Length [2..100]",
        "Manufacturer make and model description",
        null
      ],
      [
        "serial_number",
        "VARCHAR(50)",
        "X(50)",
        false,
        false,
        false,
        "None",
        "Unique alphanumeric VIN/Serial",
        "Factory chassis/serial identifier",
        null
      ],
      [
        "maintenance_interval_hrs",
        "INT",
        "9999",
        false,
        false,
        false,
        "250",
        "Continuous: > 0",
        "Operating service interval limit in running hours",
        null
      ],
      [
        "hours_operated",
        "DECIMAL(8,2)",
        "999999.99",
        false,
        false,
        false,
        "0.00",
        "Continuous: >= 0.00",
        "Total cumulative engine runtime hours",
        null
      ],
      [
        "last_service_date",
        "DATE",
        "YYYY-MM-DD",
        false,
        false,
        true,
        "NULL",
        "Valid calendar date <= CURRENT_DATE",
        "Date of last comprehensive inspection",
        null
      ],
      [
        "operational_status",
        "VARCHAR(30)",
        "X(30)",
        false,
        false,
        false,
        "'OPERATIONAL'",
        "Discrete: {'OPERATIONAL', 'MAINTENANCE_DUE', 'UNDER_REPAIR', 'DECOMMISSIONED'}",
        "Real-time mechanical availability status",
        null
      ],
      [
        "created_at",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        false,
        "CURRENT_TIMESTAMP",
        "Valid ISO-8601 timestamp",
        "Asset intake timestamp",
        null
      ]
    ]
  },
  {
    "name": "suppliers",
    "alias": "T06_SUPPLIERS",
    "ds_id": "D7",
    "desc": "Commercial vendors, seed breeders, fertilizer manufacturers, and equipment part providers (DFD Data Store D7).",
    "file_type": "Relational Vendor Directory Table",
    "avg_records": "40",
    "max_records": "300",
    "growth_pct": "15% per annum",
    "columns": [
      [
        "supplier_id",
        "VARCHAR(36)",
        "X(36)",
        true,
        false,
        false,
        "UUID_GEN()",
        "Valid UUID format",
        "Primary vendor surrogate key",
        null
      ],
      [
        "company_name",
        "VARCHAR(100)",
        "X(100)",
        false,
        false,
        false,
        "None",
        "Length [2..100]",
        "Registered commercial corporate legal name",
        null
      ],
      [
        "contact_person",
        "VARCHAR(100)",
        "X(100)",
        false,
        false,
        true,
        "NULL",
        "Length [2..100]",
        "Account manager or sales rep contact",
        null
      ],
      [
        "email",
        "VARCHAR(100)",
        "X(100)",
        false,
        false,
        false,
        "None",
        "RFC 5322 Email format",
        "Commercial correspondence email address",
        null
      ],
      [
        "phone",
        "VARCHAR(30)",
        "X(30)",
        false,
        false,
        true,
        "NULL",
        "E.164 phone format",
        "Business telephone number",
        null
      ],
      [
        "payment_terms",
        "VARCHAR(50)",
        "X(50)",
        false,
        false,
        false,
        "'NET_30'",
        "Discrete: {'IMMEDIATE', 'NET_15', 'NET_30', 'NET_60', 'CONSIGNMENT'}",
        "Contractual procurement payment terms",
        null
      ],
      [
        "reliability_rating",
        "DECIMAL(3,2)",
        "9.99",
        false,
        false,
        false,
        "5.00",
        "Continuous: Range [1.00..5.00]",
        "Performance evaluation score based on fulfillment velocity",
        null
      ],
      [
        "created_at",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        false,
        "CURRENT_TIMESTAMP",
        "Valid ISO-8601 timestamp",
        "Vendor onboarding timestamp",
        null
      ]
    ]
  },
  {
    "name": "inventory_items",
    "alias": "T07_ITEMS",
    "ds_id": "D2",
    "desc": "Master item catalog for seeds, fertilizers, pesticides, livestock feeds, fuel, and spare parts (DFD Data Store D2).",
    "file_type": "Relational Catalog Table (Clustered B-Tree on item_id & sku_code)",
    "avg_records": "500",
    "max_records": "10,000",
    "growth_pct": "25% per annum",
    "columns": [
      [
        "item_id",
        "VARCHAR(36)",
        "X(36)",
        true,
        false,
        false,
        "UUID_GEN()",
        "Valid UUID format",
        "Unique master inventory item identifier",
        null
      ],
      [
        "location_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        false,
        "None",
        "Must exist in storage_locations(location_id)",
        "Default primary storage warehouse/zone",
        "storage_locations(location_id)"
      ],
      [
        "sku_code",
        "VARCHAR(50)",
        "X(50)",
        false,
        false,
        false,
        "None",
        "Unique alphanumeric code, e.g. 'CHEM-NPK-20-20'",
        "Stock Keeping Unit enterprise barcode",
        null
      ],
      [
        "item_name",
        "VARCHAR(100)",
        "X(100)",
        false,
        false,
        false,
        "None",
        "Length [2..100]",
        "Descriptive title of consumable or good",
        null
      ],
      [
        "category",
        "VARCHAR(50)",
        "X(50)",
        false,
        false,
        false,
        "None",
        "Discrete: {'CROP_SEED', 'FERTILIZER', 'PESTICIDE', 'FEED', 'FUEL', 'SPARE_PART'}",
        "Master taxonomy classification",
        null
      ],
      [
        "unit_of_measure",
        "VARCHAR(20)",
        "X(20)",
        false,
        false,
        false,
        "None",
        "Discrete: {'KG', 'TONNE', 'LITRE', 'BAG_50KG', 'CANISTER', 'UNIT'}",
        "Standard unit of quantity quantification",
        null
      ],
      [
        "current_quantity",
        "DECIMAL(12,2)",
        "9999999999.99",
        false,
        false,
        false,
        "0.00",
        "Continuous: >= 0.00",
        "Real-time physically available on-hand balance",
        null
      ],
      [
        "unit_cost",
        "DECIMAL(10,2)",
        "99999999.99",
        false,
        false,
        false,
        "0.00",
        "Continuous: >= 0.00",
        "Weighted average unit acquisition cost (WAC)",
        null
      ],
      [
        "reorder_point",
        "DECIMAL(10,2)",
        "99999999.99",
        false,
        false,
        false,
        "10.00",
        "Continuous: >= 0.00",
        "Dynamic safety replenishment threshold trigger",
        null
      ],
      [
        "safety_stock",
        "DECIMAL(10,2)",
        "99999999.99",
        false,
        false,
        false,
        "5.00",
        "Continuous: >= 0.00",
        "Buffer stock level to absorb lead-time spikes",
        null
      ],
      [
        "created_at",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        false,
        "CURRENT_TIMESTAMP",
        "Valid ISO-8601 timestamp",
        "Master item catalog registration timestamp",
        null
      ]
    ]
  },
  {
    "name": "batch_lots",
    "alias": "T08_LOTS",
    "ds_id": "D2.2",
    "desc": "Discrete production batches, chemical formulation lot numbers, expiration dates, and QR traceability hashes.",
    "file_type": "Relational Lot Traceability Table",
    "avg_records": "2,000",
    "max_records": "50,000",
    "growth_pct": "35% per annum",
    "columns": [
      [
        "lot_id",
        "VARCHAR(36)",
        "X(36)",
        true,
        false,
        false,
        "UUID_GEN()",
        "Valid UUID format",
        "Unique identifier for physical lot/batch",
        null
      ],
      [
        "item_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        false,
        "None",
        "Must exist in inventory_items(item_id)",
        "Associated parent catalog item",
        "inventory_items(item_id)"
      ],
      [
        "lot_number",
        "VARCHAR(50)",
        "X(50)",
        false,
        false,
        false,
        "None",
        "Alphanumeric, e.g. 'LOT-2026-B91'",
        "Manufacturer or harvest batch stamp number",
        null
      ],
      [
        "initial_quantity",
        "DECIMAL(12,2)",
        "9999999999.99",
        false,
        false,
        false,
        "None",
        "Continuous: > 0.00",
        "Quantity originally received into lot",
        null
      ],
      [
        "remaining_quantity",
        "DECIMAL(12,2)",
        "9999999999.99",
        false,
        false,
        false,
        "None",
        "Continuous: >= 0.00 AND <= initial_quantity",
        "Remaining undepleted balance in this lot",
        null
      ],
      [
        "manufacture_date",
        "DATE",
        "YYYY-MM-DD",
        false,
        false,
        true,
        "NULL",
        "Valid date <= CURRENT_DATE",
        "Date manufactured, blended, or packaged",
        null
      ],
      [
        "expiration_date",
        "DATE",
        "YYYY-MM-DD",
        false,
        false,
        true,
        "NULL",
        "Valid date >= manufacture_date",
        "Expiration date after which chemical spoils",
        null
      ],
      [
        "qr_code_hash",
        "VARCHAR(64)",
        "X(64)",
        false,
        false,
        false,
        "None",
        "SHA-256 cryptographic string",
        "Cryptographic hash printed on barcode / QR label",
        null
      ],
      [
        "created_at",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        false,
        "CURRENT_TIMESTAMP",
        "Valid ISO-8601 timestamp",
        "Lot intake timestamp",
        null
      ]
    ]
  },
  {
    "name": "crop_care_cycles",
    "alias": "T09_CYCLES",
    "ds_id": "D3.2",
    "desc": "Agronomic care protocols, fertilizer application schedules, chemical dosages, and phenological targets.",
    "file_type": "Relational Protocol Registry Table",
    "avg_records": "150",
    "max_records": "2,000",
    "growth_pct": "20% per annum",
    "columns": [
      [
        "cycle_id",
        "VARCHAR(36)",
        "X(36)",
        true,
        false,
        false,
        "UUID_GEN()",
        "Valid UUID format",
        "Primary key for agronomic care cycle",
        null
      ],
      [
        "plot_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        false,
        "None",
        "Must exist in plot_fields(plot_id)",
        "Plot where this treatment schedule applies",
        "plot_fields(plot_id)"
      ],
      [
        "protocol_name",
        "VARCHAR(100)",
        "X(100)",
        false,
        false,
        false,
        "None",
        "Length [2..100]",
        "Name of treatment (e.g. 'Pre-Emergence Herbicide Cycle')",
        null
      ],
      [
        "target_stage",
        "VARCHAR(50)",
        "X(50)",
        false,
        false,
        false,
        "None",
        "Discrete: {'SEEDLING', 'TILLERING', 'FLOWERING', 'RIPENING', 'POST_HARVEST'}",
        "Phenological crop growth stage target",
        null
      ],
      [
        "scheduled_date",
        "DATE",
        "YYYY-MM-DD",
        false,
        false,
        false,
        "None",
        "Valid calendar date",
        "Target execution date for chemical application",
        null
      ],
      [
        "dosage_formula",
        "VARCHAR(100)",
        "X(100)",
        false,
        false,
        false,
        "None",
        "Alphanumeric formula, e.g. '2.5L / Hectare'",
        "Standard agronomic application dilution formula",
        null
      ],
      [
        "is_completed",
        "BOOLEAN",
        "Bit (0/1)",
        false,
        false,
        false,
        "FALSE",
        "Discrete: {TRUE, FALSE}",
        "Execution completion state indicator",
        null
      ],
      [
        "created_at",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        false,
        "CURRENT_TIMESTAMP",
        "Valid ISO-8601 timestamp",
        "Protocol creation timestamp",
        null
      ]
    ]
  },
  {
    "name": "field_activity_logs",
    "alias": "T10_ACTIVITIES",
    "ds_id": "D3",
    "desc": "Operational field logs submitted by workers, recording hours, materials consumed, review approvals, and depletion (DFD Data Store D3).",
    "file_type": "Transaction Journal Table (High volume, indexed on worker & plot)",
    "avg_records": "5,000",
    "max_records": "100,000",
    "growth_pct": "40% per annum",
    "columns": [
      [
        "log_id",
        "VARCHAR(36)",
        "X(36)",
        true,
        false,
        false,
        "UUID_GEN()",
        "Valid UUID format",
        "Unique operational activity record key",
        null
      ],
      [
        "worker_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        false,
        "None",
        "Must exist in user_accounts(user_id)",
        "Farm Worker who conducted and logged field work",
        "user_accounts(user_id)"
      ],
      [
        "plot_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        false,
        "None",
        "Must exist in plot_fields(plot_id)",
        "Plot where operational activity took place",
        "plot_fields(plot_id)"
      ],
      [
        "item_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        true,
        "NULL",
        "Must exist in inventory_items(item_id) if not null",
        "Consumable input utilized (seeds, fertilizer, fuel)",
        "inventory_items(item_id)"
      ],
      [
        "activity_type",
        "VARCHAR(50)",
        "X(50)",
        false,
        false,
        false,
        "None",
        "Discrete: {'PLANTING', 'FERTILIZING', 'SPRAYING', 'IRRIGATION', 'HARVESTING', 'TILLING'}",
        "Operational nature of field work conducted",
        null
      ],
      [
        "activity_date",
        "DATE",
        "YYYY-MM-DD",
        false,
        false,
        false,
        "CURRENT_DATE",
        "Valid calendar date <= CURRENT_DATE",
        "Date on which field operation occurred",
        null
      ],
      [
        "hours_spent",
        "DECIMAL(6,2)",
        "9999.99",
        false,
        false,
        false,
        "None",
        "Continuous: > 0.00 AND <= 24.00",
        "Total labor hours expended by worker",
        null
      ],
      [
        "quantity_consumed",
        "DECIMAL(10,2)",
        "99999999.99",
        false,
        false,
        false,
        "0.00",
        "Continuous: >= 0.00",
        "Quantity of inventory item consumed in work",
        null
      ],
      [
        "validation_status",
        "VARCHAR(30)",
        "X(30)",
        false,
        false,
        false,
        "'PENDING'",
        "Discrete: {'DRAFT', 'OFFLINE_QUEUED', 'PENDING', 'APPROVED', 'REJECTED', 'DEPLETED'}",
        "Current administrative validation state",
        null
      ],
      [
        "manager_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        true,
        "NULL",
        "Must exist in user_accounts(user_id) if not null",
        "Manager account who authorized or rejected log",
        "user_accounts(user_id)"
      ],
      [
        "approval_date",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        true,
        "NULL",
        "Valid timestamp >= activity_date",
        "Timestamp when manager approved the submission",
        null
      ],
      [
        "notes",
        "TEXT",
        "X(Unlimited)",
        false,
        false,
        true,
        "NULL",
        "Freeform notes",
        "Worker notes or manager review justification",
        null
      ],
      [
        "created_at",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        false,
        "CURRENT_TIMESTAMP",
        "Valid ISO-8601 timestamp",
        "Record creation timestamp",
        null
      ]
    ]
  },
  {
    "name": "stock_transfers",
    "alias": "T11_TRANSFERS",
    "ds_id": "D2.3",
    "desc": "Inter-location inventory movements, transfers between silos, chemical bunkers, or transit vehicles.",
    "file_type": "Relational Transfer Audit Table",
    "avg_records": "800",
    "max_records": "15,000",
    "growth_pct": "30% per annum",
    "columns": [
      [
        "transfer_id",
        "VARCHAR(36)",
        "X(36)",
        true,
        false,
        false,
        "UUID_GEN()",
        "Valid UUID format",
        "Unique surrogate key for transfer dispatch",
        null
      ],
      [
        "item_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        false,
        "None",
        "Must exist in inventory_items(item_id)",
        "Inventory item being transferred",
        "inventory_items(item_id)"
      ],
      [
        "source_location_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        false,
        "None",
        "Must exist in storage_locations(location_id)",
        "Origin storage zone/facility",
        "storage_locations(location_id)"
      ],
      [
        "dest_location_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        false,
        "None",
        "Must exist in storage_locations(location_id)",
        "Target destination storage zone/facility",
        "storage_locations(location_id)"
      ],
      [
        "initiated_by_user",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        false,
        "None",
        "Must exist in user_accounts(user_id)",
        "Worker/Manager who dispatched transfer",
        "user_accounts(user_id)"
      ],
      [
        "transfer_quantity",
        "DECIMAL(12,2)",
        "9999999999.99",
        false,
        false,
        false,
        "None",
        "Continuous: > 0.00",
        "Physical quantity moved across locations",
        null
      ],
      [
        "transfer_status",
        "VARCHAR(30)",
        "X(30)",
        false,
        false,
        false,
        "'PENDING'",
        "Discrete: {'PENDING', 'IN_TRANSIT', 'COMPLETED', 'DISCREPANCY_REJECTED'}",
        "Custody transfer progression state",
        null
      ],
      [
        "dispatched_at",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        false,
        "CURRENT_TIMESTAMP",
        "Valid ISO-8601 timestamp",
        "Timestamp when cargo left origin location",
        null
      ],
      [
        "received_at",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        true,
        "NULL",
        "Valid timestamp >= dispatched_at",
        "Timestamp when cargo was signed into destination",
        null
      ]
    ]
  },
  {
    "name": "purchase_orders",
    "alias": "T12_PO_HEADER",
    "ds_id": "D7.1",
    "desc": "Commercial procurement purchase orders dispatched to external vendors, tracking delivery, terms, and fulfillment status.",
    "file_type": "Relational Header Order Table (Indexed on po_number & supplier_id)",
    "avg_records": "300",
    "max_records": "5,000",
    "growth_pct": "25% per annum",
    "columns": [
      [
        "po_id",
        "VARCHAR(36)",
        "X(36)",
        true,
        false,
        false,
        "UUID_GEN()",
        "Valid UUID format",
        "Primary surrogate identifier for PO",
        null
      ],
      [
        "supplier_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        false,
        "None",
        "Must exist in suppliers(supplier_id)",
        "Target supplier fulfilling the requisition",
        "suppliers(supplier_id)"
      ],
      [
        "manager_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        false,
        "None",
        "Must exist in user_accounts(user_id)",
        "Manager authorizing the purchase expenditure",
        "user_accounts(user_id)"
      ],
      [
        "po_number",
        "VARCHAR(50)",
        "X(50)",
        false,
        false,
        false,
        "None",
        "Unique alphanumeric code, e.g. 'PO-2026-084'",
        "External invoice and order reference number",
        null
      ],
      [
        "issue_date",
        "DATE",
        "YYYY-MM-DD",
        false,
        false,
        false,
        "CURRENT_DATE",
        "Valid calendar date",
        "Date PO was formally transmitted to vendor",
        null
      ],
      [
        "expected_delivery",
        "DATE",
        "YYYY-MM-DD",
        false,
        false,
        false,
        "None",
        "Valid calendar date >= issue_date",
        "Agreed contractual delivery arrival date",
        null
      ],
      [
        "total_amount",
        "DECIMAL(12,2)",
        "9999999999.99",
        false,
        false,
        false,
        "0.00",
        "Continuous: >= 0.00",
        "Sum total financial commitment of line items",
        null
      ],
      [
        "po_status",
        "VARCHAR(30)",
        "X(30)",
        false,
        false,
        false,
        "'DRAFT'",
        "Discrete: {'DRAFT', 'ISSUED', 'DISPATCHED', 'IN_TRANSIT', 'INSPECTION', 'FULFILLED', 'DISPUTED', 'CANCELLED'}",
        "Current procurement lifecycle phase",
        null
      ],
      [
        "payment_terms",
        "VARCHAR(50)",
        "X(50)",
        false,
        false,
        false,
        "'NET_30'",
        "Discrete: {'IMMEDIATE', 'NET_15', 'NET_30', 'NET_60'}",
        "Contract settlement terms for the order",
        null
      ],
      [
        "dispatched_at",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        true,
        "NULL",
        "Valid ISO-8601 timestamp",
        "Timestamp when vendor acknowledged order",
        null
      ],
      [
        "created_at",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        false,
        "CURRENT_TIMESTAMP",
        "Valid ISO-8601 timestamp",
        "Requisition draft creation timestamp",
        null
      ]
    ]
  },
  {
    "name": "po_line_items",
    "alias": "T13_PO_LINES",
    "ds_id": "D7.2",
    "desc": "Individual line item breakdowns of purchase orders, specifying ordered vs received quantities and contracted unit prices.",
    "file_type": "Relational Detail Line Table (Foreign Key to purchase_orders)",
    "avg_records": "1,200",
    "max_records": "25,000",
    "growth_pct": "30% per annum",
    "columns": [
      [
        "line_id",
        "VARCHAR(36)",
        "X(36)",
        true,
        false,
        false,
        "UUID_GEN()",
        "Valid UUID format",
        "Primary surrogate key for the order line",
        null
      ],
      [
        "po_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        false,
        "None",
        "Must exist in purchase_orders(po_id)",
        "Associated parent purchase order",
        "purchase_orders(po_id)"
      ],
      [
        "item_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        false,
        "None",
        "Must exist in inventory_items(item_id)",
        "Catalog item being procured",
        "inventory_items(item_id)"
      ],
      [
        "line_number",
        "INT",
        "999",
        false,
        false,
        false,
        "1",
        "Continuous: > 0",
        "Sequential line number (1, 2, 3...)",
        null
      ],
      [
        "order_quantity",
        "DECIMAL(10,2)",
        "99999999.99",
        false,
        false,
        false,
        "None",
        "Continuous: > 0.00",
        "Quantity ordered from vendor",
        null
      ],
      [
        "received_quantity",
        "DECIMAL(10,2)",
        "99999999.99",
        false,
        false,
        false,
        "0.00",
        "Continuous: >= 0.00 AND <= order_quantity * 1.10",
        "Quantity inspected and accepted at receiving dock",
        null
      ],
      [
        "unit_price",
        "DECIMAL(10,2)",
        "99999999.99",
        false,
        false,
        false,
        "None",
        "Continuous: >= 0.00",
        "Contracted unit price in transactional currency",
        null
      ],
      [
        "subtotal",
        "DECIMAL(12,2)",
        "9999999999.99",
        false,
        false,
        false,
        "None",
        "Formula: order_quantity * unit_price",
        "Computed line amount before tax",
        null
      ]
    ]
  },
  {
    "name": "cost_centers",
    "alias": "T14_COST_CENTERS",
    "ds_id": "D4.1",
    "desc": "Organizational financial allocation centers for crop agronomy, livestock dairy, equipment fleet, and administrative overhead.",
    "file_type": "Relational Financial Master Table",
    "avg_records": "15",
    "max_records": "100",
    "growth_pct": "10% per annum",
    "columns": [
      [
        "cost_center_id",
        "VARCHAR(36)",
        "X(36)",
        true,
        false,
        false,
        "UUID_GEN()",
        "Valid UUID format",
        "Primary identifier for cost center",
        null
      ],
      [
        "center_code",
        "VARCHAR(30)",
        "X(30)",
        false,
        false,
        false,
        "None",
        "Unique alphanumeric code, e.g. 'CC-AGRONOMY-01'",
        "Financial ledger account cost center code",
        null
      ],
      [
        "center_name",
        "VARCHAR(100)",
        "X(100)",
        false,
        false,
        false,
        "None",
        "Length [2..100]",
        "Organizational division or farm sector name",
        null
      ],
      [
        "annual_budget",
        "DECIMAL(14,2)",
        "999999999999.99",
        false,
        false,
        false,
        "0.00",
        "Continuous: >= 0.00",
        "Annual allocated operating expense budget",
        null
      ],
      [
        "fiscal_year",
        "INT",
        "9999",
        false,
        false,
        false,
        "2026",
        "Range [2020..2050]",
        "Target financial calendar accounting year",
        null
      ],
      [
        "created_at",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        false,
        "CURRENT_TIMESTAMP",
        "Valid ISO-8601 timestamp",
        "Cost center provisioning timestamp",
        null
      ]
    ]
  },
  {
    "name": "financial_journal_entries",
    "alias": "T15_GL_JOURNAL",
    "ds_id": "D4",
    "desc": "Double-entry general ledger journal entries recording material depletion costs, procurement liabilities, and sales revenues (DFD Data Store D4).",
    "file_type": "Immutable Financial Ledger Table (Append-only, SHA-256 hash verified)",
    "avg_records": "10,000",
    "max_records": "250,000",
    "growth_pct": "45% per annum",
    "columns": [
      [
        "entry_id",
        "VARCHAR(36)",
        "X(36)",
        true,
        false,
        false,
        "UUID_GEN()",
        "Valid UUID format",
        "Unique primary surrogate key for ledger transaction",
        null
      ],
      [
        "cost_center_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        false,
        "None",
        "Must exist in cost_centers(cost_center_id)",
        "Associated cost center absorbing expense/revenue",
        "cost_centers(cost_center_id)"
      ],
      [
        "source_activity_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        true,
        "NULL",
        "Must exist in field_activity_logs(log_id) if not null",
        "Upstream field activity triggering depletion posting",
        "field_activity_logs(log_id)"
      ],
      [
        "source_po_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        true,
        "NULL",
        "Must exist in purchase_orders(po_id) if not null",
        "Upstream purchase order triggering payable liability",
        "purchase_orders(po_id)"
      ],
      [
        "source_sales_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        true,
        "NULL",
        "Must exist in sales_orders(sales_order_id) if not null",
        "Upstream sales order triggering receivable revenue",
        "sales_orders(sales_order_id)"
      ],
      [
        "entry_date",
        "DATE",
        "YYYY-MM-DD",
        false,
        false,
        false,
        "CURRENT_DATE",
        "Valid calendar date",
        "Accounting posting effective transaction date",
        null
      ],
      [
        "account_code",
        "VARCHAR(50)",
        "X(50)",
        false,
        false,
        false,
        "None",
        "Discrete: {'5100-RAW-MATERIALS', '1200-INVENTORY-ASSET', '2000-ACCOUNTS-PAYABLE', '4000-CROP-SALES', '6100-EQUIPMENT-REPAIRS'}",
        "Standard Chart of Accounts (COA) number",
        null
      ],
      [
        "debit_amount",
        "DECIMAL(12,2)",
        "9999999999.99",
        false,
        false,
        false,
        "0.00",
        "Continuous: >= 0.00",
        "Debit amount posted in transactional currency",
        null
      ],
      [
        "credit_amount",
        "DECIMAL(12,2)",
        "9999999999.99",
        false,
        false,
        false,
        "0.00",
        "Continuous: >= 0.00",
        "Credit amount posted in transactional currency",
        null
      ],
      [
        "audit_hash",
        "VARCHAR(64)",
        "X(64)",
        false,
        false,
        false,
        "None",
        "SHA-256 cryptographic hex digest",
        "Tamper-evident blockchain/merkle hash of entry",
        null
      ],
      [
        "created_at",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        false,
        "CURRENT_TIMESTAMP",
        "Valid ISO-8601 timestamp",
        "System commit timestamp",
        null
      ]
    ]
  },
  {
    "name": "customers",
    "alias": "T16_CUSTOMERS",
    "ds_id": "D4.2",
    "desc": "Commercial agricultural offtakers, grain wholesalers, wholesale supermarkets, and cooperative buyers.",
    "file_type": "Relational Customer Directory Table",
    "avg_records": "50",
    "max_records": "500",
    "growth_pct": "20% per annum",
    "columns": [
      [
        "customer_id",
        "VARCHAR(36)",
        "X(36)",
        true,
        false,
        false,
        "UUID_GEN()",
        "Valid UUID format",
        "Primary surrogate identifier for customer",
        null
      ],
      [
        "customer_name",
        "VARCHAR(100)",
        "X(100)",
        false,
        false,
        false,
        "None",
        "Length [2..100]",
        "Commercial trading business name",
        null
      ],
      [
        "contact_email",
        "VARCHAR(100)",
        "X(100)",
        false,
        false,
        false,
        "None",
        "RFC 5322 Email format",
        "Primary accounting/billing email contact",
        null
      ],
      [
        "phone",
        "VARCHAR(30)",
        "X(30)",
        false,
        false,
        true,
        "NULL",
        "E.164 phone format",
        "Business contact telephone",
        null
      ],
      [
        "billing_address",
        "TEXT",
        "X(Unlimited)",
        false,
        false,
        true,
        "NULL",
        "Freeform postal text",
        "Registered corporate invoice billing address",
        null
      ],
      [
        "customer_type",
        "VARCHAR(30)",
        "X(30)",
        false,
        false,
        false,
        "'WHOLESALER'",
        "Discrete: {'WHOLESALER', 'RETAILER', 'COOPERATIVE', 'FOOD_PROCESSOR', 'DIRECT_CONSUMER'}",
        "Market segment classification",
        null
      ],
      [
        "credit_limit",
        "DECIMAL(12,2)",
        "9999999999.99",
        false,
        false,
        false,
        "50000.00",
        "Continuous: >= 0.00",
        "Approved revolving accounts receivable credit limit",
        null
      ],
      [
        "created_at",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        false,
        "CURRENT_TIMESTAMP",
        "Valid ISO-8601 timestamp",
        "Customer account creation timestamp",
        null
      ]
    ]
  },
  {
    "name": "sales_orders",
    "alias": "T17_SALES_ORDERS",
    "ds_id": "D4.3",
    "desc": "Commercial harvest bulk sales contracts, customer deliveries, dispatch invoices, and revenue settlements.",
    "file_type": "Relational Sales Order Table",
    "avg_records": "400",
    "max_records": "8,000",
    "growth_pct": "30% per annum",
    "columns": [
      [
        "sales_order_id",
        "VARCHAR(36)",
        "X(36)",
        true,
        false,
        false,
        "UUID_GEN()",
        "Valid UUID format",
        "Primary identifier for customer sales order",
        null
      ],
      [
        "customer_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        false,
        "None",
        "Must exist in customers(customer_id)",
        "Offtaker purchasing the agricultural produce",
        "customers(customer_id)"
      ],
      [
        "item_id",
        "VARCHAR(36)",
        "X(36)",
        false,
        true,
        false,
        "None",
        "Must exist in inventory_items(item_id)",
        "Harvested commodity product sold",
        "inventory_items(item_id)"
      ],
      [
        "order_number",
        "VARCHAR(50)",
        "X(50)",
        false,
        false,
        false,
        "None",
        "Unique alphanumeric code, e.g. 'SO-2026-441'",
        "Sales invoice / dispatch docket reference number",
        null
      ],
      [
        "order_date",
        "DATE",
        "YYYY-MM-DD",
        false,
        false,
        false,
        "CURRENT_DATE",
        "Valid calendar date",
        "Contract agreed date",
        null
      ],
      [
        "dispatch_date",
        "DATE",
        "YYYY-MM-DD",
        false,
        false,
        true,
        "NULL",
        "Valid calendar date >= order_date",
        "Physical produce dispatch date",
        null
      ],
      [
        "sales_quantity",
        "DECIMAL(12,2)",
        "9999999999.99",
        false,
        false,
        false,
        "None",
        "Continuous: > 0.00",
        "Weight/volume of harvested goods delivered",
        null
      ],
      [
        "total_revenue",
        "DECIMAL(12,2)",
        "9999999999.99",
        false,
        false,
        false,
        "None",
        "Continuous: >= 0.00",
        "Gross contractual sales revenue before discounts",
        null
      ],
      [
        "settlement_status",
        "VARCHAR(30)",
        "X(30)",
        false,
        false,
        false,
        "'PENDING'",
        "Discrete: {'PENDING', 'INVOICED', 'PARTIALLY_PAID', 'SETTLED', 'DEFAULTED'}",
        "Accounts receivable payment settlement state",
        null
      ],
      [
        "created_at",
        "DATETIME",
        "YYYY-MM-DD HH:MM:SS",
        false,
        false,
        false,
        "CURRENT_TIMESTAMP",
        "Valid ISO-8601 timestamp",
        "Order creation timestamp",
        null
      ]
    ]
  }
];

class DatabaseSchemaViewer {
  constructor() {
    this.currentTableIndex = 0;
    this.init();
  }

  init() {
    this.renderTableTabs();
    this.renderCurrentTable();
    this.bindEvents();
  }

  renderTableTabs() {
    const tabsContainer = document.getElementById('dbTableTabs');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = '';
    DB_SCHEMA_DATA.forEach((tbl, idx) => {
      const btn = document.createElement('button');
      btn.className = `px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
        idx === this.currentTableIndex 
          ? 'bg-emerald-600 text-white shadow-sm' 
          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
      }`;
      btn.innerHTML = `<span>${tbl.name}</span><span class="text-[10px] opacity-75 px-1 py-0.2 bg-black/20 rounded">${tbl.ds_id}</span>`;
      btn.addEventListener('click', () => {
        this.currentTableIndex = idx;
        this.renderTableTabs();
        this.renderCurrentTable();
      });
      tabsContainer.appendChild(btn);
    });
  }

  renderCurrentTable() {
    const tbl = DB_SCHEMA_DATA[this.currentTableIndex];
    if (!tbl) return;

    // Header card
    const headerEl = document.getElementById('dbTableHeaderCard');
    if (headerEl) {
      headerEl.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border border-slate-700 shadow-lg">
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">${tbl.ds_id}</span>
              <span class="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 text-xs font-mono">${tbl.alias}</span>
              <span class="text-xs text-slate-400">• ${tbl.file_type}</span>
            </div>
            <h3 class="text-xl font-bold font-mono tracking-tight text-emerald-300">${tbl.name}</h3>
            <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">${tbl.desc}</p>
          </div>
          <div class="grid grid-cols-3 gap-3 text-center border-t sm:border-t-0 sm:border-l border-slate-700 pt-3 sm:pt-0 sm:pl-5">
            <div>
              <div class="text-[10px] uppercase font-bold text-slate-400">Avg Records</div>
              <div class="text-sm font-mono font-bold text-white mt-0.5">${tbl.avg_records}</div>
            </div>
            <div>
              <div class="text-[10px] uppercase font-bold text-slate-400">Max Capacity</div>
              <div class="text-sm font-mono font-bold text-emerald-400 mt-0.5">${tbl.max_records}</div>
            </div>
            <div>
              <div class="text-[10px] uppercase font-bold text-slate-400">Annual Growth</div>
              <div class="text-sm font-mono font-bold text-sky-400 mt-0.5">${tbl.growth_pct}</div>
            </div>
          </div>
        </div>
      `;
    }

    // Attributes Table
    const tbody = document.getElementById('dbAttributesTableBody');
    if (tbody) {
      tbody.innerHTML = '';
      tbl.columns.forEach(col => {
        const [cName, cType, fmtCode, isPk, isFk, isNull, defVal, validation, desc, fkRef] = col;
        
        let keyBadge = '<span class="text-slate-400">-</span>';
        if (isPk && isFk) {
          keyBadge = '<span class="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-bold">PK, FK</span>';
        } else if (isPk) {
          keyBadge = '<span class="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-bold">PK</span>';
        } else if (isFk) {
          keyBadge = '<span class="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 text-[10px] font-bold">FK</span>';
        }

        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs transition-colors';
        tr.innerHTML = `
          <td class="py-3 px-3 font-mono font-bold text-slate-900 dark:text-slate-100">${cName}</td>
          <td class="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">${cType}</td>
          <td class="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">${fmtCode}</td>
          <td class="py-3 px-3 text-center">${keyBadge}</td>
          <td class="py-3 px-3 text-center">${isNull ? '<span class="text-slate-400">Yes</span>' : '<span class="font-bold text-rose-500">No</span>'}</td>
          <td class="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">${defVal && defVal !== 'None' ? defVal : '<span class="text-slate-400 italic">None</span>'}</td>
          <td class="py-3 px-3 text-slate-700 dark:text-slate-300 font-mono text-[11px]">${validation}</td>
          <td class="py-3 px-3 text-slate-600 dark:text-slate-300">${desc}${fkRef ? `<br><span class="text-[10px] text-sky-500 font-mono">Ref: ${fkRef}</span>` : ''}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  bindEvents() {
    const searchInput = document.getElementById('dbTableSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filteredIndex = DB_SCHEMA_DATA.findIndex(t => 
          t.name.toLowerCase().includes(query) || 
          t.desc.toLowerCase().includes(query) ||
          t.columns.some(c => c[0].toLowerCase().includes(query))
        );
        if (filteredIndex >= 0) {
          this.currentTableIndex = filteredIndex;
          this.renderTableTabs();
          this.renderCurrentTable();
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.dbViewer = new DatabaseSchemaViewer();
});
