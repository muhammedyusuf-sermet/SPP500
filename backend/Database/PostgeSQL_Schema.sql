CREATE TYPE spell_components AS ENUM ('Verbal', 'Somatic', 'Material');

CREATE TABLE "Spell" (
        "Id" serial PRIMARY KEY,
        "Name" varchar(50) UNIQUE NOT NULL,
        "Level" integer DEFAULT 1,
        "Casting_Time" varchar(50) DEFAULT '1 action',
        "Range" varchar(50) DEFAULT '60 feet',
        "Components" spell_components ARRAY,
        "Material" varchar(500),
        "Duration" varchar(50),
        "Description" text ARRAY,
        "Higher_Level" text,
        "School" varchar(50),
        CONSTRAINT Positive_Level CHECK ("Level" > 0)
);

CREATE TYPE tool_categories AS ENUM (
        'Artisan''s Tools',
        'Gaming Sets',
        'Musical Instrument',
        'Other Tools'
);

CREATE TABLE "Tool" (
        "Id" serial PRIMARY KEY,
        "Name" varchar(50) UNIQUE NOT NULL,
        "Category" tool_categories,
        "Cost" integer DEFAULT 1,
        "Weight" integer DEFAULT 1,
        "Description" text,
        CONSTRAINT Positive_Cost CHECK ("Cost" > 0)
);

CREATE TABLE "Damage_Type" (
        "Id" serial PRIMARY KEY,
        "Name" varchar(50) UNIQUE NOT NULL,
        "Description" varchar(500),
);

CREATE TYPE weapon_types AS ENUM ('Melee', 'Ranged', 'Other');
CREATE TYPE weapon_proficiencies AS ENUM ('Simple', 'Martial');

CREATE TABLE "Weapon" (
        "Id" serial PRIMARY KEY,
        "Name" varchar(50) UNIQUE NOT NULL,
        "Damage_Type_Id" integer REFERENCES "Damage_Type" ("Id"),
        "Proficiency" weapon_proficiencies,
        "Type" weapon_types,
        "Cost" integer DEFAULT 1,
        "Damage" varchar(20) DEFAULT '1d4',
        "Range" varchar(20) DEFAULT '(5/-)',
        "Weight" integer DEFAULT 1,
        CONSTRAINT Positive_Cost CHECK ("Cost" > 0)
);

CREATE TABLE "Property" (
        "Id" serial PRIMARY KEY,
        "Name" varchar(50) UNIQUE NOT NULL,
        "Description" varchar(500),
);

CREATE TABLE "Weapon_Property" (
        "Weapon_Id" integer REFERENCES "Weapon" ("Id"),
        "Property_Id" integer REFERENCES "Property" ("Id"),
        "Damage_Modifier" varchar(20) DEFAULT '-',
        "Range_Modifier" varchar(20) DEFAULT '(-/-)',
        PRIMARY KEY ("Weapon_Id", "Property_Id")
);

CREATE TYPE armor_proficiencies AS ENUM ('Light', 'Medium', 'Heavy', 'Sheild');

CREATE TABLE "Armor" (
        "Id" serial PRIMARY KEY,
        "Name" varchar(50) UNIQUE NOT NULL,
        "Proficiency" armor_proficiencies,
        "Cost" integer DEFAULT 1,
        "Weight" integer DEFAULT 1,
        "Armor_Class" integer DEFAULT 1,
        "Dexterity_Bonus" boolean DEFAULT false,
        "Max_Bonus" integer DEFAULT null,
        "Min_Strength" integer DEFAULT null,
        "Stealth_Disadvantage" boolean DEFAULT false,
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
        "Id" serial PRIMARY KEY,
        "Name" varchar(50) UNIQUE NOT NULL,
        "Category" adventuring_gear_categories,
        "Cost" integer DEFAULT 1,
        "Weight" integer DEFAULT 1,
        "Description" varchar(500),
        CONSTRAINT Positive_Cost CHECK ("Cost" > 0)
);

CREATE TABLE "Pack_Contents" (
        "Equipment_Pack_Id" integer REFERENCES "Equipment_Pack" ("Id"),
        "Adventuring_Gear_Id" integer REFERENCES "Adventuring_Gear" ("Id"),
        "Quantity" integer DEFAULT 1,
        PRIMARY KEY ("Pack_Id", "Gear_Id"),
        CONSTRAINT Positive_Quantity CHECK ("Quantity" > 0)
);

CREATE TABLE "Equipment_Pack" (
        "Id" serial PRIMARY KEY,
        "Name" varchar(50) UNIQUE NOT NULL,
        "Cost" integer DEFAULT 1,
        CONSTRAINT Positive_Cost CHECK ("Cost" > 0)
);

CREATE TABLE "Ability_Score" (
        "Id" serial PRIMARY KEY,
        "Name" varchar(50) UNIQUE NOT NULL,
        "Abbreviation" char(3),
        "Description" varchar(500)
);

