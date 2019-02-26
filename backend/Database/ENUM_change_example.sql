CREATE TYPE admin_level1 AS ENUM ('classifier', 'moderator');

CREATE TABLE blah (
    user_id integer primary key,
    power admin_level1 not null
);

INSERT INTO blah(user_id, power) VALUES (1, 'moderator'), (10, 'classifier');

ALTER TYPE admin_level1 ADD VALUE 'god';

INSERT INTO blah(user_id, power) VALUES (42, 'god');

-- .... oops, maybe that was a bad idea

CREATE TYPE admin_level1_new AS ENUM ('classifier', 'moderator');

-- Remove values that won't be compatible with new definition
-- You don't have to delete, you might update instead
DELETE FROM blah WHERE power = 'god';

-- Convert to new type, casting via text representation
ALTER TABLE blah 
  ALTER COLUMN power TYPE admin_level1_new 
    USING (power::text::admin_level1_new);

-- and swap the types
DROP TYPE admin_level1;

ALTER TYPE admin_level1_new RENAME TO admin_level1;