CREATE TYPE spell_components AS ENUM ('verbal', 'somatic', 'material');

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

CREATE TABLE "Tool" (
        "Name" varchar(50),
        "Category" varchar(50),
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

CREATE TYPE weapon_types AS ENUM ('melee', 'ranged', 'other');

CREATE TABLE Weapon (
        "Name" varchar(50),
        "Proficiency" varchar(20),
        "Type" weapon_types,
        "Cost" varchar(20),
        "Damage" varchar(20),
        "Range" varchar(20),
        "Weight" varchar(20),
        PRIMARY KEY ("Name")
);

CREATE TABLE Property (
        "Name" varchar(50),
        "Description" varchar(500),
        PRIMARY KEY ("Name")
);

CREATE TABLE WeaponProperty (
        "Weapon_Name" varchar(50) REFERENCES Weapon ("Name"),
        "Property_Name" varchar(50) REFERENCES Property ("Name"),
        "DamageModifier" varchar(20),
        "RangeModifier" varchar(20),
        PRIMARY KEY ("Weapon_Name", "Property_Name")
);


CREATE TABLE Armor (
        "Name" varchar(50),
        "Proficiency" varchar(20),
        "Cost" varchar(20),
        "Weight" varchar(20),
        "ArmorClass" varchar(20),
        "DexterityBonus" varchar(10),
        "MaxBonus" varchar(10),
        "MinStrength" varchar(10),
        "StealthDisadvantage" boolean,
        PRIMARY KEY ("Name")
);


CREATE TABLE AdventuringGear (
        "Name" varchar(50),
        "Category" varchar(20),
        "Cost" varchar(20),
        "Weight" varchar(20),
        "Description" varchar(500),
        PRIMARY KEY ("Name")
);


CREATE TABLE PackContents (
        "Pack_Name" varchar(50) REFERENCES EquipmentPack ("Name"),
        "Gear_Name" varchar(50) REFERENCES AdventuringGear ("Name"),
        "Quantity" varchar(20),
        PRIMARY KEY ("Pack_Name", "Gear_Name")
);


CREATE TABLE EquipmentPack (
        "Name" varchar(50),
        "Cost" varchar(20),
);