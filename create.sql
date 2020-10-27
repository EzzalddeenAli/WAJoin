-- Table: public.User

-- DROP TABLE public."User";

CREATE TABLE public."User"
(
    user_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    CONSTRAINT "User_pkey" PRIMARY KEY (user_id)
)

TABLESPACE pg_default;

ALTER TABLE public."User"
    OWNER to wajoin;


-- Table: public.JoinJob

-- DROP TABLE public."JoinJob";

CREATE TABLE public."JoinJob"
(
    last_run timestamp without time zone,
    invite_code text COLLATE pg_catalog."default" NOT NULL,
    user_id integer NOT NULL,
    created timestamp without time zone NOT NULL,
    qrcode text COLLATE pg_catalog."default",
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    state text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "JoinJob_pkey" PRIMARY KEY (id)
)


-- Table: public.User

-- DROP TABLE public."User";

CREATE TABLE public."User"
(
    name text COLLATE pg_catalog."default" NOT NULL,
    google_id text COLLATE pg_catalog."default",
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    CONSTRAINT "User_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public."User"
    OWNER to wajoin;
