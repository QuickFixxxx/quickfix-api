-- Ensure the user exists
DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'quickfix_user') THEN
      CREATE ROLE quickfix_user WITH LOGIN PASSWORD 'quickfix_password';
   END IF;
END
$$;

-- Ensure the database exists
DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'quickfixDb') THEN
      CREATE DATABASE "quickfixDb" OWNER quickfix_user;
   END IF;
END
$$;

-- Ensure user has the right privileges
GRANT ALL PRIVILEGES ON DATABASE "quickfixDb" TO quickfix_user;
