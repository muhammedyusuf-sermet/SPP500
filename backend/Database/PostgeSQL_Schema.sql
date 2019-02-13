CREATE TYPE spell_components AS ENUM ('Verbal', 'Somatic', 'Material');

CREATE TABLE "Spell" (
        "Name" varchar(50),
        "Level" integer DEFAULT 1,
        "Casting_Time" varchar(50) DEFAULT '1 action',
        "Range" varchar(50) DEFAULT '60 feet',
        "Components" spell_components ARRAY,
        "Material" varchar(500),
        "Duration" varchar(50),
        "Description" text ARRAY,
        "Higher_Level" text,
        "School" varchar(50),
        PRIMARY KEY ("Name"),
        CONSTRAINT Positive_Level CHECK ("Level" > 0)
);

CREATE TYPE tool_categories AS ENUM (
        'Artisan''s Tools',
        'Gaming Sets',
        'Musical Instrument',
        'Other Tools'
);

CREATE TABLE "Tool" (
        "Name" varchar(50),
        "Category" tool_categories,
        "Cost" varchar(20) DEFAULT '1 gp',
        "Weight" varchar(20) DEFAULT '1 lb.',
        "Description" text,
        PRIMARY KEY ("Name")
);

CREATE TABLE "Damage_Type" (
        "Name" varchar(50),
        "Description" varchar(500),
        PRIMARY KEY ("Name")
);

CREATE TYPE weapon_types AS ENUM ('Melee', 'Ranged', 'Other');
CREATE TYPE weapon_proficiencies AS ENUM ('Simple', 'Martial');

CREATE TABLE "Weapon" (
        "Name" varchar(50),
        "Proficiency" weapon_proficiencies,
        "Type" weapon_types,
        "Cost" varchar(20) DEFAULT '1 gp',
        "Damage" varchar(20) DEFAULT '1d4',
        "Range" varchar(20) DEFAULT '(5/-)',
        "Weight" integer DEFAULT '1 lb.',
        PRIMARY KEY ("Name")
);

CREATE TABLE "Property" (
        "Name" varchar(50),
        "Description" varchar(500),
        PRIMARY KEY ("Name")
);

CREATE TABLE "Weapon_Property" (
        "Weapon_Name" varchar(50) REFERENCES Weapon ("Name"),
        "Property_Name" varchar(50) REFERENCES Property ("Name"),
        "Damage_Modifier" varchar(20) DEFAULT '-',
        "Range_Modifier" varchar(20) DEFAULT '(-/-)',
        PRIMARY KEY ("Weapon_Name", "Property_Name")
);

CREATE TYPE armor_proficiencies AS ENUM ('Light', 'Medium', 'Heavy', 'Sheild');

CREATE TABLE "Armor" (
        "Name" varchar(50),
        "Proficiency" armor_proficiencies,
        "Cost" varchar(20) DEFAULT '1 gp',
        "Weight" integer DEFAULT '1 lb.',
        "Armor_Class" integer DEFAULT 1,
        "Dexterity_Bonus" boolean DEFAULT false,
        "Max_Bonus" integer DEFAULT null,
        "Min_Strength" integer DEFAULT null,
        "Stealth_Disadvantage" boolean DEFAULT false,
        PRIMARY KEY ("Name"),
        CONSTRAINT Positive_Armor_class CHECK ("Armor_Class" > 0)
);

CREATE TYPE adventuring_gear_categories AS ENUM (
        'Standard Gear',
        'Ammunition',
        'Holy Symbol',
        'Arcane focus',
        'Druidic focus',
        'Kit'
);

CREATE TABLE "Adventuring_Gear" (
        "Name" varchar(50),
        "Category" adventuring_gear_categories,
        "Cost" varchar(20) DEFAULT '1 gp',
        "Weight" integer DEFAULT '1 lb.',
        "Description" varchar(500),
        PRIMARY KEY ("Name")
);

CREATE TABLE "Pack_Contents" (
        "Pack_Name" varchar(50) REFERENCES "Equipment_Pack" ("Name"),
        "Gear_Name" varchar(50) REFERENCES "Adventuring_Gear" ("Name"),
        "Quantity" integer DEFAULT 1,
        PRIMARY KEY ("Pack_Name", "Gear_Name"),
        CONSTRAINT Positive_Quantity CHECK ("Quantity" > 0)
);

CREATE TABLE "Equipment_Pack" (
        "Name" varchar(50),
        "Cost" varchar(20) DEFAULT '1 gp',
        PRIMARY KEY ("Name")
);