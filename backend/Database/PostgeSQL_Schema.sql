CREATE TYPE spell_components AS ENUM ('Verbal', 'Somatic', 'Material');

CREATE TABLE "Spell" (
        "Name" varchar(50),
        "Level" integer,
        "Casting_Time" varchar(50),
        "Range" varchar(50),
        "Components" spell_components ARRAY,
        "Material" varchar(500),
        "Duration" varchar(50),
        "Description" text ARRAY,
        "Higher_Level" text,
        "School" varchar(50),
        CONSTRAINT Positive_Level CHECK ("Level" > 0),
        PRIMARY KEY ("Name")
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
        "Cost" varchar(20),
        "Weight" varchar(20),
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
        "Cost" varchar(20),
        "Damage" varchar(20),
        "Range" varchar(20),
        "Weight" integer,
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
        "Damage_Modifier" varchar(20),
        "Range_Modifier" varchar(20),
        PRIMARY KEY ("Weapon_Name", "Property_Name")
);

CREATE TYPE armor_proficiencies AS ENUM ('Light', 'Medium', 'Heavy', 'Sheild');

CREATE TABLE "Armor" (
        "Name" varchar(50),
        "Proficiency" armor_proficiencies,
        "Cost" varchar(20),
        "Weight" integer,
        "Armor_Class" integer,
        "Dexterity_Bonus" boolean,
        "Max_Bonus" integer,
        "Min_Strength" integer,
        "Stealth_Disadvantage" boolean,
        PRIMARY KEY ("Name")
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
        "Cost" varchar(20),
        "Weight" integer,
        "Description" varchar(500),
        PRIMARY KEY ("Name")
);

CREATE TABLE "Pack_Contents" (
        "Pack_Name" varchar(50) REFERENCES "Equipment_Pack" ("Name"),
        "Gear_Name" varchar(50) REFERENCES "Adventuring_Gear" ("Name"),
        "Quantity" integer,
        PRIMARY KEY ("Pack_Name", "Gear_Name")
);


CREATE TABLE "Equipment_Pack" (
        "Name" varchar(50),
        "Cost" varchar(20),
        PRIMARY KEY ("Name")
);