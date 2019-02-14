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
        "Cost" integer DEFAULT 1,
        "Weight" integer DEFAULT 1,
        "Description" text,
        PRIMARY KEY ("Name"),
        CONSTRAINT Positive_Cost CHECK ("Cost" > 0)
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
        "Damage_Type_Name" varchar(50) REFERENCES "Damage_Type" ("Name"),
        "Proficiency" weapon_proficiencies,
        "Type" weapon_types,
        "Cost" integer DEFAULT 1,
        "Damage" varchar(20) DEFAULT '1d4',
        "Range" varchar(20) DEFAULT '(5/-)',
        "Weight" integer DEFAULT 1,
        PRIMARY KEY ("Name"),
        CONSTRAINT Positive_Cost CHECK ("Cost" > 0)
);

CREATE TABLE "Property" (
        "Name" varchar(50),
        "Description" varchar(500),
        PRIMARY KEY ("Name")
);

CREATE TABLE "Weapon_Property" (
        "Weapon_Name" varchar(50) REFERENCES "Weapon" ("Name"),
        "Property_Name" varchar(50) REFERENCES "Property" ("Name"),
        "Damage_Modifier" varchar(20) DEFAULT '-',
        "Range_Modifier" varchar(20) DEFAULT '(-/-)',
        PRIMARY KEY ("Weapon_Name", "Property_Name")
);

CREATE TYPE armor_proficiencies AS ENUM ('Light', 'Medium', 'Heavy', 'Sheild');

CREATE TABLE "Armor" (
        "Name" varchar(50),
        "Proficiency" armor_proficiencies,
        "Cost" integer DEFAULT 1,
        "Weight" integer DEFAULT 1,
        "Armor_Class" integer DEFAULT 1,
        "Dexterity_Bonus" boolean DEFAULT false,
        "Max_Bonus" integer DEFAULT null,
        "Min_Strength" integer DEFAULT null,
        "Stealth_Disadvantage" boolean DEFAULT false,
        PRIMARY KEY ("Name"),
        CONSTRAINT Positive_Armor_class CHECK ("Armor_Class" > 0),
        CONSTRAINT Positive_Cost CHECK ("Cost" > 0)
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
        "Cost" integer DEFAULT 1,
        "Weight" integer DEFAULT 1,
        "Description" varchar(500),
        PRIMARY KEY ("Name"),
        CONSTRAINT Positive_Cost CHECK ("Cost" > 0)
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
        "Cost" integer DEFAULT 1,
        PRIMARY KEY ("Name"),
        CONSTRAINT Positive_Cost CHECK ("Cost" > 0)
);

CREATE TABLE "Ability_Score" (
        "Name" varchar(50),
        "Abbreviation" char(3),
        "Description" varchar(500),
        PRIMARY KEY ("Name")
);

CREATE TABLE "Skill" (
        "Ability_Score_Name" varchar(50) REFERENCES "Ability_Score" ("Name"),
        "Name" varchar(50),
        "Description" varchar(500),
        PRIMARY KEY ("Name")
);

CREATE TABLE "Condition" (
        "Name" varchar(50),
        "Description" varchar(500),
        PRIMARY KEY ("Name")
);

CREATE TYPE monster_size AS ENUM (
        'Tiny',
        'Small',
        'Medium',
        'Large',
        'Huge',
        'Gargantuan'
);
CREATE TYPE monster_type AS ENUM (
        'Beast',
        'Dragon',
        'Monstrosity',
        'Humanoid',
        'Fiend',
        'Undead',
        'Giant',
        'Elemental',
        'Swarm of Tiny beasts',
        'Construct',
        'Celestial',
        'Aberration',
        'Fey',
        'Plant',
        'Ooze'
);
CREATE TYPE monster_race AS ENUM (
        'Any race',
        'Devil',
        'Demon',
        'Human',
        'Shapechanger',
        'Goblinoid',
        'Titan',
        'Gnoll',
        'Gnome',
        'Dwarf',
        'Elf',
        'Orc',
        'Kobold',
        'Lizardfolk',
        'Merfolk',
        'Sahuagin',
        'Grimlock'
);
CREATE TYPE alignment AS ENUM (
        'Unaligned'
        'Any alignment',
        'Lawful good',
        'Lawful neutral',
        'Lawful evil',
        'Neutral good'
        'Neutral'
        'Neutral evil'
        'Chaotic good'
        'Chaotic neutral'
        'Chaotic evil'
);

CREATE TABLE "Monster" (
        "Name" varchar(50),
        "Size" monster_size DEFAULT 'Medium',
        "Type" monster_type DEFAULT 'Beast',
        "Race" monster_race DEFAULT 'Any race',
        "Alignment" alignment DEFAULT 'Unaligned',
        "Armor_Class" integer,
        "Hit_Points" integer,
        "Hit_Die" varchar(20),
        "Speed" varchar(100),
        "Senses" varchar(100),
        "Languages" varchar(100),
        "Challange_Rating" integer,
        -- Special_abillities
        -- Actions
        -- Legendary Actions
        PRIMARY KEY ("Name"),
        CONSTRAINT Positive_Armor_class CHECK ("Armor_Class" > 0),
        CONSTRAINT Positive_Hit_Points CHECK ("Hit_Points" > 0),
        CONSTRAINT Positive_Challange_Rating CHECK ("Challange_Rating" > 0)
);

CREATE TYPE monster_damage_type AS ENUM (
        'Vulnerable',
        'Resistance',
        'Immunity'
);

CREATE TABLE "Monster_Damage" (
        "Monster_Name" varchar(50) REFERENCES "Monster" ("Name"),
        "Damage_Type_Name" varchar(50) REFERENCES "Damage_Type" ("Name"),
        "Type" monster_damage_type DEFAULT 'Resistance',
        PRIMARY KEY ("Monster_Name", "Damage_Type_Name"),
);

CREATE TABLE "Monster_Skill" (
        "Monster_Name" varchar(50) REFERENCES "Monster" ("Name"),
        "Skill_Name" varchar(50) REFERENCES "Skill" ("Name"),
        "Type" monster_damage_type DEFAULT 'Resistance',
        PRIMARY KEY ("Monster_Name", "Damage_Type_Name"),
);