CREATE TABLE "Skill" (
        "Ability_Score_Id" integer REFERENCES "Ability_Score" ("Id"),
        "Id" serial PRIMARY KEY,
        "Name" varchar(50) UNIQUE NOT NULL,
        "Description" varchar(500)
);

CREATE TABLE "Condition" (
        "Id" serial PRIMARY KEY,
        "Name" varchar(50) UNIQUE NOT NULL,
        "Description" varchar(500)
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
        "Id" serial PRIMARY KEY,
        "Name" varchar(50) UNIQUE NOT NULL,
        "Size" monster_size DEFAULT 'Medium',
        "Type" monster_type DEFAULT 'Beast',
        "Race" monster_race DEFAULT 'Any race',
        "Alignment" alignment DEFAULT 'Unaligned',
        "Armor_Class" integer DEFAULT 12,
        "Hit_Points" integer DEFAULT 12,
        -- hit_dice but missing base for some reason?
        "Damage" varchar(20) DEFAULT '2d8',
        "Speed" varchar(100) DEFAULT '30 ft.',
        "Senses" varchar(100) DEFAULT '',
        "Languages" varchar(100) DEFAULT '',
        "Challange_Rating" integer DEFAULT 1,
        "Special_Abillities" json DEFAULT '[]',
        "Actions" json DEFAULT '[]',
        "Reactions" json DEFAULT '[]',
        "Legendary_Actions" json DEFAULT '[]',
        CONSTRAINT Positive_Armor_class CHECK ("Armor_Class" > 0),
        CONSTRAINT Positive_Hit_Points CHECK ("Hit_Points" > 0),
        CONSTRAINT Positive_Challange_Rating CHECK ("Challange_Rating" > 0)
);

-- stats of the monsters ability scores
CREATE TABLE "Monster_Ability_Score" (
        "Monster_Id" integer REFERENCES "Monster" ("Id"),
        "Damage_Type_Id" integer REFERENCES "Damage_Type" ("Id"),
        "Score" integer DEFAULT 0,
        PRIMARY KEY ("Monster_Id", "Damage_Type_Id"),
        CONSTRAINT Positive_Score CHECK ("Score" >= 0)
)

-- bonus applied when monster uses a specific skill
CREATE TABLE "Monster_Skill" (
        "Monster_Id" integer REFERENCES "Monster" ("Id"),
        "Skill_Id" integer REFERENCES "Skill" ("Id"),
        "Bonus" integer DEFAULT 0,
        PRIMARY KEY ("Monster_Id", "Skill_Id"),
        CONSTRAINT Positive_Bonus CHECK ("Bonus" >= 0),
);

-- bonus applied when monster has to do a saving throw for a specific ability
CREATE TABLE "Monster_Saving_Throw" (
        "Monster_Id" integer REFERENCES "Monster" ("Id"),
        "Ability_Score_Id" integer REFERENCES "Ability_Score" ("Id"),
        "Bonus" integer DEFAULT 0,
        PRIMARY KEY ("Monster_Id", "Ability_Score_Id"),
        CONSTRAINT Positive_Bonus CHECK ("Bonus" >= 0),
);

-- options for defining resistance used with damage_type
CREATE TYPE resistance_type AS ENUM (
        'Vulnerable',
        'Resistance',
        'Immunity'
);

-- types of damage that the monster is either vulnerable, resistant or immune to.
CREATE TABLE "Monster_Damage_Type_Resistance" (
        "Monster_Id" integer REFERENCES "Monster" ("Id"),
        "Damage_Type_Id" integer REFERENCES "Damage_Type" ("Id"),
        "Type" resistance_type DEFAULT 'Resistance',
        PRIMARY KEY ("Monster_Id", "Damage_Type_Id"),
);

-- conditions that don't affect this monster
CREATE TABLE "Monster_Condition_Immunity" (
        "Monster_Id" integer REFERENCES "Monster" ("Id"),
        "Condition_Id" integer REFERENCES "Condition" ("Id"),
        PRIMARY KEY ("Monster_Id", "Condition_Id"),
);

CREATE TABLE "User" (
        "Id" serial PRIMARY KEY,
        "Name" varchar(50) NOT NULL,
        "Email" varchar(200),
        PRIMARY KEY ("Name")
);

CREATE TABLE "Encounter" (
        "User_Id" varchar(50) REFERENCES "User" ("Id"),
        "Id" serial,
        "Name" varchar(50) NOT NULL,
        PRIMARY KEY ("User_Id", "Id")
);

CREATE TABLE "Encounter_Location" (
        "Encounter_Name" varchar(50), REFERENCES "Encounter" ("Name")
        "Encounter_User_Name" varchar(50) REFERENCES "Encounter" ("User_Name")
        "Location_Name" varchar(50) REFERENCES "Location"
        PRIMARY KEY ("Name", "User_Name", "Location_Name")
);